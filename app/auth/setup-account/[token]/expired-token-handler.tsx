"use client"

import { useState } from "react"
import { Logo } from "@/components/logo"
import axios from "axios"

interface ExpiredTokenHandlerProps {
    email: string
}

export default function ExpiredTokenHandler({
    email,
}: ExpiredTokenHandlerProps) {
    const [isResending, setIsResending] = useState(false)
    const [isResent, setIsResent] = useState(false)
    const [error, setError] = useState("")

    const handleResendVerification = async () => {
        setIsResending(true)
        setError("")

        try {
            await axios.post("/api/auth/resend-verification", { email })
            setIsResent(true)
        } catch {
            setError("Failed to send verification email. Please try again.")
        } finally {
            setIsResending(false)
        }
    }

    if (isResent) {
        return (
            <div className='max-w-md mx-auto'>
                <div className='text-center'>
                    <Logo />
                </div>
                <div className='mt-4 p-4 bg-green-600/20 border border-green-400 text-white rounded-md'>
                    <h2 className='text-lg font-semibold mb-2'>
                        Verification Email Sent
                    </h2>
                    <p className='text-sm mb-3'>
                        A new verification email has been sent to your email
                        address. Please check your inbox and follow the
                        instructions to complete your account setup.
                    </p>
                    <p className='text-xs text-gray-300'>
                        Don&apos;t forget to check your spam folder if you
                        don&apos;t see the email.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className='max-w-md mx-auto'>
            <div className='text-center'>
                <Logo />
            </div>
            <div className='mt-4 p-4 bg-yellow-600/20 border border-yellow-400 text-white rounded-md'>
                <h2 className='text-lg font-semibold mb-2'>Link Expired</h2>
                <p className='text-sm mb-4'>
                    Your verification link has expired for security reasons.
                    Verification links are only valid for a limited time to
                    protect your account.
                </p>
                <p className='text-sm mb-3'>
                    Click the link below to request a new verification email:
                </p>
                <span
                    className='text-blue-400 hover:text-blue-300 underline underline-offset-2 cursor-pointer'
                    onClick={handleResendVerification}
                >
                    {isResending ? "Sending..." : "Send new verification link"}
                </span>
                {error && (
                    <div className='mt-3 p-2 bg-red-600/20 border border-red-400 text-red-200 rounded text-xs'>
                        {error}
                    </div>
                )}
            </div>
        </div>
    )
}
