import { MagicLinkEmail } from "@/lib/email-template"
import { EmailProviderSendVerificationRequestParams } from "next-auth/providers/email"
import { Resend as ResendClient } from "resend"
import { default as ResendProvider } from "next-auth/providers/resend"

const resend = new ResendClient(process.env.AUTH_RESEND_KEY!)

async function sendVerificationRequest(
    params: EmailProviderSendVerificationRequestParams
) {
    const { identifier: to, url, provider } = params

    await resend.emails.send({
        from: `Bluebizhub Magician <${provider.from as string}>`,
        to,
        subject: `BlueBizHub Magic Link 🔮`,
        react: MagicLinkEmail({ url }),
    })
}

export default function Resend() {
    return ResendProvider({
        from: "BlueBizHub Magician <no-reply@bluebizhub.com>",
        sendVerificationRequest,
    })
}
