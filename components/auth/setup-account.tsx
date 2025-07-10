"use client"

import { useState, useEffect } from "react"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { PasswordInput } from "@/components/ui/password-input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Lock, CheckCheckIcon } from "lucide-react"
import axios, { AxiosError } from "axios"
// import { signIn } from "@/lib/passkey-signin"
import Link from "next/link"
import Loading from "@/components/loading"
import * as z from "zod"
import { useRouter } from "next/navigation"
import PasswordRequirements from "./password-requirements"
import PasswordStrengthMeter from "./password-strength-meter"
// import { useSession } from "next-auth/react"

interface VerifyResponse {
    success: boolean
    user?: {
        id: string
        email: string
        name: string
        username: string
        callbackUrl?: string
    }
    code?: string
    message?: string
    email?: string
}

export default function SetupAccount({ token }: { token: string }) {
    const router = useRouter()
    // const pathname = usePathname()
    const [step, setStep] = useState<"credentials" | "success">("credentials")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [verifyState, setVerifyState] = useState<
        "loading" | "success" | "error" | "expired"
    >("loading")
    const [userData, setUserData] = useState<VerifyResponse["user"] | null>(
        null
    )

    const form = useForm<SetupFormValues>({
        resolver: zodResolver(setupFormSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    })

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await axios.get(
                    `/api/auth/verify-email/${token}`
                )
                const data: VerifyResponse = response.data

                if (data.code === "NO_TOKEN" || data.code === "TOKEN_INVALID") {
                    setVerifyState("error")
                } else if (data.code === "EXPIRED_TOKEN") {
                    setVerifyState("expired")
                } else if (data.code === "TOKEN_VALID" && data.user) {
                    setUserData(data.user)
                    setVerifyState("success")
                }
            } catch (error) {
                const data = (error as AxiosError).response
                    ?.data as VerifyResponse

                setError(data?.message || "Failed to verify token")
                setVerifyState("error")
            }
        }

        verifyToken()
    }, [token])

    // const handlePasskeySetup = async () => {
    //     try {
    //         setIsLoading(true)
    //         setError("")
    //         console.log("Passkey setup - userData:", userData)

    //         const result = await signIn("passkey", {
    //             action: "register",
    //             redirect: false,
    //         })

    //         if (result?.error) {
    //             if (result.error === "Abort") {
    //                 setError("Passkey setup was cancelled. Please try again.")
    //             } else {
    //                 setError("Failed to set up passkey. Please try again.")
    //             }
    //             return
    //         }

    //         await axios.post("/api/auth/complete-setup", {
    //             method: "passkey",
    //             email: userData?.email,
    //             username: userData?.name,
    //         })

    //         setCountdown(10)
    //         setStep("success")
    //     } catch (error) {
    //         console.error("Passkey setup error:", error)
    //         setError("Failed to set up passkey. Please try again.")
    //     } finally {
    //         setIsLoading(false)
    //     }
    // }

    const handleCredentialsSetup = async (data: SetupFormValues) => {
        try {
            setIsLoading(true)
            setError("")

            // Complete account setup with credentials
            await axios.post("/api/auth/complete-setup", {
                // method: "credentials",
                email: userData?.email,
                username: userData?.name,
                password: data.password,
            })

            setStep("success")
        } catch (error) {
            console.error(
                "Credentials setup error:",
                (error as AxiosError).message
            )
            setError("Failed to set up account. Please try again.")
            setIsLoading(false)
        } finally {
            setIsLoading(false)
        }
    }

    // prepare the countdown effect
    const [countdown, setCountdown] = useState<number>(10)
    useEffect(() => {
        if (countdown > 0 && step === "success") {
            const interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)

            return () => clearInterval(interval)
        }
    }, [countdown, step])
    // Redirect when countdown hits 0
    useEffect(() => {
        if (countdown === 0 && step === "success") {
            router.push(userData?.callbackUrl || "/")
        }
    }, [countdown, router, step, userData?.callbackUrl])

    // Show loading state while verifying token
    if (verifyState === "loading") {
        return <Loading />
    }

    // Show error state
    if (verifyState === "error") {
        return (
            <div className='max-w-md mx-auto'>
                <div className='text-center'>
                    <Logo />
                </div>
                <div className='mt-4 p-4 bg-red-600/20 border border-red-400 text-white rounded-md'>
                    <h2 className='text-lg font-semibold mb-2'>
                        Invalid Token
                    </h2>
                    <p className='text-sm mb-4'>
                        The verification link you clicked is invalid or has been
                        used already. This can happen if you&apos;ve already set
                        up your account, clicked an old link, or if there was an
                        error with the link format.
                    </p>
                    <p className='text-sm mb-3'>
                        If you haven&apos;t set up your account yet, please
                        request a new verification email or try signing in if
                        you already have an account.
                    </p>
                    <Link
                        href='/auth/signin'
                        className='text-blue-400 hover:text-blue-300 underline underline-offset-2'
                    >
                        Go to Sign In
                    </Link>
                </div>
            </div>
        )
    }

    // Show expired token state with resend option
    if (verifyState === "expired") {
        return (
            <div className='max-w-md mx-auto'>
                <div className='text-center'>
                    <Logo />
                </div>
                <div className='mt-4 p-4 bg-yellow-600/20 border border-yellow-400 text-white rounded-md'>
                    <h2 className='text-lg font-semibold mb-2'>
                        Token Expired
                    </h2>
                    <p className='text-sm mb-4'>
                        Your verification link has expired. Please request a new
                        verification email.
                    </p>
                    <Link
                        href='/auth/signin'
                        className='text-blue-400 hover:text-blue-300 underline underline-offset-2'
                    >
                        Go to Sign In
                    </Link>
                </div>
            </div>
        )
    }

    // if (step === "passkey") {
    //     return (
    //         <div className='max-w-md mx-auto'>
    //             <Logo className='mb-6' />
    //             <p className='flex items-center gap-2 px-4 py-2 w-fit bg-green-500/50 glassmorphism mb-6 text-sm'>
    //                 <CheckCheckIcon />
    //                 Email Verified
    //             </p>
    //             <h2 className='text-2xl font-semibold mb-3 text-white'>
    //                 Create a Passkey
    //             </h2>
    //             <p className='text-white/70 mb-6'>
    //                 Sign in to your account easily and securely with a passkey.
    //                 Your biometric data is only stored on your devices and will
    //                 never be shared with anyone.
    //             </p>

    //             <div className='space-y-4'>
    //                 <Button
    //                     onClick={handlePasskeySetup}
    //                     disabled={isLoading}
    //                     className='w-full button'
    //                 >
    //                     <Fingerprint className='w-5 h-5 mr-2' />
    //                     {isLoading ? "Setting up..." : "Create Passkey"}
    //                 </Button>

    //                 <div
    //                     onClick={() => setStep("credentials")}
    //                     className='text-blue-400 hover:underline underline-offset-2 text-right text-sm w-full cursor-pointer'
    //                 >
    //                     Skip
    //                 </div>
    //             </div>

    //             {error && (
    //                 <div className='mt-4 p-3 bg-red-600 text-white rounded-md text-sm'>
    //                     {error}
    //                 </div>
    //             )}
    //         </div>
    //     )
    // }

    if (step === "credentials") {
        return (
            <div className='max-w-md mx-auto'>
                <Logo className='text-center mb-6' />
                <p className='w-fit flex items-center gap-2 px-4 py-2 bg-green-500/50 glassmorphism mb-6 text-sm'>
                    <CheckCheckIcon />
                    Email Verified
                </p>

                <h2 className='text-2xl font-semibold mb-1 text-white'>
                    Setup your password
                </h2>
                <p className='text-white/70 mb-4'>
                    Set up your password to complete your account.
                </p>

                <Form {...form}>
                    <form
                        className='space-y-4'
                        onSubmit={form.handleSubmit(handleCredentialsSetup)}
                    >
                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-white'>
                                        Password
                                    </FormLabel>
                                    <FormControl>
                                        <PasswordInput
                                            {...field}
                                            placeholder='Enter your password'
                                            className='input glassmorphism bg-white/10 border-white/30 text-white placeholder:text-white/50'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    <PasswordStrengthMeter
                                        password={field.value}
                                    />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='confirmPassword'
                            render={({ field }) => (
                                <FormItem className='mb-4'>
                                    <FormLabel className='text-white'>
                                        Confirm Password
                                    </FormLabel>
                                    <FormControl>
                                        <PasswordInput
                                            {...field}
                                            placeholder='Confirm your password'
                                            className='input glassmorphism bg-white/10 border-white/30 text-white placeholder:text-white/50'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <PasswordRequirements
                            className='grid grid-cols-2 gap-y-1'
                            control={form.control}
                        />

                        <div className='w-full flex justify-center'>
                            <Button
                                type='submit'
                                disabled={isLoading}
                                className='w-fit glassmorphism bg-blue-600/50 hover:bg-blue-600 text-white border border-blue-400'
                            >
                                <Lock className='w-4 h-4 mr-2' />
                                {isLoading ? "Creating..." : "Create Account"}
                            </Button>
                        </div>
                    </form>
                </Form>

                {error && (
                    <div className='mt-4 p-3 bg-red-600 text-white rounded-md text-sm'>
                        {error}
                    </div>
                )}
            </div>
        )
    }

    if (step === "success") {
        return (
            <div className='max-w-md mx-auto text-center'>
                <Logo className='mb-6 mx-auto' />

                <div className='p-6 bg-green-600/20 border border-green-400 rounded-md text-white'>
                    <h2 className='text-2xl font-semibold mb-2'>
                        Account Setup Complete
                    </h2>
                    <p className='text-white/80 mb-4'>
                        Thank you for your participation. Your account has been
                        successfully created. You can now start to engaging our
                        platform.
                    </p>
                    <div
                        onClick={() =>
                            router.push(userData?.callbackUrl || "/")
                        }
                        className='w-fit mt-4 mx-auto text-blue-300 hover:text-blue-400 bg-transparent underline underline-offset-4 cursor-pointer'
                    >
                        Redirect in{" "}
                        <span className='font-bold'>{countdown}</span> seconds.
                    </div>
                </div>
            </div>
        )
    }

    return null
}

const setupFormSchema = z
    .object({
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                /[A-Z]/,
                "Password must contain at least one uppercase letter"
            )
            .regex(
                /[a-z]/,
                "Password must contain at least one lowercase letter"
            )
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(
                /[^A-Za-z0-9]/,
                "Password must contain at least one special character"
            ),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })

type SetupFormValues = z.infer<typeof setupFormSchema>
