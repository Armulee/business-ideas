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
        <div className='space-y-6'>
            <Button
                type='button'
                onClick={onBack}
                variant="ghost"
                className='mb-2 text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700/50 transition-all duration-200'
            >
                <ArrowLeft className='h-4 w-4 mr-2' />
                Back
            </Button>

            {/* Tab Navigation */}
            <div className='flex bg-gray-700/30 rounded-xl p-1 border border-gray-600/50'>
                <button
                    type='button'
                    onClick={() => onTabChange("signin")}
                    className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                        activeTab === "signin"
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                            : "text-gray-400 hover:text-white hover:bg-gray-600/50"
                    }`}
                >
                    Sign In
                </button>
                <button
                    type='button'
                    onClick={() => onTabChange("signup")}
                    className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                        activeTab === "signup"
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                            : "text-gray-400 hover:text-white hover:bg-gray-600/50"
                    }`}
                >
                    Sign Up
                </button>
            </div>

            {/* Content */}
            {activeTab === "signin" ? renderSignInContent() : renderSignUpContent()}
        </div>
    )
}

export default PasswordForm