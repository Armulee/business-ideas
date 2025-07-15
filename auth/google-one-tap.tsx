"use client"

import { useEffect, useRef } from "react"
import { signIn, useSession } from "next-auth/react"

interface GoogleCredentialResponse {
    credential: string
}

interface GoogleNotification {
    isNotDisplayed: () => boolean
    isSkippedMoment: () => boolean
    isDismissedMoment: () => boolean
    getNotDisplayedReason: () => string
    getSkippedReason: () => string
    getDismissedReason: () => string
}

interface GoogleIdConfiguration {
    client_id: string
    callback: (response: GoogleCredentialResponse) => void
    auto_select?: boolean
    cancel_on_tap_outside?: boolean
    context?: string
    ux_mode?: string
    use_fedcm_for_prompt?: boolean
}

declare global {
    interface Window {
        google: {
            accounts: {
                id: {
                    initialize: (config: GoogleIdConfiguration) => void
                    prompt: (
                        callback?: (notification: GoogleNotification) => void
                    ) => void
                    renderButton: (
                        element: HTMLElement,
                        config: GoogleIdConfiguration
                    ) => void
                    disableAutoSelect: () => void
                    cancel: () => void
                }
            }
        }
    }
}

interface GoogleOneTapProps {
    disabled?: boolean
    autoPrompt?: boolean
    promptCooldownMs?: number
}

export default function GoogleOneTap({
    disabled = false,
    autoPrompt = true,
    promptCooldownMs = 24 * 60 * 60 * 1000, // 24 hours
}: GoogleOneTapProps) {
    const { status } = useSession()
    const hasInitialized = useRef(false)
    const isPrompting = useRef(false)

    useEffect(() => {
        // Don't show if user is already signed in
        if (status === "authenticated" || disabled) {
            return
        }

        // Check cooldown period
        const lastPrompt = localStorage.getItem("google-one-tap-last-prompt")
        if (
            lastPrompt &&
            Date.now() - parseInt(lastPrompt) < promptCooldownMs
        ) {
            return
        }

        // Check if user has dismissed One Tap recently
        const dismissed = localStorage.getItem("google-one-tap-dismissed")
        if (dismissed && Date.now() - parseInt(dismissed) < 30 * 60 * 1000) {
            // 30 minutes
            return
        }

        const initializeGoogleOneTap = () => {
            if (!window.google || hasInitialized.current) return

            try {
                const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
                if (!clientId) {
                    console.error(
                        "Google Client ID not found in environment variables"
                    )
                    return
                }

                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: handleCredentialResponse,
                    auto_select: false,
                    cancel_on_tap_outside: true,
                    context: "signin",
                    ux_mode: "popup",
                    use_fedcm_for_prompt: true,
                })

                hasInitialized.current = true

                if (autoPrompt && !isPrompting.current) {
                    isPrompting.current = true
                    localStorage.setItem(
                        "google-one-tap-last-prompt",
                        Date.now().toString()
                    )

                    window.google.accounts.id.prompt((notification) => {
                        isPrompting.current = false

                        if (notification.isNotDisplayed()) {
                            console.log(
                                "Google One Tap not displayed:",
                                notification.getNotDisplayedReason()
                            )
                        } else if (notification.isSkippedMoment()) {
                            console.log(
                                "Google One Tap skipped:",
                                notification.getSkippedReason()
                            )
                        } else if (notification.isDismissedMoment()) {
                            console.log(
                                "Google One Tap dismissed:",
                                notification.getDismissedReason()
                            )
                            localStorage.setItem(
                                "google-one-tap-dismissed",
                                Date.now().toString()
                            )
                        }
                    })
                }
            } catch (error) {
                console.error("Error initializing Google One Tap:", error)
                hasInitialized.current = false
                isPrompting.current = false
            }
        }

        const handleCredentialResponse = async (
            response: GoogleCredentialResponse
        ) => {
            try {
                if (response.credential) {
                    await signIn("google", {
                        credential: response.credential,
                        redirect: true,
                    })
                }
            } catch (error) {
                console.error("Error signing in with Google One Tap:", error)
            }
        }

        // Load Google Identity Services script
        if (!document.querySelector('script[src*="accounts.google.com"]')) {
            const script = document.createElement("script")
            script.src = "https://accounts.google.com/gsi/client"
            script.async = true
            script.defer = true
            script.onload = initializeGoogleOneTap
            script.onerror = () => {
                console.error("Failed to load Google Identity Services script")
            }
            document.head.appendChild(script)
        } else {
            initializeGoogleOneTap()
        }

        return () => {
            if (window.google?.accounts?.id) {
                try {
                    window.google.accounts.id.cancel()
                } catch (error) {
                    console.error("Error canceling Google One Tap:", error)
                }
            }
        }
    }, [status, disabled, autoPrompt, promptCooldownMs])

    // This component doesn't render anything visible
    return null
}
