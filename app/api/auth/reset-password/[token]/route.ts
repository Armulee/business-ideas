// app/api/auth/reset-password/[token]/route.ts
export const runtime = "nodejs"

import { NextResponse } from "next/server"
import connectDB from "@/database"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import { Prisma } from "@prisma/client"

interface ApiResponse {
    message: string
    code: string
    passwordAge?: number | null
    rateLimit?: {
        maxAttempts: number
        windowMinutes: number
        message: string
    }
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

        // Calculate password age and rate limiter info
        const passwordAge = user.passwordHistory && user.passwordHistory.length > 0 
            ? (() => {
                const lastEntry = user.passwordHistory[user.passwordHistory.length - 1] as { hash: string; createdAt: string }
                const lastChange = new Date(lastEntry.createdAt)
                const monthsDiff = Math.floor((Date.now() - lastChange.getTime()) / (1000 * 60 * 60 * 24 * 30))
                return monthsDiff
            })()
            : null

        // token is good
        return NextResponse.json(
            { 
                message: "Token valid", 
                code: "TOKEN_VALID",
                passwordAge: passwordAge,
                rateLimit: {
                    maxAttempts: 6,
                    windowMinutes: 15,
                    message: "6 attempts allowed per 15 minutes"
                }
            },
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

        // Check if new password matches current password
        if (user.password && await bcrypt.compare(password, user.password)) {
            return NextResponse.json(
                { message: "New password cannot be the same as current password", code: "PASSWORD_REUSE" },
                { status: 400 }
            )
        }

        // Check if new password matches any password from the last 3 months
        const threeMonthsAgo = new Date()
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
        
        if (user.passwordHistory && user.passwordHistory.length > 0) {
            for (const entry of user.passwordHistory) {
                const historyEntry = entry as { hash: string; createdAt: string }
                const entryDate = new Date(historyEntry.createdAt)
                
                // Only check passwords from the last 3 months
                if (entryDate >= threeMonthsAgo) {
                    if (await bcrypt.compare(password, historyEntry.hash)) {
                        return NextResponse.json(
                            { message: "You cannot reuse a password from the last 3 months", code: "PASSWORD_HISTORY_REUSE" },
                            { status: 400 }
                        )
                    }
                }
            }
        }

        // Add current password to history if it exists
        const newPasswordHistory = [...(user.passwordHistory || [])]
        if (user.password) {
            newPasswordHistory.push({
                hash: user.password,
                createdAt: new Date().toISOString()
            })
        }
        
        // Clean up old entries (older than 3 months)
        const filteredHistory = newPasswordHistory.filter(entry => {
            const historyEntry = entry as { hash: string; createdAt: string }
            const entryDate = new Date(historyEntry.createdAt)
            return entryDate >= threeMonthsAgo
        })

        // Update password + clear token + update history
        const hashed = await bcrypt.hash(password, 10)
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashed,
                resetToken: null,
                resetTokenExpires: null,
                passwordHistory: filteredHistory as Prisma.InputJsonValue[],
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
