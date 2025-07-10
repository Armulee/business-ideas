import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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
            select: {
                id: true,
                email: true,
                name: true,
                callbackUrl: true,
                verificationExpires: true,
            },
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

        return NextResponse.json({
            success: true,
            code: "TOKEN_VALID",
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                callbackUrl: user.callbackUrl,
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
