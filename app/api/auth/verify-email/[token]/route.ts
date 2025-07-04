import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { signIn } from "@/auth"
// import crypto from "crypto"
// import { serialize } from "cookie"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params
        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    code: "NO_TOKEN",
                    message: "No verification token provided",
                },
                { status: 400 }
            )
        }

        const user = await prisma.user.findFirst({
            where: { verificationToken: token },
        })
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    code: "INVALID_TOKEN",
                    message: "Invalid or already used token",
                },
                { status: 404 }
            )
        }

        // Check if token has expired
        if (user.verificationExpires && new Date() > user.verificationExpires) {
            return NextResponse.json(
                {
                    success: false,
                    code: "EXPIRED_TOKEN",
                    message: "Token has expired",
                    email: user.email,
                },
                { status: 400 }
            )
        }

        // Create session for valid token
        // const sessionExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        // const sessionToken = crypto.randomUUID()
        // const sessionExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        // const sessionToken = crypto.randomUUID()

        // await prisma.session.create({
        //     data: {
        //         sessionToken,
        //         userId: user.id,
        //         expires: sessionExpires,
        //     },
        // })
        // await prisma.session.create({
        //     data: {
        //         sessionToken,
        //         userId: user.id,
        //         expires: sessionExpires,
        //     },
        // })

        // response.headers.set(
        //     "Set-Cookie",
        //     serialize("authjs.session-token", sessionToken, {
        //         httpOnly: true,
        //         path: "/",
        //         sameSite: "lax",
        //         secure: process.env.NODE_ENV === "production",
        //         expires: sessionExpires,
        //     })
        // )

        await signIn("credentials", {
            email: user.email,
            password: token,
            redirect: false,
        })

        return NextResponse.json({
            success: true,
            code: "TOKEN_VALID",
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        })
    } catch (error) {
        console.error("Verify email error:", error)
        return NextResponse.json(
            {
                success: false,
                code: "DATABASE_ERROR",
                message:
                    error instanceof Error
                        ? error.message
                        : "Database connection error",
            },
            { status: 500 }
        )
    }
}
