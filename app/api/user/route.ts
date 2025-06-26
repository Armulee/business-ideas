import connectDB from "@/database"
import User from "@/database/User"
import bcrypt from "bcrypt"
import crypto from "crypto"
import nodemailer from "nodemailer"
import { NextRequest, NextResponse } from "next/server"

// get user email exists in the database or not?
export async function GET(req: NextRequest) {
    try {
        await connectDB()

        const searchParams = req.nextUrl.searchParams
        const email = searchParams.get("email")
        const user = await User.findOne({ email })

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

export async function POST(req: Request) {
    try {
        await connectDB()

        const { name, email, password, provider } = await req.json()
        const user = await User.findOne({ email })
        // handle existing user
        if (user) {
            // Already fully signed up & verified?
            if (user.provider === "credentials") {
                return NextResponse.json(
                    { message: "This email is already registered." },
                    { status: 409 }
                )
            }

            const provider =
                user.provider[0].toUpperCase() + user.provider.slice(1)
            return new NextResponse(
                JSON.stringify({
                    message: `This email have been registered with us before via ${provider}. Please continue by login with the ${provider} method.`,
                }),
                {
                    status: 409,
                }
            )
        }

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10)
        // create new User model
        const newUser = await new User({
            name,
            email,
            password: hashedPassword,
            provider,
            verified: false,
        })
        await newUser.save()

        // Generate one-time verification token (24h expiry)
        const token = crypto.randomBytes(32).toString("hex")
        newUser.verificationToken = token
        newUser.verificationExpires = Date.now() + 24 * 60 * 60 * 1000
        await newUser.save()

        // Send verification email
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVER_HOST,
            port: +process.env.EMAIL_SERVER_PORT!,
            secure: process.env.EMAIL_SERVER_SECURE === "true",
            auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
            },
        })

        const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email/${token}`

        await transporter.sendMail({
            to: email,
            from: process.env.EMAIL_FROM,
            subject: "Verify your email",
            html: `
          <p>Hi ${name},</p>
          <p>
            Thanks for signing up with BlueBizHub! Please verify your email by clicking the link below:
          </p>
          <p>
            <a href="${verifyUrl}">Verify my account</a>
          </p>
          <p>This link expires in 24 hours.</p>
        `,
        })

        return NextResponse.json(
            { message: "Registration Completed" },
            { status: 201 }
        )
    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }
}
