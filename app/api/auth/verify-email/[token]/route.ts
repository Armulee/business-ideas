// app/api/auth/verify-email/route.ts
export const runtime = "nodejs"

import { NextResponse } from "next/server"
import connectDB from "@/database"
import User from "@/database/User"
import { encode } from "next-auth/jwt"
import { serialize } from "cookie"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ token: string }> }
) {
    const { token } = await params
    if (!token) {
        return NextResponse.json({
            message: "No verification token provided",
            code: "NO_TOKEN",
            status: 400,
        })
    }

    await connectDB()

    const user = await User.findOne({ verificationToken: token })
    if (!user) {
        return NextResponse.json({
            message: "No verifiction token found",
            code: "INVALID_TOKEN",
            status: 404,
        })
    }

    // expired?
    if (!user.verificationExpires || user.verificationExpires < Date.now()) {
        // clear stale token
        await user.deleteOne()

        return NextResponse.json({
            message: "The verification token has expired, please sign up again",
            code: "EXPIRED_TOKEN",
            status: 400,
        })
    }

    // valid → mark verified
    await user.updateOne({
        $set: { verified: true },
        $unset: { verificationToken: "", verificationExpires: "" },
    })

    // issue NextAuth session-token cookie
    if (!process.env.NEXTAUTH_SECRET) {
        throw new Error("Missing NEXTAUTH_SECRET")
    }
    const jwt = await encode({
        token: {
            sub: user.id.toString(),
            email: user.email,
            name: user.name,
        },
        secret: process.env.NEXTAUTH_SECRET,
        maxAge: 60 * 60 * 24 * 30, // 30 days
    })
    const cookie = serialize("next-auth.session-token", jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
    })

    // ✅ Redirect to frontend with cookie
    return new NextResponse(null, {
        status: 302,
        headers: {
            "Set-Cookie": cookie,
            Location: process.env.NEXTAUTH_URL || "https://bluebizhub.com",
        },
    })
}
