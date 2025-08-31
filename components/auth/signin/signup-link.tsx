"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"

const SignUpLink = () => {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/"

    return (
        <div className='text-center mt-4'>
            <p className='text-sm text-gray-200'>
                Don&apos;t have an account?{" "}
                <Link
                    href={`/auth/signup${callbackUrl ? `?callbackUrl=${callbackUrl}` : ""}`}
                    className='font-medium text-white hover:text-blue-200 underline underline-offset-4'
                >
                    Create your account
                </Link>
            </p>
        </div>
    )
}

export default SignUpLink