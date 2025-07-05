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
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { passkeySignIn } from "@/lib/passkey-signin"
import MagicLinkButton from "./magic-link-button"
import MagicLinkMessage from "./magic-link-message"
import clearParams from "@/lib/clear-params"

const SignIn = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/"
    const errorParms = searchParams.get("error")

    const [pageLoading, setPageLoading] = useState<boolean>(true)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [suggestion, setSuggestion] = useState("")
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
    const [checkedEmail, setCheckedEmail] = useState<string | null>(null)

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
            setCheckedEmail(email) // 👈 Save this as the verified email

            if (detectedMethod === "passkey") {
                const res = await passkeySignIn()
                // handling passkey error
                if (res?.error === "Abort") {
                    setSuggestion(
                        "Accidentally removed your passkey? No worries — you can sign in with a Magic Link instead."
                    )
                } else if (res?.error === "Error") {
                    setError(
                        "There was a problem signing in with your passkey. Please try again."
                    )
                }
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
        const email = data.email.trim().toLowerCase()
        setError("")

        try {
            // First check what auth method this email uses
            if (!authMethod) {
                await checkEmailAuthMethod(email)
                setIsLoading(false)
                return
            }

            if (authMethod === "passkey") {
                await passkeySignIn()
            }

            // Handle password authentication here (passkey is auto-handled)
            if (authMethod === "password") {
                if (!data.password) {
                    setError("Please enter your password")
                    setIsLoading(false)
                    return
                }

                const res = await signIn("credentials", {
                    email: email,
                    password: data.password,
                    redirect: false,
                })

                if (res.error) {
                    try {
                        setError(
                            `The password is invalid. You have ${res.code} attempt${parseInt(res.code!) > 1 ? "s" : ""} remaining.`
                        )
                    } catch {
                        // fallback if it's not JSON
                        if (res.error === "CredentialsSignin") {
                            setError("The password is invalid.")
                        } else {
                            setError(res.error)
                        }
                    }
                } else {
                    router.replace(callbackUrl)
                }
            }
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : "Something went wrong"
            setError(`${message} Please try again.`)
            setIsLoading(false)
        }
    }
    // If user edit the email address after checked the auth method, then remove the auth method to remove the password field
    useEffect(() => {
        const subscription = form.watch((values) => {
            setError("")
            setSuggestion("")
            const currentEmail = values.email?.trim().toLowerCase()

            if (
                checkedEmail &&
                currentEmail !== checkedEmail.toLowerCase() &&
                authMethod !== null
            ) {
                // email changed after check — reset auth method
                setAuthMethod(null)
                setShowPasswordField(false)
            }

            if (
                !authMethod &&
                checkedEmail &&
                currentEmail === checkedEmail.toLowerCase()
            ) {
                // same email restored — restore auth method
                checkEmailAuthMethod(currentEmail)
            }
        })

        return () => subscription.unsubscribe()
    }, [checkedEmail, authMethod, form])

    // sent magic link
    const [sendingMagicLink, setSendingMagicLink] = useState<boolean>(false)
    const [sentMagicLink, setSentMagicLink] = useState<boolean>(false)
    const [resendCooldown, setResendCooldown] = useState<number>(0)
    const handleMagicLinkClick = async () => {
        const email = form.getValues("email").toLowerCase()
        if (!email) {
            setError("Please enter your email first")
            return
        }

        if (!form.getValues("consent")) {
            setError("Please accept the terms and conditions")
            return
        }

        setSendingMagicLink(true)
        await signIn("resend", { callbackUrl, email, redirect: false })
        setSendingMagicLink(false)

        // Set cooldown to 60 seconds
        setResendCooldown(60)
        // Show sent magic link page
        setSentMagicLink(true)
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

    // handle error from params of OAuth
    useEffect(() => {
        if (errorParms) {
            setError(
                "This email is already associated with another sign-in method. Please use your original method to sign in."
            )
            clearParams("error")
        }
    }, [errorParms])

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
                                <MagicLinkButton
                                    handleMagicLinkClick={handleMagicLinkClick}
                                    sendingMagicLink={sendingMagicLink}
                                />
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

                            {suggestion && (
                                <div className='mt-4 text-center text-sm text-white bg-yellow-700 px-4 py-2 glassmorphism'>
                                    {suggestion}
                                </div>
                            )}
                        </>
                    ) : (
                        <MagicLinkMessage
                            setSentMagicLink={setSentMagicLink}
                            resendCooldown={resendCooldown}
                            sendingMagicLink={sendingMagicLink}
                            handleMagicLinkClick={handleMagicLinkClick}
                        />
                    )}
                </div>
            ) : (
                <Loading />
            )}
        </>
    )
}

export default SignIn
