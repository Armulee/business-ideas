import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import "./styles.css"

// Import Swiper styles
import "swiper/css"
import "swiper/css/autoplay"
import "swiper/css/free-mode"
import "swiper/css/scrollbar"

// import Quill styles
import "quill/dist/quill.snow.css"

import Provider from "@/components/provider"
import { Session } from "next-auth"
import Navbar from "@/components/navbar"
import Main from "@/components/main"

import { Toaster } from "@/components/ui/sonner"
import { Suspense } from "react"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export const metaData: Metadata = {
    title: "Blue Biz Hub",
    description: "Business Idea",
}

export default function RootLayout({
    children,
    session,
}: Readonly<{
    children: React.ReactNode
    session: Session
}>) {
    return (
        <html lang='en'>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden relative h-full`}
            >
                <div className='moving-gradient'>
                    <Provider session={session}>
                        <Suspense>
                            {/* <Loading /> */}
                            <Navbar />
                            <Main>{children}</Main>
                        </Suspense>
                        <Toaster className='bg-black' />
                    </Provider>
                </div>
            </body>
        </html>
    )
}
