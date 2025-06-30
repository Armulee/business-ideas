import connectDB from "@/database"
import { prisma } from "@/lib/prisma"
import Profile from "@/database/Profile"
import bcrypt from "bcrypt"
import crypto from "crypto"
import { NextRequest, NextResponse } from "next/server"
import {
    generateRandomWord,
    generateUsername,
} from "@/lib/generate-random-name"
import { Resend } from "resend"
import { VerifyEmailTemplate } from "@/lib/email-template"

// get user email exists in the database or not?
export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams
        const email = searchParams.get("email")

        if (!email) {
            return new NextResponse(
                JSON.stringify({ message: "Email required" }),
                {
                    status: 400,
                }
            )
        }

        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (user) {
            return new NextResponse(JSON.stringify({ message: "found" }), {
                status: 200,
            })
        } else {
            return new NextResponse(JSON.stringify({ message: "not found" }), {
                status: 200,
            })
        }
    } catch (err) {
        console.error(err)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

const resend = new Resend(process.env.RESEND_API_KEY)
export async function POST(req: Request) {
    try {
        await connectDB()

        const { name, email, password, provider } = await req.json()

        // Check if user already exists in PostgreSQL
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            if (existingUser.provider === "credentials") {
                return NextResponse.json(
                    { message: "This email is already registered." },
                    { status: 409 }
                )
            }

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

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Generate one-time verification token (24h expiry)
        const token = crypto.randomBytes(32).toString("hex")
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)

        // Create new PostgreSQL user
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                provider,
                emailVerified: null, // Not verified yet
                verificationToken: token,
                verificationExpires,
            },
        })

        // Create MongoDB profile
        const mongoProfile = await Profile.create({
            name: name || generateUsername() + "-" + generateRandomWord(),
            email,
        })
        await mongoProfile.save()

        // Update PostgreSQL user with profileId
        await prisma.user.update({
            where: { id: newUser.id },
            data: { profileId: mongoProfile._id.toString() },
        })

        const verifyUrl = `${process.env.AUTH_URL || process.env.NEXTAUTH_URL}/api/auth/verify-email/${token}`
        // Send verification email
        const { data, error } = await resend.emails.send({
            from: "BlueBizHub Service <no-reply@bluebizhub.com>",
            to: [email],
            subject: "Verify Your Email",
            react: VerifyEmailTemplate({ name, verifyUrl }),
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
