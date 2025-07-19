import AuthGuard from "@/components/auth/auth-guard"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AuthGuard>
            <div className='w-[90%] mx-auto mt-12 mb-10'>{children}</div>
        </AuthGuard>
    )
}
