import SetupAccount from "@/components/auth/setup-account"

export default async function SetupAccountPage({
    params,
}: {
    params: Promise<{ token: string }>
}) {
    const { token } = await params
    
    return <SetupAccount token={token} />
}
