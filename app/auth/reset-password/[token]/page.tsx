import ResetPassword from "@/components/auth/reset-password"

export default async function ResetPasswordPage({
    params,
}: {
    params: Promise<{ token: string }>
}) {
    const { token } = await params
    return <ResetPassword token={token} />
}
