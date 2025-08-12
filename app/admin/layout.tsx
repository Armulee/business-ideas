"use client"
import { useSession } from "next-auth/react"
import NotFound from "../not-found"

export default function AdminRootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { data: session, status } = useSession()

    if (
        status === "loading" ||
        !session?.user ||
        session.user.role !== "admin"
    ) {
        return <NotFound />
    }

    return (
        <main className='p-4 pt-20 pb-10 bg-gray-900 min-h-screen'>
            {children}
        </main>
    )
}
