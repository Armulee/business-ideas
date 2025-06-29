"use client"

import { useEffect, useState } from "react"
import { signIn } from "@/lib/auth-actions"
import { Button } from "@/components/ui/button"

import Link from "next/link"
import { Form } from "../../ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { FormValues, formSchema } from "../signin/types"
import Email from "../signin/email"
import Password from "../signin/password"
import Consent from "../signin/consent"
import ConsentDialog from "../signin/consent-dialog"
import SSO from "../signin/sso"
import RateLimitNotice from "./rate-limit"
import Loading from "@/components/loading"
import ProviderDialog from "./provider-dialog"
import { Logo } from "@/components/logo"
import { useSearchParams } from "next/navigation"
import MagicLink from "./magic-link"

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

    // rate limit
    const [isRateLimited, setIsRateLimited] = useState<boolean>(false)
    const [retrySeconds, setRetrySeconds] = useState<number>(0)
    const [remainingAttempts, setRemainingAttempts] = useState<number | null>(
        null
    )

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            consent: false,
        },
    })

    const onSubmit = async (data: FormValues) => {
        setIsLoading(true)
        setError("")
        setRemainingAttempts(null)

        try {
            await signIn("credentials", {
                email: data.email,
                password: data.password,
                callbackUrl,
            })
        } catch (error: unknown) {
            try {
                const errorMessage =
                    error instanceof Error ? error.message : String(error)
                const payload = JSON.parse(errorMessage) as {
                    code: string
                    retry?: number
                    message?: string
                    remainingAttempts?: number
                    provider?: string
                }

                // handling rate limit errors
                if (payload?.code === "RATE_LIMIT_EXCEEDED") {
                    const unlockAt = Date.now() + payload.retry! * 1000
                    localStorage.setItem("loginLockUntil", unlockAt.toString())
                    setRetrySeconds(payload.retry!)
                    setIsRateLimited(true)
                    setIsLoading(false)
                    return
                }

                // handling normal credentials errors
                if (payload?.code === "CREDENTIALS_INVALID") {
                    setError(payload.message!)
                    setRemainingAttempts(payload.remainingAttempts!)
                    setIsLoading(false)
                    return
                }

                if (payload?.code === "PROVIDER_ALREADY_ASSOCIATED") {
                    setError(payload.message!)
                    setIsLoading(false)
                    setAuthentication({ provider: payload.provider! })
                    setProviderDialog(true)
                    return
                }

                throw new Error()
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Something went wrong"
                setError(`${message} Please try again.`)
            }
            setIsLoading(false)
        }
    }

    useEffect(() => {
        setPageLoading(true)
        const locked = localStorage.getItem("loginLockUntil")
        if (!locked) {
            setPageLoading(false)
            return
        }

        const unlockAt = parseInt(locked, 10)
        const secsLeft = Math.ceil((unlockAt - Date.now()) / 1000)

        if (secsLeft > 0) {
            setRetrySeconds(secsLeft)
            setIsRateLimited(true)
        } else {
            localStorage.removeItem("loginLockUntil")
        }
        setPageLoading(false)
    }, [])

    // open magic link when user select the Magic Link authentication method
    const [magicLink, setMagicLink] = useState(false)

    if (isRateLimited) {
        return <RateLimitNotice initialSeconds={retrySeconds} />
    }

    return (
        <>
            {!pageLoading && !magicLink ? (
                <div className='max-w-sm mx-auto'>
                    <Logo className='text-center' />
                    <h2 className='mt-2 text-center text-3xl font-extrabold text-white'>
                        Welcome Back
                    </h2>
                    <p className='mt-2 mb-4 text-center text-sm text-gray-200'>
                        Sign in quickly and securely with your favorite provider
                    </p>
                    <SSO
                        form={form}
                        setAuthentication={setAuthentication}
                        setShowDialog={setConsentDialog}
                        setMagicLink={setMagicLink}
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
                            <Password control={form.control} />
                            <Consent control={form.control} />
                            <Button
                                type='submit'
                                className='group relative w-full flex justify-center py-2 px-4 text-sm font-medium glassmorphism text-white bg-blue-500/50 hover:bg-white hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                disabled={isLoading}
                            >
                                {isLoading ? "Loading..." : "Sign in"}
                            </Button>
                        </form>
                    </Form>

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
                        <div className='mt-4 text-center text-sm text-white bg-red-600 px-4 py-2 rounded'>
                            {error}
                            {remainingAttempts !== null && (
                                <p className='mt-1 text-xs text-red-200'>
                                    You have {remainingAttempts} attempt
                                    {remainingAttempts === 1 ? "" : "s"}{" "}
                                    remaining.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            ) : magicLink ? (
                <MagicLink setMagicLink={setMagicLink} />
            ) : (
                <Loading />
            )}
        </>
    )
}

export default SignIn
