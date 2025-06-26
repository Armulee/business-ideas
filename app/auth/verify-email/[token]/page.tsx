import VerifyEmail from "@/components/auth/verify-email"

export default async function VerifyEmailPage({
    params,
}: {
    params: Promise<{
        token: string
    }>
}) {
    const { token } = await params

    return (
        <div className='min-h-screen flex items-center justify-center p-4'>
            <VerifyEmail token={token} />
        </div>
    )
}
