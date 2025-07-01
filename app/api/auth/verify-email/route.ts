import connectDB from "@/database"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { Resend } from "resend"
import crypto from "crypto"
import { VerifyEmailTemplate } from "@/lib/email-template"

const resend = new Resend(process.env.AUTH_RESEND_KEY)
export async function POST(req: Request) {
    try {
        await connectDB()

        const { email, username } = await req.json()

        // Check if user already exists in PostgreSQL
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            if (
                existingUser.provider &&
                existingUser.provider !== "credentials" &&
                existingUser.provider !== "passkey"
            ) {
                const userProvider = existingUser.provider
                    ? existingUser.provider[0].toUpperCase() +
                      existingUser.provider.slice(1)
                    : "OAuth"
                return new NextResponse(
                    JSON.stringify({
                        message: `This email have been registered with us before via ${userProvider}. Please continue by login with the ${userProvider} method.`,
                    }),
                    {
                        status: 409,
                    }
                )
            }

            return NextResponse.json(
                { message: "This email is already registered." },
                { status: 409 }
            )
        }

        // Generate one-time verification token (24h expiry)
        const token = crypto.randomBytes(32).toString("hex")
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)

        await prisma.user.create({
            data: {
                username,
                email,
                emailVerified: null, // Not verified yet
                verificationToken: token,
                verificationExpires,
            },
        })

        // New email-only registration flow
        const verifyUrl = `${process.env.AUTH_URL || process.env.NEXTAUTH_URL}/auth/setup-account?token=${token}`

        // Send verification email
        const { data, error } = await resend.emails.send({
            from: "BlueBizHub Service <no-reply@bluebizhub.com>",
            to: [email],
            subject: "Verify Your Email",
            react: VerifyEmailTemplate({ name: username, verifyUrl }),
        })

        if (error) {
            return NextResponse.json({ error }, { status: 201 })
        }

        return NextResponse.json({ data }, { status: 201 })
    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }
}
