"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import axios, { AxiosError } from "axios"
import { formSchema, FormValues } from "./types"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import Name from "./name"
import Email from "./email"
import Password from "./password"
import ConfirmPassword from "./confirm-password"
import Consent from "./consent"
import { Logo } from "@/components/logo"

const SignUp = () => {
    const [step, setStep] = useState<"form" | "sent">("form")
    const [submittedEmail, setSubmittedEmail] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            consent: false,
        },
    })

    const onSubmit = async (data: FormValues) => {
        try {
            setIsLoading(true)

            await axios.post("/api/user", {
                name: data.name,
                email: data.email,
                password: data.password,
                provider: "credentials",
            })

            setSubmittedEmail(data.email)
            setStep("sent")

            // await signIn("credentials", {
            //     email: data.email,
            //     password: data.password,
            //     callbackUrl: "/",
            // })
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

    if (step === "sent") {
        return (
            <div className='mt-8 max-w-md mx-auto text-center'>
                <Logo className='mb-4' />
                <h2 className='text-2xl font-semibold mb-3'>Almost there!</h2>
                <p className='text-white/70'>
                    Thank you for registering. We&apos;ve sent a verification
                    link to
                </p>
                <div className='glassmorphism px-4 py-2 my-4 w-fit mx-auto font-bold'>
                    {submittedEmail}
                </div>
                <p className='text-sm text-white/70 mb-6'>
                    Click the link in that email to verify your account—and
                    we&apos;ll log you in automatically.
                </p>
                <p className='text-sm text-white/50'>
                    Didn&apos;t receive it?{" "}
                    <button
                        className='underline'
                        onClick={() => setStep("form")}
                        disabled={isLoading}
                    >
                        Resend
                    </button>
                </p>
            </div>
        )
    }

    return (
        <>
            <Logo className='text-center' />
            <h2 className='mt-2 text-center text-3xl font-extrabold text-white'>
                Welcome to Future of Innovation
            </h2>
            <p className='mt-2 text-center text-sm text-gray-200'>
                Create an account and start sharing or exploring the fascinating
                ideas today!
            </p>
            <div className='mt-8 max-w-sm mx-auto space-y-6'>
                <Form {...form}>
                    <form
                        className='mt-8 space-y-4'
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <Name control={form.control} />
                        <Email control={form.control} />
                        <Password control={form.control} />
                        <ConfirmPassword control={form.control} />
                        <Consent control={form.control} />
                        <Button
                            type='submit'
                            className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 border border-white hover:bg-white hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                            disabled={isLoading}
                        >
                            {isLoading ? "Loading..." : "Register"}
                        </Button>
                    </form>
                </Form>

                <div className='mt-8 text-center'>
                    <p className='text-sm text-gray-200'>
                        Already have an account?{" "}
                        <Link
                            href='signin'
                            className='font-medium text-white hover:text-blue-200 underline underline-offset-4'
                        >
                            Sign in
                        </Link>
                    </p>
                </div>

                {error && (
                    <div className='mt-3 text-center text-sm text-red-600'>
                        {error}
                    </div>
                )}
            </div>
        </>
    )
}

export default SignUp
