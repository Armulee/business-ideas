"use client"

import { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import { SidebarProvider } from "../ui/sidebar"
import { AlertProvider } from "./alert"
import { NewPostProvider } from "../new-post/context"

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
                <NewPostProvider>
                    <AlertProvider>{children}</AlertProvider>
                </NewPostProvider>
            </SidebarProvider>
        </SessionProvider>
    )
}

export default Provider
