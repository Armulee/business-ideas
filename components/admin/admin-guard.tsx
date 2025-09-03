"use client"

import { useSession } from "next-auth/react"
import NotFound from "@/app/not-found"

interface AdminGuardProps {
    children: React.ReactNode
}

export default function AdminGuard({ children }: AdminGuardProps) {
    const { data: session } = useSession()

    // Show not found if user is not admin or not authenticated
    if (!session?.user || session.user.role !== "admin") {
        return <NotFound />
    }

    // User is admin, render children
    return <>{children}</>
}
