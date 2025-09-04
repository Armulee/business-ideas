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
            <DialogContent className='max-w-md mx-auto bg-slate-900 border border-slate-700 text-white shadow-2xl'>
                <DialogHeader className='space-y-6 text-center'>
                    <Logo className='w-12 h-12 text-white mx-auto' />
                    <DialogTitle className='text-2xl font-bold text-white'>
                        {title}
                    </DialogTitle>
                    <DialogDescription className='text-sm text-slate-300 leading-relaxed'>
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