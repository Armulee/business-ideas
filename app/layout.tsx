import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import "./styles.css"

// Import Swiper styles
import "swiper/css"
import "swiper/css/autoplay"
import "swiper/css/free-mode"
import "swiper/css/scrollbar"
import "swiper/css/pagination"
import "swiper/css/navigation"

// import Quill styles
import "quill/dist/quill.snow.css"

import Provider from "@/components/provider"
import { Session } from "next-auth"
import Navbar from "@/components/navbar"
import Main from "@/components/main"
import { LoadingProvider } from "@/components/loading-provider"

import { Toaster } from "@/components/ui/sonner"
import { Suspense } from "react"
// import GoogleOneTap from "@/auth/google-one-tap"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "BlueBizHub – Business Idea Refinement Platform",
    description:
        "BlueBizHub connects visionary entrepreneurs with a vibrant community to share, discuss, and refine innovative business ideas into successful ventures.",
    keywords: [
        "business ideas",
        "startup feedback",
        "entrepreneur community",
        "idea validation",
        "crowdsourcing innovation",
        "startup development",
    ],
    authors: [{ name: "BlueBizHub", url: "https://bluebizhub.com" }],
    openGraph: {
        type: "website",
        url: "https://bluebizhub.com/",
        title: "BlueBizHub – Community-Powered Business Idea Refinement Platform",
        description:
            "Share your startup vision on BlueBizHub, where entrepreneurs and experts collaborate to transform your ideas into thriving businesses.",
        images: [
            {
                url: "https://bluebizhub.com/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "BlueBizHub – Innovate, Share, Succeed",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        site: "@BlueBizHub",
        title: "BlueBizHub – Community-Powered Business Idea Refinement Platform",
        description:
            "Unlock your startup’s potential with BlueBizHub—get valuable insights and community feedback to accelerate your business journey.",
        images: "https://bluebizhub.com/twitter-card.jpg",
    },
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
                        <LoadingProvider>
                            {/* <GoogleOneTap /> */}
                            <Suspense>
                                <Navbar />
                                <Main>{children}</Main>
                            </Suspense>
                            <Toaster className='bg-black' />
                        </LoadingProvider>
                    </Provider>
                </div>
            </body>
        </html>
    )
}
