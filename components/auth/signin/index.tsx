"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Form } from "../../ui/form"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { FormValues, formSchema } from "../signin/types"
import Email from "../signin/email"
import Password from "../signin/password"
import Consent from "../signin/consent"
import ConsentDialog from "../signin/consent-dialog"
import SSO from "../signin/sso"
import Loading from "@/components/loading"
import ProviderDialog from "./provider-dialog"
import { Logo } from "@/components/logo"
import { useSearchParams } from "next/navigation"
import { serverSignIn } from "@/lib/auth-server-actions"
import { signIn as passkeySignIn } from "next-auth/webauthn"
import { GiFairyWand } from "react-icons/gi"
import { CheckCircleIcon, ChevronLeft } from "lucide-react"

const SignIn = () => {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/"

    const [pageLoading, setPageLoading] = useState<boolean>(true)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [consentDialog, setConsentDialog] = useState(false)
    const [authentication, setAuthentication] = useState<{
        provider: string
        email?: string
    }>({ provider: "" })
    const [providerDialog, setProviderDialog] = useState(false)

    // Authentication method detection
    const [authMethod, setAuthMethod] = useState<string | null>(null)
    const [showPasswordField, setShowPasswordField] = useState(false)
    const [checkingEmail, setCheckingEmail] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            consent: false,
        },
    })

    // checking the email auth method, whether passkey or password
    const checkEmailAuthMethod = async (email: string) => {
        setCheckingEmail(true)
        try {
            const response = await axios.get(
                `/api/auth/check-auth-method?email=${encodeURIComponent(email)}`
            )
            const { exists, authMethod: detectedMethod } = response.data

            if (!exists) {
                setAuthMethod(null)
                setShowPasswordField(false)
                setError(
                    "No account found with this email. Please sign up first."
                )
                return
            }

            setAuthMethod(detectedMethod)

            if (detectedMethod === "passkey") {
                // Auto sign in with passkey
                await passkeySignIn("passkey")
            } else if (detectedMethod === "password") {
                setShowPasswordField(true)
            } else {
                setShowPasswordField(false)
            }
        } catch (error) {
            console.error("Error checking auth method:", error)
            setAuthMethod(null)
            setShowPasswordField(false)
            setError("Error checking authentication method. Please try again.")
        } finally {
            setCheckingEmail(false)
        }
    }

    // press sign in will check the email use passkey or password
    const onSubmit = async (data: FormValues) => {
        setIsLoading(true)
        setError("")

        try {
            // First check what auth method this email uses
            if (!authMethod) {
                await checkEmailAuthMethod(data.email)
                setIsLoading(false)
                return
            }

            // Only handle password authentication here (passkey is auto-handled)
            if (authMethod === "password") {
                if (!data.password) {
                    setError("Please enter your password")
                    setIsLoading(false)
                    return
                }

                await serverSignIn("credentials", {
                    email: data.email,
                    password: data.password,
                    callbackUrl,
                })
            }
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : "Something went wrong"
            setError(`${message} Please try again.`)
            setIsLoading(false)
        }
    }

    // sent magic link
    const [sendingMagicLink, setSendingMagicLink] = useState<boolean>(false)
    const [sentMagicLink, setSentMagicLink] = useState<boolean>(false)
    const [resendCooldown, setResendCooldown] = useState<number>(0)
    const handleMagicLinkClick = async () => {
        const email = form.getValues("email")
        if (!email) {
            setError("Please enter your email first")
            return
        }

        if (!form.getValues("consent")) {
            setError("Please accept the terms and conditions")
            return
        }

        setSendingMagicLink(true)
        await serverSignIn("resend", { callbackUrl, email, redirect: false })
        setSendingMagicLink(false)
        setSentMagicLink(true)

        // Set cooldown to 60 seconds
        setResendCooldown(60)
    }
    // resend button cooldown timer
    useEffect(() => {
        if (resendCooldown <= 0) return

        const interval = setInterval(() => {
            setResendCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [resendCooldown])

    // when finish loading, set page loading to false
    useEffect(() => {
        setPageLoading(false)
    }, [])

    return (
        <>
            {!pageLoading ? (
                <div className='max-w-sm mx-auto'>
                    <Logo className='text-center' />
                    {!sentMagicLink ? (
                        <>
                            <h2 className='mt-2 text-center text-3xl font-extrabold text-white'>
                                Welcome Back
                            </h2>
                            <p className='mt-2 mb-4 text-center text-sm text-gray-200'>
                                Sign in quickly and securely with your favorite
                                provider
                            </p>
                            <SSO
                                form={form}
                                setAuthentication={setAuthentication}
                                setShowDialog={setConsentDialog}
                            />

                            <div className='mt-6 w-full flex justify-between items-center relative'>
                                <div className='w-28 border-t border-gray-300' />
                                <div className='relative text-sm'>
                                    <span className='px-2 text-gray-200'>
                                        Or continue with
                                    </span>
                                </div>
                                <div className='w-28 border-t border-gray-300' />
                            </div>

                            <Form {...form}>
                                <form
                                    className='mt-6 space-y-4'
                                    onSubmit={form.handleSubmit(onSubmit)}
                                >
                                    <Email control={form.control} />
                                    {showPasswordField && (
                                        <Password control={form.control} />
                                    )}
                                    <Consent control={form.control} />

                                    <Button
                                        type='submit'
                                        className='group relative w-full flex justify-center py-2 px-4 text-sm font-medium glassmorphism text-white bg-blue-500/50 hover:bg-blue-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                        disabled={
                                            isLoading ||
                                            checkingEmail ||
                                            sendingMagicLink
                                        }
                                    >
                                        {checkingEmail
                                            ? "Checking..."
                                            : isLoading
                                              ? "Loading..."
                                              : sendingMagicLink
                                                ? "Magic Linking..."
                                                : "Sign in"}
                                    </Button>
                                </form>
                            </Form>

                            {/* Magic Link Button */}
                            {(!sendingMagicLink ||
                                checkingEmail ||
                                isLoading) && (
                                <div className='w-full flex justify-center mx-auto'>
                                    <Button
                                        type='button'
                                        onClick={handleMagicLinkClick}
                                        disabled={sendingMagicLink}
                                        className='mt-3 w-fit inline-flex justify-center py-2 px-6 glassmorphism bg-transparent text-sm font-medium text-white hover:bg-indigo-700 hover:text-white border border-white/30 duration-300'
                                    >
                                        <GiFairyWand className='w-5 h-5 mr-2' />
                                        Send Magic Link
                                    </Button>
                                </div>
                            )}

                            <div className='text-center mt-4'>
                                <p className='text-sm text-gray-200'>
                                    Don&apos;t have an account?{" "}
                                    <Link
                                        href='signup'
                                        className='font-medium text-white hover:text-blue-200 underline underline-offset-4'
                                    >
                                        Create your account
                                    </Link>
                                </p>
                            </div>

                            {/* Consent Dialog for making a user accept the consent before continue with sso provider login */}
                            <ConsentDialog
                                form={form}
                                authentication={authentication}
                                showDialog={consentDialog}
                                setShowDialog={setConsentDialog}
                            />

                            {/* Provider Dialog for making a user notice that the email has been used to login via sso provider */}
                            <ProviderDialog
                                form={form}
                                authentication={authentication}
                                showDialog={providerDialog}
                                setShowDialog={setProviderDialog}
                            />

                            {error && (
                                <div className='mt-4 text-center text-sm text-white bg-red-600 px-4 py-2 glassmorphism'>
                                    {error}
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className='flex items-center gap-1 hover:-translate-x-1 duration-300 mb-5'>
                                <ChevronLeft />
                                <span
                                    onClick={() => setSentMagicLink(false)}
                                    className='text-white cursor-pointer'
                                >
                                    Go back
                                </span>
                            </div>
                            <div className='flex items-center bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md mb-6'>
                                <CheckCircleIcon className='w-5 h-5 mr-2 animate-pulse' />
                                <p className='font-medium'>
                                    Magic link sent! Check your email.
                                </p>
                            </div>
                            <p className='text-left text-sm'>
                                Not receive any email?{" "}
                                <span
                                    className={
                                        resendCooldown > 0 || sendingMagicLink
                                            ? "pointer-events-none text-gray-400 cursor-not-allowed"
                                            : "text-blue-400 hover:underline hover:underline-offset-2 cursor-pointer "
                                    }
                                    onClick={() => {
                                        if (
                                            resendCooldown === 0 &&
                                            !sendingMagicLink
                                        ) {
                                            handleMagicLinkClick()
                                        }
                                    }}
                                >
                                    {resendCooldown > 0
                                        ? `Resend in ${resendCooldown}s`
                                        : sendingMagicLink
                                          ? "Resending..."
                                          : "Resend"}
                                </span>
                            </p>
                        </>
                    )}
                </div>
            ) : (
                <Loading />
            )}
        </>
    )
}

export default SignIn
