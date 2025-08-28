"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { FormValues, formSchema } from "./types"
import { useMagicLink } from "./magic-link/context"
import { useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import clearParams from "@/lib/clear-params"
import { useAlert } from "@/components/provider/alert"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

const SignInForm = () => {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/"
    const errorParams = searchParams.get("error")
    const errorCode = searchParams.get("code")
    const alert = useAlert()

    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [suggestion, setSuggestion] = useState("")

    const {
        isMagicLinkMode,
        sendingMagicLink,
        setSendingMagicLink,
        setSentMagicLink,
        resendCooldown,
        setResendCooldown,
        setMagicLinkEmail,
    } = useMagicLink()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            consent: false,
        },
    })

    // Handle credential sign in
    const onSubmit = async (data: FormValues) => {
        if (isMagicLinkMode) {
            handleMagicLinkClick()
            return
        }

        const email = data.email.trim().toLowerCase()
        setError("")
        setIsLoading(true)

        try {
            await signIn("credentials", {
                email: email,
                password: data.password,
                callbackUrl,
            })
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : "Something went wrong"
            setError(`${message} Please try again.`)
        } finally {
            setIsLoading(false)
        }
    }

    // Handle magic link click
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
        setMagicLinkEmail(email)
        await signIn("resend", { callbackUrl, email, redirect: false })
        setSendingMagicLink(false)

        // Set cooldown to 60 seconds
        setResendCooldown(60)
        // Show sent magic link page
        setSentMagicLink(true)
    }

    // Clear errors when magic link mode changes
    useEffect(() => {
        setError("")
        setSuggestion("")
    }, [isMagicLinkMode])

    // Form field change handler
    useEffect(() => {
        const subscription = form.watch(() => {
            setError("")
            setSuggestion("")
        })

        return () => subscription.unsubscribe()
    }, [form])

    // Resend button cooldown timer
    useEffect(() => {
        if (resendCooldown <= 0) return
        const interval = setInterval(() => {
            setResendCooldown((prev) => Math.max(0, prev - 1))
        }, 1000)

        return () => clearInterval(interval)
    }, [resendCooldown, setResendCooldown])

    // Handle error from params of OAuth and credentials
    useEffect(() => {
        if (errorCode) {
            // Check if it's a numeric code (remaining attempts from RateLimiterError)
            if (!isNaN(Number(errorCode))) {
                const remaining = Number(errorCode)
                setError(
                    `Incorrect password. You have ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining before temporary suspension.`
                )
            } else {
                // Provider error (from ProviderExistingError)
                const provider =
                    errorCode.charAt(0).toUpperCase() + errorCode.slice(1)
                const email = searchParams.get("email") || ""

                alert.show({
                    title: `Your email already registered via ${provider}`,
                    description: (
                        <span>
                            Email <strong>{email}</strong> was originally
                            registered using <strong>{provider}</strong>.
                            <br />
                            <br />
                            Please continue with <strong>{provider}</strong> to
                            sign in.
                        </span>
                    ),
                    cancel: "Cancel",
                    action: `Continue with ${provider}`,
                    onAction: async () => {
                        await signIn(provider.toLowerCase(), { callbackUrl })
                    },
                })
            }
            clearParams("code")
        }
    }, [errorParams, errorCode, searchParams, callbackUrl, alert])

    return (
        <>
            <Form {...form}>
                <form
                    className='mt-6 space-y-4'
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    {/* Email */}
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='sr-only'>
                                    Email address
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type='email'
                                        autoComplete='email'
                                        required
                                        className='input'
                                        placeholder='Email address'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Password */}
                    {!isMagicLinkMode && (
                        <div>
                            <FormField
                                control={form.control}
                                name='password'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='sr-only'>
                                            Password
                                        </FormLabel>
                                        <FormControl>
                                            <div className='relative'>
                                                <Input
                                                    id='password'
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    autoComplete='password'
                                                    required
                                                    className='input'
                                                    placeholder='Password'
                                                    {...field}
                                                />
                                                <button
                                                    type='button'
                                                    onClick={() =>
                                                        setShowPassword(
                                                            (prev) => !prev
                                                        )
                                                    }
                                                    className='absolute inset-y-0 right-0 flex items-center pr-3 z-10'
                                                    tabIndex={-1}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className='h-5 w-5 text-gray-400' />
                                                    ) : (
                                                        <Eye className='h-5 w-5 text-gray-400' />
                                                    )}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='text-left pl-2'>
                                <Link
                                    className='text-[10px] text-gray-200 hover:text-white underline underline-offset-4'
                                    href={"/auth/forget-password"}
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                        </div>
                    )}
                    {isMagicLinkMode && (
                        <div className='text-sm text-gray-300 bg-blue-900/30 p-3 rounded-md border border-blue-500/30'>
                            Fill out your email to get a magic link sent to your
                            inbox. Click the link to sign in securely.
                        </div>
                    )}

                    {/* Consent */}
                    <FormField
                        control={form.control}
                        name='consent'
                        render={({ field }) => (
                            <FormItem>
                                <div className='flex items-center gap-2'>
                                    <FormControl>
                                        <Checkbox
                                            className='border border-white'
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className='text-sm text-gray-200 !mt-0'>
                                        I agree to the{" "}
                                        <Link
                                            href='/terms-conditions'
                                            className='text-white hover:text-blue-200 underline'
                                        >
                                            User agreement
                                        </Link>{" "}
                                        and{" "}
                                        <Link
                                            href='/privacy'
                                            className='text-white hover:text-blue-200 underline'
                                        >
                                            Privacy Policy
                                        </Link>
                                    </FormLabel>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type='submit'
                        className='group relative w-full flex justify-center py-2 px-4 text-sm font-medium glassmorphism text-white bg-blue-500/50 hover:bg-blue-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        disabled={isLoading || sendingMagicLink}
                    >
                        {isLoading
                            ? "Loading..."
                            : sendingMagicLink
                              ? "Magic Linking..."
                              : isMagicLinkMode
                                ? "Send Magic Link"
                                : "Sign in"}
                    </Button>
                </form>
            </Form>

            {error && (
                <div className='mt-4 text-center text-xs text-white bg-red-600 px-4 py-2 glassmorphism'>
                    {error}
                </div>
            )}

            {suggestion && (
                <div className='mt-4 text-center text-xs text-white bg-yellow-700 px-4 py-2 glassmorphism'>
                    {suggestion}
                </div>
            )}
        </>
    )
}

export default SignInForm
