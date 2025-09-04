"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import axios, { AxiosError } from "axios"
import { formSchema, FormValues } from "./signup/types"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import Email from "./signup/email"
import Consent from "./signup/consent"
import { Logo } from "@/components/logo"
import Name from "./signup/name"
import SentVerification from "./sent-verification"
import { useSearchParams } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import FormSignIn from "./signin/form"
import ThirdParties from "./signin/third-parties"
import { useMagicLink } from "./signin/magic-link/context"
import MagicLinkMessage from "./signin/magic-link/message"

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
    const [activeTab, setActiveTab] = useState<"signin" | "signup">(defaultTab)
    const [step, setStep] = useState<"form" | "sent">("form")
    const [submittedEmail, setSubmittedEmail] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const {
        sentMagicLink,
        setSentMagicLink,
        resendCooldown,
        sendingMagicLink,
        setSendingMagicLink,
        setResendCooldown,
        magicLinkEmail,
    } = useMagicLink()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            consent: false,
        },
    })

    const onSubmit = async (data: FormValues) => {
        const email = data.email.trim().toLowerCase()
        try {
            setIsLoading(true)

            await axios.post("/api/auth/verify-email", {
                username: data.username,
                email,
                callbackUrl: finalCallbackUrl,
            })

            setSubmittedEmail(data.email)
            setStep("sent")
        } catch (error) {
            const message =
                error instanceof AxiosError
                    ? error.response?.data.message
                    : "Something went wrong"

            setError(message)
            setIsLoading(false)
        } finally {
            setIsLoading(false)
        }
    }

    // Handle magic link click for resend
    const handleMagicLinkClick = async () => {
        setSendingMagicLink(true)
        // Add your magic link sending logic here
        // For now, just simulate the process
        setTimeout(() => {
            setSendingMagicLink(false)
            setResendCooldown(60)
        }, 2000)
    }

    const handleClose = () => {
        onOpenChange(false)
        // Reset form state when closing
        setStep("form")
        setSubmittedEmail("")
        setError("")
        form.reset()
    }

    const renderSignInContent = () => {
        if (sentMagicLink) {
            return (
                <MagicLinkMessage
                    email={magicLinkEmail}
                    setSentMagicLink={setSentMagicLink}
                    resendCooldown={resendCooldown}
                    sendingMagicLink={sendingMagicLink}
                    handleMagicLinkClick={handleMagicLinkClick}
                />
            )
        }

        return (
            <>
                <ThirdParties />

                {/* Third Party Authentication */}
                <div className='mt-6 w-full flex justify-between items-center relative'>
                    <div className='w-20 border-t border-gray-300' />
                    <div className='relative text-sm'>
                        <span className='px-2 text-gray-200'>Or continue with</span>
                    </div>
                    <div className='w-20 border-t border-gray-300' />
                </div>

                <FormSignIn />
                <div className='mt-4 text-center'>
                                            <p className='text-sm text-gray-200'>
                            Don&apos;t have an account?{" "}
                            <button
                                type='button'
                                onClick={() => setActiveTab("signup")}
                                className='font-medium text-white hover:text-blue-200 underline underline-offset-4'
                            >
                                Sign up
                            </button>
                        </p>
                </div>
            </>
        )
    }

    const renderSignUpContent = () => {
        if (step === "sent") {
            return <SentVerification email={submittedEmail} />
        }

        return (
            <>
                <Form {...form}>
                    <form
                        className='mt-8 space-y-4'
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <Name control={form.control} />
                        <Email control={form.control} />
                        <Consent control={form.control} />
                        <Button
                            type='submit'
                            className='group relative w-full button !bg-blue-700'
                            disabled={isLoading}
                        >
                            {isLoading ? "Loading..." : "Create Account"}
                        </Button>
                    </form>
                </Form>

                {!isLoading && (
                    <div className='mt-8 text-center'>
                        <p className='text-sm text-gray-200'>
                            Already have an account?{" "}
                            <button
                                type='button'
                                onClick={() => setActiveTab("signin")}
                                className='font-medium text-white hover:text-blue-200 underline underline-offset-4'
                            >
                                Sign in
                            </button>
                        </p>
                    </div>
                )}

                {error && (
                    <div className='mt-3 text-center text-sm text-red-600'>
                        {error}
                    </div>
                )}
            </>
        )
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className='max-w-md mx-auto bg-gray-800 border-gray-700 text-white'>
                <DialogHeader>
                    <Logo className='w-fit mx-auto text-center' />
                    <DialogTitle className='text-center text-3xl font-extrabold text-white'>
                        {activeTab === "signin" ? title : "Welcome to Future of Innovation"}
                    </DialogTitle>
                    <DialogDescription className='text-center text-sm text-gray-200'>
                        {activeTab === "signin" 
                            ? description 
                            : "Create an account and start sharing or exploring the fascinating ideas today!"
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className='mt-6'>
                    {/* Tab Navigation */}
                    <div className='flex mb-6 border-b border-gray-600'>
                        <button
                            type='button'
                            onClick={() => setActiveTab("signin")}
                            className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === "signin"
                                    ? "border-blue-500 text-blue-400"
                                    : "border-transparent text-gray-400 hover:text-gray-300"
                            }`}
                        >
                            Sign In
                        </button>
                        <button
                            type='button'
                            onClick={() => setActiveTab("signup")}
                            className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === "signup"
                                    ? "border-blue-500 text-blue-400"
                                    : "border-transparent text-gray-400 hover:text-gray-300"
                            }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Content */}
                    {activeTab === "signin" ? renderSignInContent() : renderSignUpContent()}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AuthDialog