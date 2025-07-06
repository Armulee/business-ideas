import { useRouter } from "next/navigation"
import { Logo } from "../logo"
import { ChevronLeft } from "lucide-react"
import { useEffect, useState } from "react"
import axios, { AxiosError } from "axios"

export default function SentVerification({
    email,
    noInitialCooldown = false,
}: {
    email: string
    noInitialCooldown?: boolean
}) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")

    // handle resend logic
    const [resendCooldown, setResendCooldown] = useState<number>(0)
    const handleResend = async () => {
        const submittedEmail = email.trim().toLowerCase()
        if (isLoading || resendCooldown > 0) return // safeguard

        setIsLoading(true)
        try {
            await axios.post("/api/auth/resend-verification", {
                email: submittedEmail,
            })
            setResendCooldown(60)
        } catch (error) {
            console.error("Resend failed", error)
            setError(`Resend failed ${(error as AxiosError).message}`)
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        if (!noInitialCooldown) {
            setResendCooldown(60)
        }
    }, [noInitialCooldown])
    useEffect(() => {
        if (resendCooldown === 0) return
        const timer = setInterval(() => {
            setResendCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer) // cleanup on unmount or cooldown change
    }, [resendCooldown])
    return (
        <div className='mt-8 max-w-md mx-auto text-center'>
            <div
                onClick={() => router.push("/auth/signin")}
                className='w-fit flex items-center hover:-translate-x-1 duration-300 mb-5 cursor-pointer group'
            >
                <ChevronLeft className='w-5 h-5' />
                <span className='text-sm text-white group-hover:underline underline-offset-2'>
                    Go back
                </span>
            </div>
            <Logo className='mb-6' />
            <h2 className='text-2xl font-semibold mb-3'>Almost there!</h2>
            <p className='text-white/70'>
                Thank you for registering. We&apos;ve sent a verification link
                to
            </p>
            <div className='glassmorphism px-4 py-2 my-4 w-fit mx-auto font-bold'>
                {email}
            </div>
            <p className='text-sm text-white/70 mb-6'>
                Click the link in that email to verify your account. After
                verification, you&apos;ll be able to set up your passkey or
                create a username and password.
            </p>
            <p className='text-sm text-white/50'>
                Didn&apos;t receive it?{" "}
                <button
                    className={
                        isLoading || resendCooldown > 0
                            ? "text-gray-400"
                            : "text-blue-400 underline"
                    }
                    onClick={handleResend}
                    disabled={isLoading || resendCooldown > 0}
                >
                    {resendCooldown > 0
                        ? `Resend in ${resendCooldown}s`
                        : isLoading
                          ? "Resending..."
                          : "Resend"}
                </button>
            </p>
            {error && (
                <div className='mt-3 text-center text-sm text-red-600'>
                    {error}
                </div>
            )}
        </div>
    )
}
