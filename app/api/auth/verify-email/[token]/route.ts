// app/api/auth/verify-email/route.ts
export const runtime = "nodejs"

import { NextResponse } from "next/server"
import connectDB from "@/database"
import { prisma } from "@/lib/prisma"
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

    const user = await prisma.user.findFirst({ 
        where: { verificationToken: token } 
    })
    
    if (!user) {
        return NextResponse.json({
            message: "No verification token found",
            code: "INVALID_TOKEN",
            status: 404,
        })
    }

    // expired?
    if (!user.verificationExpires || user.verificationExpires < new Date()) {
        // Delete expired user
        await prisma.user.delete({ where: { id: user.id } })

        return NextResponse.json({
            message: "The verification token has expired, please sign up again",
            code: "EXPIRED_TOKEN",
            status: 400,
        })
    }

    // valid → mark verified and clear tokens
    await prisma.user.update({
        where: { id: user.id },
        data: {
            emailVerified: new Date(),
            verificationToken: null,
            verificationExpires: null,
        }
    })

    // issue NextAuth session-token cookie
    if (!process.env.AUTH_SECRET) {
        throw new Error("Missing AUTH_SECRET")
    }
    const jwt = await encode({
        token: {
            sub: user.id.toString(),
            email: user.email,
            name: user.name,
        },
        secret: process.env.AUTH_SECRET,
        salt: "",
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
            Location: process.env.AUTH_URL || "https://bluebizhub.com",
        },
    })
}
