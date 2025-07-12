"use client"

import { usePathname } from "next/navigation"
import UserSidebar from "./user"
import { useSession } from "next-auth/react"
import AdminSidebar from "./admin"

export default function AppSidebar() {
    const pathname = usePathname()
    const { data: session } = useSession()
    return pathname.includes("/admin") &&
        (session?.user.role === "admin" ||
            session?.user.role === "moderator") ? (
        <AdminSidebar />
    ) : (
        <UserSidebar />
    )
}
