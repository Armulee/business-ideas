"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    FaGoogle,
    // FaApple,s
    // FaLinkedin,
    FaFacebook,
} from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import "./styles.css"

export default function SignIn() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/"

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const result = await signIn("email", {
                email,
                callbackUrl,
                redirect: false,
            })
            if (result?.error) {
                setError("Failed to send login link. Please try again.")
            } else {
                setEmail("")
                alert("Check your email for the login link!")
            }
        } catch (error) {
            setError(`An unexpected error occurred. ${error} Please try again.`)
        }

        setIsLoading(false)
    }

    const providers = [
        { name: "Google", icon: <FaGoogle className='w-5 h-5 mr-2' /> },
        // { name: "Apple", icon: <FaApple className='w-5 h-5 mr-2' /> },
        { name: "Facebook", icon: <FaFacebook className='w-5 h-5 mr-2' /> },
        { name: "X", icon: <FaXTwitter className='w-5 h-5 mr-2' /> },
        // { name: "Linkedin", icon: <FaLinkedin className='w-5 h-5 mr-2' /> },
    ]

    const handleSSOSignIn = (provider: string) => {
        if (provider === "x") {
            signIn("twitter", { callbackUrl })
        } else {
            signIn(provider, { callbackUrl })
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center moving-gradient pb-12 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-sm w-full space-y-8'>
                <div>
                    <h1 className='mt-6 text-center text-lg font-extrabold text-blue-200'>
                        Business Ideas
                    </h1>
                    <h2 className='mt-2 text-center text-3xl font-extrabold text-white'>
                        Welcome Back
                    </h2>
                    <p className='mt-2 text-center text-sm text-gray-200'>
                        Sign in quickly and securely with your favorite provider
                    </p>
                </div>
                <div className='mt-8 space-y-6'>
                    <div className='flex flex-col justify-center items-center gap-3'>
                        {providers.map((provider) => (
                            <Button
                                key={`provider-${provider.name}`}
                                onClick={() =>
                                    handleSSOSignIn(provider.name.toLowerCase())
                                }
                                className='w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm glassmorphism text-sm font-medium text-white hover:bg-gray-50 hover:text-blue-700'
                            >
                                {provider.icon}
                                Sign in with {provider.name}
                            </Button>
                        ))}{" "}
                    </div>

                    <div className='mt-6 w-full flex justify-between items-center relative'>
                        <div className='w-28 border-t border-gray-300' />
                        <div className='relative text-sm'>
                            <span className='px-2 text-gray-200'>
                                Or continue with
                            </span>
                        </div>
                        <div className='w-28 border-t border-gray-300' />
                    </div>

                    <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
                        <div className='rounded-md shadow-sm -space-y-px glassmorphism'>
                            <div>
                                <label
                                    htmlFor='email-address'
                                    className='sr-only'
                                >
                                    Email address
                                </label>
                                <Input
                                    id='email-address'
                                    name='email'
                                    type='email'
                                    autoComplete='email'
                                    required
                                    className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder:text-gray-300 text-white rounded focus:outline-none focus:ring-white focus:border-white focus:z-10 sm:text-sm'
                                    placeholder='Email address'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <Button
                                type='submit'
                                className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-white hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                disabled={isLoading}
                            >
                                {isLoading ? "Sending..." : "Send Magic Link"}
                            </Button>
                        </div>
                    </form>

                    {error && (
                        <div className='mt-3 text-center text-sm text-red-600'>
                            {error}
                        </div>
                    )}
                </div>

                <div className='mt-8 text-center'>
                    <p className='text-xs text-gray-200'>
                        By signing in, you agree to our{" "}
                        <a
                            href='/privacy'
                            className='font-medium text-blue-800 hover:text-indigo-800'
                        >
                            Privacy Policy
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}
