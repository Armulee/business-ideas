"use client"

import { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import { SidebarProvider } from "../ui/sidebar"
import { AlertProvider } from "./alert"

const Provider = ({
    children,
    session,
}: {
    children: React.ReactNode
    session: Session
}) => {
    return (
        <SessionProvider session={session}>
            <SidebarProvider>
                <AlertProvider>{children}</AlertProvider>
            </SidebarProvider>
        </SessionProvider>
    )
}

export default Provider
