// components/ForgetPassword.tsx
"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import { useForm, useWatch } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Logo } from "../logo"
import Loading from "../loading"
import { Eye, EyeOff } from "lucide-react"
import PasswordRequirements from "./password-requirements"
import PasswordStrengthMeter from "./password-strength-meter"

const schema = z
    .object({
        password: z
            .string()
            .min(8, "At least 8 characters")
            .regex(/[A-Z]/, "One uppercase letter")
            .regex(/[a-z]/, "One lowercase letter")
            .regex(/[0-9]/, "One digit")
            .regex(/[^A-Za-z0-9]/, "One special character"),
        confirmPassword: z.string().min(1, "Confirm your password"),
    })
    .refine((d) => d.password === d.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })

type FormData = z.infer<typeof schema>

interface ApiResponse {
    message: string
    code: string
}

export default function ResetPassword({ token }: { token: string }) {
    const [phase, setPhase] = useState<
        "loading" | "invalid" | "expired" | "form" | "success" | "error"
    >("loading")
    const [info, setInfo] = useState<string>("")
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [showConfirmPassword, setShowConfirmPassword] =
        useState<boolean>(false)
    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { password: "", confirmPassword: "" },
    })

    const password = useWatch({ control: form.control, name: "password" })

    // Verify token on mount
    useEffect(() => {
        const verifyToken = async () => {
            try {
                const res = await axios.get<ApiResponse>(
                    `/api/auth/reset-password/${token}`
                )
                if (res.data.code === "TOKEN_VALID") {
                    setPhase("form")
                } else if (res.data.code === "EXPIRED_TOKEN") {
                    setPhase("expired")
                } else {
                    setPhase("invalid")
                }
                setInfo(res.data.message)
            } catch (err) {
                if (axios.isAxiosError(err) && err.response) {
                    setPhase("invalid")
                    setInfo(err.response.data.message)
                } else {
                    setPhase("error")
                    setInfo("Unexpected error")
                }
            }
        }
        verifyToken()
    }, [token])

    // 2) Handle reset submit
    const onSubmit = async (values: FormData) => {
        try {
            const res = await axios.post<ApiResponse>(
                `/api/auth/forget-password/${token}`,
                { password: values.password }
            )
            if (res.data.code === "PASSWORD_RESET_SUCCESS") {
                setPhase("success")
                setInfo(res.data.message)
            } else {
                setPhase("error")
                setInfo(res.data.message)
            }
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setPhase("error")
                setInfo(err.response.data.message)
            } else {
                setPhase("error")
                setInfo("Unexpected error")
            }
        }
    }

    return (
        <section className='sm:max-w-md mx-auto relative'>
            {phase !== "loading" && (
                <div className='w-full text-right text-sm mt-20 mb-4'>
                    <Logo />
                </div>
            )}

            {phase === "loading" && <Loading />}

            {phase === "invalid" && (
                <div className='glassmorphism bg-red-500/20 p-6'>
                    <div className='text-center'>
                        <h1 className='text-xl font-semibold mb-3'>
                            The reset link you have provided is invalid.
                        </h1>
                        <div className='mb-4 text-sm text-white/70'>{info}</div>
                        <Link
                            href='/auth/forget-password'
                            className='text-white/80 text-sm glassmorphism bg-white/10 px-4 py-2 hover:bg-blue-600/50'
                        >
                            Request a new link
                        </Link>
                    </div>
                </div>
            )}

            {phase === "expired" && (
                <div className='glassmorphism bg-yellow-900/20 p-6'>
                    <div className='text-center space-y-4'>
                        <h1 className='text-2xl font-semibold'>
                            The reset link you have provided is expired.
                        </h1>
                        <p>{info}</p>
                        <Link
                            href='/auth/forget-password'
                            className='text-white/80 text-sm glassmorphism bg-white/10 px-4 py-2 hover:bg-blue-600/50'
                        >
                            Request a new link
                        </Link>
                    </div>
                </div>
            )}

            {phase === "form" && (
                <div className='glassmorphism bg-transparent p-6'>
                    <h1 className='text-xl font-semibold mb-4'>
                        Reset Your Password
                    </h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            {/* Password Strength Meter */}
                            <PasswordStrengthMeter password={password} />
                            {/* Password */}
                            <div className='relative mb-4'>
                                <FormField
                                    control={form.control}
                                    name='password'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='sr-only'>
                                                New Password
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    className='input'
                                                    placeholder='Enter new password'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <button
                                    type='button'
                                    onClick={() =>
                                        setShowPassword((prev) => !prev)
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
                            {/* Confirm Password */}
                            <div className='relative mb-4'>
                                <FormField
                                    control={form.control}
                                    name='confirmPassword'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='sr-only'>
                                                Confirm Password
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type={
                                                        showConfirmPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    className='input'
                                                    placeholder='Confirm new password'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <button
                                    type='button'
                                    onClick={() =>
                                        setShowConfirmPassword((prev) => !prev)
                                    }
                                    className='absolute inset-y-0 right-0 flex items-center pr-3 z-10'
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className='h-5 w-5 text-gray-400' />
                                    ) : (
                                        <Eye className='h-5 w-5 text-gray-400' />
                                    )}
                                </button>
                            </div>

                            <PasswordRequirements control={form.control} />

                            <div className='w-full flex items-center justify-center mt-5'>
                                <Button
                                    type='submit'
                                    className='glassmorphism bg-transparent hover:bg-blue-600/40'
                                >
                                    Reset Password
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            )}

            {phase === "success" && (
                <div className='glassmorphism bg-green-500/30 p-4'>
                    <div className='text-center'>
                        <h1 className='text-2xl font-semibold mb-4'>
                            Password reset successful!
                        </h1>
                        <p className='mb-5'>{info}</p>
                        <Link
                            href='/auth/signin'
                            className='px-4 py-2 glassmorphism bg-transparent hover:bg-blue-600/40 transition duration-500'
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            )}

            {phase === "error" && (
                <div className='text-center space-y-4'>
                    <h1 className='text-2xl font-semibold'>
                        Oops! <br />
                        <span className='text-lg'>Something Went Wrong</span>
                    </h1>
                    <p>{info}</p>
                </div>
            )}
        </section>
    )
}
