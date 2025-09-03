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
import CookiesConsent from "@/components/cookies-consent"
// import NewCookieConsent from "@/components/cookies"

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
    viewportFit: "cover",
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
        default: "BlueBizHub – Business Advertisement & Lead Generation Platform",
        template: "%s | BlueBizHub",
    },
    description:
        "BlueBizHub connects business owners with marketing partners who amplify businesses and earn commissions for generating leads. Join our community-driven advertising platform.",
    keywords: [
        "business advertising",
        "lead generation",
        "marketing partners",
        "commission marketing",
        "business promotion",
        "affiliate marketing",
        "business networking",
        "marketing platform",
        "lead tracking",
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
        title: "BlueBizHub – Community-Powered Business Advertising & Lead Generation",
        description:
            "Submit your business to BlueBizHub and let our community of marketing partners amplify your reach while earning commissions for generating leads.",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "BlueBizHub – Advertise, Amplify, Earn",
                type: "image/jpeg",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        site: "@BlueBizHub",
        creator: "@BlueBizHub",
        title: "BlueBizHub – Community-Powered Business Advertising & Lead Generation",
        description:
            "Connect your business with marketing partners who will amplify your reach and earn commissions for generating qualified leads.",
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
                        <CookiesConsent />
                        {/* <NewCookieConsent /> */}
                    </LoadingProvider>
                </Provider>
                {/* </div> */}
            </body>
        </html>
    )
}
