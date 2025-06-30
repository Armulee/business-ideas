import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Resend } from "resend"
import crypto from "crypto"
import { VerifyEmailTemplate } from "@/lib/email-template"

const resend = new Resend(process.env.AUTH_RESEND_KEY)

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json()

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            )
        }

        // Find user with this email
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        // Generate new verification token
        const verificationToken = crypto.randomBytes(32).toString("hex")
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

        // Update user with new token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                verificationToken,
                verificationExpires,
            }
        })

        // Send verification email
        const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/setup-account/${verificationToken}`
        
        await resend.emails.send({
            from: "BlueBizHub <no-reply@bluebizhub.com>",
            to: email,
            subject: "Complete Your Account Setup - BlueBizHub",
            react: VerifyEmailTemplate({ 
                name: user.name, 
                verifyUrl: verificationUrl 
            })
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Resend verification error:", error)
        return NextResponse.json(
            { error: "Failed to send verification email" },
            { status: 500 }
        )
    }
}