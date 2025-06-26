"use client"

import { usePathname } from "next/navigation"
import Footer from "./footer"
import { useSidebar } from "./ui/sidebar"
import AppSidebar from "@/components/sidebar"

const Main = ({ children }: { children: React.ReactNode }) => {
    const { open, isMobile } = useSidebar()
    const pathname = usePathname()
    const hide = pathname.startsWith("/auth")
    return (
        <>
            <AppSidebar />

            <main
                className={`overflow-hidden-x ${
                    isMobile || hide
                        ? "w-full"
                        : open
                        ? "w-[calc(100%-13rem)]"
                        : "w-[calc(100%-47px)]"
                } ${hide ? "h-screen" : "h-full"}`}
            >
                {children}
                <Footer />
            </main>
        </>
    )
}

export default Main
