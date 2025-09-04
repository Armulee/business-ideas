import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import crypto from "crypto"
import { Resend } from "resend"
import { ForgetPasswordEmailTemplate } from "@/lib/email-template"

const resend = process.env.AUTH_RESEND_KEY ? new Resend(process.env.AUTH_RESEND_KEY) : null

export async function POST(req: Request) {
    try {
        const { email } = await req.json()

        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            return NextResponse.json(
                {
                    message:
                        "Email not found, please revise the email you have entered.",
                },
                { status: 404 }
            )
        }

        if (user.provider !== "credentials") {
            const provider = user.provider
                ? user.provider[0].toUpperCase() + user.provider.slice(1)
                : "OAuth"
            return NextResponse.json(
                {
                    message: `This email has been registered with ${provider}, please continue with the ${provider} to login`,
                },
                { status: 404 }
            )
        }

        // generate reset token
        const token = crypto.randomBytes(32).toString("hex")
        const resetTokenExpires = new Date(Date.now() + 3600000) // 1 hour

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken: token,
                resetTokenExpires,
            },
        })

        // send email
        const resetUrl = `${process.env.AUTH_URL}/auth/reset-password/${token}`
        if (resend) {
            const { data, error } = await resend.emails.send({
                from: "BlueBizHub Service <no-reply@bluebizhub.com>",
                to: [email],
                subject: "Reset Password Request",
                react: ForgetPasswordEmailTemplate({ name: user.name, resetUrl }),
            })

            if (error) {
                return NextResponse.json({ error }, { status: 500 })
            }

            return NextResponse.json({ data }, { status: 200 })
        } else {
            console.warn("Resend API key not configured, skipping email send")
            return NextResponse.json({ message: "Email service not configured" }, { status: 200 })
        }
    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }
}
