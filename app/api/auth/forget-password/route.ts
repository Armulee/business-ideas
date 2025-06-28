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
            from: "no-reply@bluebizhub.com",
            subject: "Password Reset Request",
            html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to set a new password.</p>`,
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
