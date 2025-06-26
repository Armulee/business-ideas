// components/VerifyEmail.tsx
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"

type ApiCode =
    | "VERIFICATION_SUCCESS"
    | "EXPIRED_TOKEN"
    | "INVALID_TOKEN"
    | "NO_TOKEN"
    | string

interface ApiResponse {
    message: string
    code: ApiCode
}

interface VerifyEmailProps {
    token: string
}

export default function VerifyEmail({ token }: VerifyEmailProps) {
    const router = useRouter()
    const [status, setStatus] = useState<"loading" | ApiCode>("loading")
    const [message, setMessage] = useState<string>("")
    const [countdown, setCountdown] = useState(10)

    // Call backend once on mount
    useEffect(() => {
        const verify = async () => {
            try {
                const response = await axios.get<ApiResponse>(
                    `/api/auth/verify-email/${token}`
                )
                const data = response.data

                // success or other codes all come back 200 with your JSON
                setStatus(data.code)
                setMessage(data.message)
            } catch (err) {
                if (axios.isAxiosError(err) && err.response) {
                    const data = err.response.data as ApiResponse
                    setStatus(data.code)
                    setMessage(data.message)
                } else {
                    setStatus("UNKNOWN_ERROR")
                    setMessage("An unexpected error occurred.")
                }
            }
        }

        verify()
    }, [token, router])

    // When success, start countdown → redirect “/”
    useEffect(() => {
        if (status !== "VERIFICATION_SUCCESS") return
        const iv = setInterval(() => {
            setCountdown((c) => {
                if (c <= 0) {
                    clearInterval(iv)
                    router.push("/")
                }
                return c - 1
            })
        }, 1000)
        return () => clearInterval(iv)
    }, [status, router])

    if (status === "loading") {
        return <p>Verifying your email…</p>
    }

    // success
    if (status === "VERIFICATION_SUCCESS") {
        return (
            <div className='text-center space-y-4'>
                <h1 className='text-2xl font-semibold'>✅ Email Verified!</h1>
                <p>{message}</p>
                <p>
                    Redirecting in <strong>{countdown}</strong> second
                    {countdown === 1 ? "" : "s"}…
                </p>
                <Link
                    href='/'
                    className='inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
                >
                    Go now
                </Link>
            </div>
        )
    }

    // expired
    if (status === "EXPIRED_TOKEN") {
        return (
            <div className='text-center space-y-4'>
                <h1 className='text-2xl font-semibold'>⌛ Link Expired</h1>
                <p>{message}</p>
                <Link
                    href='/signup'
                    className='inline-block mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
                >
                    Sign up again
                </Link>
            </div>
        )
    }

    // invalid or missing
    if (status === "INVALID_TOKEN" || status === "NO_TOKEN") {
        return (
            <div className='text-center space-y-4'>
                <h1 className='text-2xl font-semibold'>
                    ❌ Verification Failed
                </h1>
                <p>{message}</p>
                <Link
                    href='/signup'
                    className='inline-block mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
                >
                    Sign up
                </Link>
            </div>
        )
    }

    // catch-all for anything else
    return (
        <div className='text-center space-y-4'>
            <h1 className='text-2xl font-semibold'>⚠️ Oops</h1>
            <p>{message}</p>
            <Link
                href='/'
                className='inline-block mt-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700'
            >
                Home
            </Link>
        </div>
    )
}
