"use client"

import { SessionProvider } from "next-auth/react"
import { SidebarProvider } from "../ui/sidebar"
import { AlertProvider } from "./alert"
import { NewPostProvider } from "../new-post/context"

const Provider = ({
    children,
}: {
    children: React.ReactNode
}) => {
    return (
        <SessionProvider>
            <SidebarProvider>
                <NewPostProvider>
                    <AlertProvider>{children}</AlertProvider>
                </NewPostProvider>
            </SidebarProvider>
        </SessionProvider>
    )
}

export default Provider
