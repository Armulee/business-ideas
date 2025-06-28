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
            host: "smtp-relay.brevo.com", // Brevo’s SMTP host
            port: 587, // TLS port
            secure: false, // false → STARTTLS (use true for port 465)
            auth: {
                user: process.env.EMAIL_SERVER_USER, // your SMTP “login” (often your sender email) :contentReference[oaicite:0]{index=0}
                pass: process.env.EMAIL_SERVER_PASS, // your SMTP key (not your API key) :contentReference[oaicite:1]{index=1}
            },
        })

        const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email/${token}`

        await transporter.sendMail({
            to: email,
            from: "BlueBizHub Service <no-reply@bluebizhub.com>",
            subject: "Verify your email",
            html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; background-color: #f9f9f9; border-radius: 8px; color: #333;">
    <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="font-size: 28px; color: #111; margin: 0;">
            <span style="color: #3b82f6;">Blue</span>BizHub
        </h1>
        <span style="display: inline-flex;align-items: center;padding: 4px 12px;border-radius: 9999px;font-size: 14px;font-weight: 500;background: rgba(255, 255, 255, 0.1);backdrop-filter: blur(4px);color: #ffffff;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" style="margin-right: 6px; vertical-align: middle;" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                <path d="M20 3v4"></path>
                <path d="M22 5h-4"></path>
                <path d="M4 17v2"></path>
                <path d="M5 18H3"></path>
            </svg>
            Idea, Validate, Refine
        </span>
    </div>

    <div style="background: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
        <h2 style="color: #111;">Welcome, ${name || "there"}!</h2>
        <p>Thank you for signing up with <strong>BlueBizHub</strong>. We're excited to have you join our community of innovators and entrepreneurs.</p>
        <p>To activate your account, please verify your email address by clicking the button below:</p>

        <div style="text-align: center; margin: 24px 0;">
        <a href="${verifyUrl}" style="background-color: #3b82f6; color: white; text-decoration: none; padding: 12px 20px; border-radius: 6px; font-size: 16px; display: inline-block;">
            Verify My Email
        </a>
        </div>

        <p>This link will expire in 24 hours for your security. If you did not sign up, you can safely ignore this email.</p>
    </div>

    <div style="text-align: center; font-size: 12px; color: #999; margin-top: 24px;">
        &copy; ${new Date().getFullYear()} <span style="color: #3b82f6;">Blue</span>BizHub. All rights reserved.<br/>
        You received this email because someone registered with your email address.
    </div>
</div>
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
