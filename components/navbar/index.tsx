"use client"

import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import AdminHeader from "./admin"
import UserNavbar from "./user"

export default function Navbar() {
    const pathname = usePathname()
    const { data: session } = useSession()
    return pathname.includes("/admin") &&
        (session?.user.role === "admin" ||
            session?.user.role === "moderator") ? (
        <AdminHeader />
    ) : (
        <UserNavbar />
    )
}
