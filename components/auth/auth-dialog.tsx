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
            <DialogContent className='max-w-md mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-600/50 text-white shadow-2xl'>
                <DialogHeader className='space-y-4'>
                    <div className='flex justify-center'>
                        <div className='p-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30'>
                            <Logo className='w-8 h-8 text-white' />
                        </div>
                    </div>
                    <DialogTitle className='text-center text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
                        {title}
                    </DialogTitle>
                    <DialogDescription className='text-center text-sm text-gray-300 leading-relaxed'>
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <MagicLinkProvider>
                    <div className='mt-8'>
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