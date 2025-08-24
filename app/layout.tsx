import type { Metadata, Viewport } from "next"
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
import {
    createOrganizationSchema,
    createWebSiteSchema,
} from "@/lib/seo/schemas"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#3b82f6" },
        { media: "(prefers-color-scheme: dark)", color: "#1e40af" },
    ],
}

export const metadata: Metadata = {
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_SITE_URL || "https://bluebizhub.com"
    ),
    title: {
        default: "BlueBizHub – Business Idea Refinement Platform",
        template: "%s | BlueBizHub",
    },
    description:
        "BlueBizHub connects visionary entrepreneurs with a vibrant community to share, discuss, and refine innovative business ideas into successful ventures.",
    keywords: [
        "business ideas",
        "startup feedback",
        "entrepreneur community",
        "idea validation",
        "crowdsourcing innovation",
        "startup development",
        "business networking",
        "startup incubator",
        "innovation platform",
    ],
    authors: [{ name: "BlueBizHub", url: "https://bluebizhub.com" }],
    creator: "BlueBizHub",
    publisher: "BlueBizHub",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://bluebizhub.com/",
        siteName: "BlueBizHub",
        title: "BlueBizHub – Community-Powered Business Idea Refinement Platform",
        description:
            "Share your startup vision on BlueBizHub, where entrepreneurs and experts collaborate to transform your ideas into thriving businesses.",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "BlueBizHub – Innovate, Share, Succeed",
                type: "image/jpeg",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        site: "@BlueBizHub",
        creator: "@BlueBizHub",
        title: "BlueBizHub – Community-Powered Business Idea Refinement Platform",
        description:
            "Unlock your startup's potential with BlueBizHub—get valuable insights and community feedback to accelerate your business journey.",
        images: ["/twitter-card.jpg"],
    },
    verification: {
        google: process.env.GOOGLE_SITE_VERIFICATION,
    },
    category: "business",
}

export default function RootLayout({
    children,
    session,
}: Readonly<{
    children: React.ReactNode
    session: Session
}>) {
    const organizationSchema = createOrganizationSchema()
    const websiteSchema = createWebSiteSchema()

    return (
        <html lang='en' dir='ltr'>
            <head>
                <link rel='icon' href='/favicon.ico' sizes='32x32' />
                <link rel='icon' href='/favicon.svg' type='image/svg+xml' />
                <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
                <link rel='manifest' href='/manifest.json' />

                <script
                    type='application/ld+json'
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(organizationSchema),
                    }}
                />
                <script
                    type='application/ld+json'
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(websiteSchema),
                    }}
                />

                <script
                    src='https://accounts.google.com/gsi/client'
                    async
                    defer
                />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden relative h-full`}
            >
                {/* <div className='moving-gradient'> */}
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
                {/* </div> */}
            </body>
        </html>
    )
}
