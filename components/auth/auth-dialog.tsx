"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Logo } from "@/components/logo"
import { MagicLinkProvider } from "./signin/magic-link/context"
import AuthProviders from "./auth-providers"
import PasswordForm from "./password-form"

interface AuthDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title?: string
    description?: string
    defaultTab?: "signin" | "signup"
    callbackUrl?: string
}

const AuthDialog = ({
    open,
    onOpenChange,
    title = "Welcome Back",
    description = "Sign in quickly and securely with your favorite provider",
    defaultTab = "signin",
    callbackUrl = "/",
}: AuthDialogProps) => {
    const searchParams = useSearchParams()
    const finalCallbackUrl = callbackUrl || searchParams.get("callbackUrl") || "/"
    const [showPasswordForm, setShowPasswordForm] = useState(false)
    const [activeTab, setActiveTab] = useState<"signin" | "signup">(defaultTab)

    const handleClose = () => {
        onOpenChange(false)
        setShowPasswordForm(false)
        setActiveTab(defaultTab)
    }

    const handleContinueWithPassword = () => {
        setShowPasswordForm(true)
    }

    const handleBackToProviders = () => {
        setShowPasswordForm(false)
    }

    const handleTabChange = (tab: "signin" | "signup") => {
        setActiveTab(tab)
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className='max-w-md mx-auto bg-gray-800 border-gray-700 text-white'>
                <DialogHeader>
                    <Logo className='w-fit mx-auto text-center' />
                    <DialogTitle className='text-center text-3xl font-extrabold text-white'>
                        {title}
                    </DialogTitle>
                    <DialogDescription className='text-center text-sm text-gray-200'>
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <MagicLinkProvider>
                    <div className='mt-6'>
                        {showPasswordForm ? (
                            <PasswordForm
                                onBack={handleBackToProviders}
                                activeTab={activeTab}
                                onTabChange={handleTabChange}
                                callbackUrl={finalCallbackUrl}
                            />
                        ) : (
                            <AuthProviders onContinueWithPassword={handleContinueWithPassword} />
                        )}
                    </div>
                </MagicLinkProvider>
            </DialogContent>
        </Dialog>
    )
}

export default AuthDialog