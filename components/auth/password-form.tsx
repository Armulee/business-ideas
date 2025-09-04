"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { formSchema, FormValues } from "./signup/types"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import Email from "./signup/email"
import Consent from "./signup/consent"
import Name from "./signup/name"
import SentVerification from "./sent-verification"
import FormSignIn from "./signin/form"
import { ArrowLeft } from "lucide-react"
import axios, { AxiosError } from "axios"

interface PasswordFormProps {
    onBack: () => void
    activeTab: "signin" | "signup"
    onTabChange: (tab: "signin" | "signup") => void
    callbackUrl: string
}

const PasswordForm = ({ onBack, activeTab, onTabChange, callbackUrl }: PasswordFormProps) => {
    const [step, setStep] = useState<"form" | "sent">("form")
    const [submittedEmail, setSubmittedEmail] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

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
                callbackUrl,
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

    const renderSignInContent = () => {
        return (
            <>
                <FormSignIn />
                <div className='mt-4 text-center'>
                    <p className='text-sm text-gray-200'>
                        Don&apos;t have an account?{" "}
                        <button
                            type='button'
                            onClick={() => onTabChange("signup")}
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
                                onClick={() => onTabChange("signin")}
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
        <>
            <Button
                type='button'
                onClick={onBack}
                variant="ghost"
                className='mb-4 text-gray-400 hover:text-white p-2'
            >
                <ArrowLeft className='h-4 w-4 mr-2' />
                Back to Auth Providers
            </Button>

            {/* Tab Navigation */}
            <div className='flex mb-6 border-b border-gray-600'>
                <button
                    type='button'
                    onClick={() => onTabChange("signin")}
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
                    onClick={() => onTabChange("signup")}
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
        </>
    )
}

export default PasswordForm