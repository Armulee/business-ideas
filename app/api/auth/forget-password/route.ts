import connectDB from "@/database"
import User from "@/database/User"
import { NextResponse } from "next/server"
import crypto from "crypto"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
    try {
        const { email } = await req.json()

        connectDB()

        const user = await User.findOne({ email })
        if (!user)
            return NextResponse.json(
                {
                    message:
                        "Email not found, please revise the email you have entered.",
                },
                { status: 404 }
            )

        if (user.provider !== "credentials") {
            const provider =
                user.provider[0].toUpperCase() + user.provider.slice(1)
            return NextResponse.json(
                {
                    message: `This email has been registered with ${provider}, please continue with the ${provider} to login`,
                },
                { status: 404 }
            )
        }

        // generate reset token
        const token = crypto.randomBytes(32).toString("hex")
        // const expires = Date.now() + 3600000 // 1 hour
        user.resetPasswordToken = token
        // user.resetPasswordExpires = expires
        await user.save()

        // send email
        const transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com", // Brevo’s SMTP host
            port: 587, // TLS port
            secure: false, // false → STARTTLS (use true for port 465)
            auth: {
                user: process.env.EMAIL_SERVER_USER, // your SMTP “login” (often your sender email) :contentReference[oaicite:0]{index=0}
                pass: process.env.EMAIL_SERVER_PASS, // your SMTP key (not your API key) :contentReference[oaicite:1]{index=1}
            },
        })
        const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${token}`
        await transporter.sendMail({
            to: user.email,
            from: "BlueBizHub Service <no-reply@bluebizhub.com>",
            subject: "Password Reset Request",
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
        <h2 style="color: #111;">Password Reset Request</h2>
        <p>Hi ${user.name || "there"},</p>
        <p>We received a request to reset the password associated with this email address. If you made this request, please click the button below to set a new password:</p>
        
        <div style="text-align: center; margin: 24px 0;">
        <a href="${resetUrl}" style="background-color: #3b82f6; color: white; text-decoration: none; padding: 12px 20px; border-radius: 6px; font-size: 16px; display: inline-block;">
            Reset Password
        </a>
        </div>

        <p>If you didn't request this, you can safely ignore this email. Your current password will remain unchanged.</p>
        <p style="font-size: 13px; color: #888;">This link will expire in 30 minutes for your security.</p>
    </div>

    <div style="text-align: center; font-size: 12px; color: #999; margin-top: 24px;">
        &copy; ${new Date().getFullYear()} <span style="color: #3b82f6;">Blue</span>BizHub. All rights reserved.<br/>
        You received this email because you have an account with us.
    </div>
</div>
  `,
        })
        return NextResponse.json({ message: "Email sent" }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }
}
