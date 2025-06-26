"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, Mail } from "lucide-react"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import { Logo } from "../logo"

const ForgotPassword = () => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const formSchema = z.object({
        email: z.string().email({ message: "Invalid email format" }),
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true)

        try {
            // Call your password reset API endpoint
            const response = await axios.post("/api/auth/forget-password", {
                email: values.email,
            })

            if (response.status === 200) {
                setIsSuccess(true)
            }
        } catch (error) {
            const message =
                error instanceof AxiosError
                    ? error.response?.data.message
                    : "Something went wrong"
            form.setError("email", { message })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className='sm:max-w-md mx-auto relative'>
            <div className='flex justify-between items-center gap-1 text-sm mt-20 mb-4'>
                <div
                    onClick={() => router.push("/auth/signin")}
                    className='w-fit cursor-pointer flex items-center gap-1 text-white hover:text-blue-300 transition duration-300'
                >
                    <ChevronLeft />
                    Back
                </div>
                <Logo />
            </div>
            <div className='glassmorphism p-4'>
                <div className='flex items-center gap-2 text-2xl font-bold mb-4'>
                    <Mail className='h-8 w-8' />
                    Reset Password
                </div>
                <p className='text-sm text-white/60 mb-4'>
                    {isSuccess
                        ? "Check your email for password reset instructions."
                        : "Enter your email address and we'll send you a link to reset your password."}
                </p>

                {!isSuccess ? (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem className='mb-4'>
                                        <FormLabel className='text-xs'>
                                            Email address:
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id='reset-email'
                                                type='email'
                                                placeholder='Enter your email'
                                                onChange={field.onChange}
                                                disabled={isLoading}
                                                className='input'
                                                required
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type='submit'
                                className='flex-1 glassmorphism bg-transparent hover:bg-white/20'
                            >
                                {isLoading ? "Sending..." : "Send Reset Link"}
                            </Button>
                        </form>
                    </Form>
                ) : (
                    <div className='space-y-4'>
                        <div className='text-center p-4 bg-green-50 rounded-md'>
                            <div className='text-green-800 text-sm'>
                                Password reset instructions have been sent to{" "}
                                <span className='font-medium'>
                                    {form.getValues("email")}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

export default ForgotPassword
