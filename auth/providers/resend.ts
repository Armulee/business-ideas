import { MagicLinkEmail } from "@/lib/email-template"
import { EmailProviderSendVerificationRequestParams } from "next-auth/providers/email"
import { Resend as ResendClient } from "resend"
import { default as ResendProvider } from "next-auth/providers/resend"

const resend = process.env.AUTH_RESEND_KEY ? new ResendClient(process.env.AUTH_RESEND_KEY) : null

async function sendVerificationRequest(
    params: EmailProviderSendVerificationRequestParams
) {
    const { identifier: to, url, provider } = params

    if (resend) {
        await resend.emails.send({
            from: provider.from as string,
            to,
            subject: `BlueBizHub Magic Link 🔮`,
            react: MagicLinkEmail({ url }),
        })
    } else {
        console.warn("Resend API key not configured, skipping magic link email")
    }
}

export default function Resend() {
    return ResendProvider({
        from: "BlueBizHub Magician <no-reply@bluebizhub.com>",
        sendVerificationRequest,
    })
}
