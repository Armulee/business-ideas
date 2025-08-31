"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Cookie } from "lucide-react"
import { cn } from "@/lib/utils"
import { CookieManager } from "@/lib/cookies"
import Link from "next/link"

interface CookiesConsentProps {
    className?: string
}

export default function CookiesConsent({ className }: CookiesConsentProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [isClosing, setIsClosing] = useState(false)
    const pathname = usePathname()

    // Pages where cookies consent should be hidden
    const hiddenOnPages = [
        '/privacy-policy',
        '/terms-conditions',
        '/auth/signin',
        '/auth/signup',
        '/auth/forget-password',
        '/auth/reset-password',
        '/auth/setup-account',
        '/auth/privacy'
    ]

    // Check if current page should hide cookies consent
    const shouldHide = hiddenOnPages.some(page => pathname === page) || 
        pathname.startsWith('/auth/reset-password/') ||
        pathname.startsWith('/auth/setup-account/') ||
        pathname.startsWith('/admin')

    useEffect(() => {
        if (shouldHide) {
            setIsVisible(false)
        } else {
            setIsVisible(CookieManager.shouldShowConsent())
        }
    }, [shouldHide])

    const handleAccept = () => {
        CookieManager.setConsent(true)
        handleClose()
    }

    const handleDecline = () => {
        CookieManager.setConsent(false)
        handleClose()
    }

    const handleClose = () => {
        setIsClosing(true)
        setTimeout(() => {
            setIsVisible(false)
            setIsClosing(false)
        }, 300)
    }

    if (!isVisible) return null

    return (
        <div
            id='cookie-consent'
            className={cn(
                "fixed bottom-4 left-4 right-4 sm:left-4 sm:right-4 sm:max-w-none z-[9999]",
                "transform transition-all duration-300 ease-out",
                isClosing
                    ? "translate-y-full opacity-0"
                    : "translate-y-0 opacity-100",
                className
            )}
        >
            {/* Glassmorphism card */}
            <div className='relative overflow-hidden rounded-2xl'>
                {/* Glass background with backdrop blur */}
                <div className='absolute inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl' />

                {/* Gradient overlay for extra depth */}
                <div className='absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent rounded-2xl' />

                {/* Content */}
                <div className='relative p-6'>
                    {/* Mobile layout: stacked */}
                    <div className='flex flex-col gap-4 sm:hidden'>
                        {/* Icon and text */}
                        <div className='flex items-start gap-3'>
                            <div className='flex-shrink-0 p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-900 backdrop-blur-sm'>
                                <Cookie className='w-5 h-5 text-white dark:text-blue-400' />
                            </div>
                            <p className='text-xs sm:text-sm text-white dark:text-gray-300 leading-relaxed'>
                                We use cookies to improve your experience. By
                                continuing, you agree to our{" "}
                                <Link
                                    href='/privacy-policy'
                                    className='text-xs text-white dark:text-gray-400 dark:hover:text-gray-200 underline underline-offset-2 transition-colors'
                                >
                                    Privacy Policy
                                </Link>
                            </p>
                        </div>
                        {/* Buttons */}
                        <div className='flex items-center gap-2'>
                            <Button
                                onClick={handleAccept}
                                className='flex-1 bg-blue-500 hover:bg-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 border-0'
                            >
                                Accept All
                            </Button>
                            <Button
                                onClick={handleDecline}
                                variant='ghost'
                                className='flex-1 bg-white/20 hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/20 text-white hover:text-white dark:text-gray-300 font-medium backdrop-blur-sm transition-all duration-200'
                            >
                                Decline
                            </Button>
                        </div>
                    </div>

                    {/* Desktop layout: single row */}
                    <div className='hidden sm:flex items-center gap-4'>
                        {/* Icon */}
                        <div className='flex-shrink-0 p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-900 backdrop-blur-sm'>
                            <Cookie className='w-5 h-5 text-white dark:text-blue-400' />
                        </div>

                        {/* Text - takes up available space */}
                        <p className='flex-1 text-sm text-white dark:text-gray-300 leading-relaxed'>
                            We use cookies to improve your experience. By
                            continuing, you agree to our{" "}
                            <Link
                                href='/privacy-policy'
                                className='text-sm text-white dark:text-gray-400 dark:hover:text-gray-200 underline underline-offset-2 transition-colors'
                            >
                                Privacy Policy
                            </Link>
                        </p>

                        {/* Buttons */}
                        <div className='flex items-center gap-2 flex-shrink-0'>
                            <Button
                                onClick={handleAccept}
                                className='whitespace-nowrap bg-blue-500 hover:bg-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 border-0 px-6'
                            >
                                Accept All
                            </Button>
                            <Button
                                onClick={handleDecline}
                                variant='ghost'
                                className='whitespace-nowrap bg-white/20 hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/20 text-white hover:text-white dark:text-gray-300 font-medium backdrop-blur-sm transition-all duration-200 px-6'
                            >
                                Decline
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
