// app/api/auth/reset-password/[token]/route.ts
export const runtime = "nodejs"

import { NextResponse } from "next/server"
import connectDB from "@/database"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

interface ApiResponse {
    message: string
    code: string
}

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ token: string }> }
) {
    const { token } = await params

    try {
        await connectDB()

        const user = await prisma.user.findFirst({ 
            where: { resetToken: token } 
        })
        if (!user) {
            return NextResponse.json<ApiResponse>(
                {
                    message:
                        "Please check the link again or request a new reset link by clicking the link below.",
                    code: "INVALID_TOKEN",
                },
                { status: 404 }
            )
        }

        if (
            !user.resetTokenExpires ||
            user.resetTokenExpires < new Date()
        ) {
            // remove stale token fields
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    resetToken: null,
                    resetTokenExpires: null,
                }
            })
            return NextResponse.json<ApiResponse>(
                {
                    message:
                        "The link has expired. Please request a new reset link by clicking the link below.",
                    code: "EXPIRED_TOKEN",
                },
                { status: 400 }
            )
        }

        // token is good
        return NextResponse.json<ApiResponse>(
            { message: "Token valid", code: "TOKEN_VALID" },
            { status: 200 }
        )
    } catch (error) {
        console.error(error)
        return NextResponse.json<ApiResponse>(
            { message: "Internal Server Error", code: "INTERNAL_ERROR" },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    const { password, token } = await request.json()
    try {
        await connectDB()

        const user = await prisma.user.findFirst({ 
            where: { resetToken: token } 
        })
        if (!user) {
            return NextResponse.json(
                { message: "Invalid or missing token", code: "INVALID_TOKEN" },
                { status: 400 }
            )
        }

        if (
            !user.resetTokenExpires ||
            user.resetTokenExpires < new Date()
        ) {
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    resetToken: null,
                    resetTokenExpires: null,
                }
            })
            return NextResponse.json(
                { message: "Token has expired", code: "EXPIRED_TOKEN" },
                { status: 400 }
            )
        }

        // Update password + clear token
        const hashed = await bcrypt.hash(password, 10)
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashed,
                resetToken: null,
                resetTokenExpires: null,
            }
        })

        return NextResponse.json(
            {
                message:
                    "Please click the button below to go to the login page and sign in.",
                code: "PASSWORD_RESET_SUCCESS",
            },
            { status: 200 }
        )
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { message: "Internal Server Error", code: "INTERNAL_ERROR" },
            { status: 500 }
        )
    }
}
