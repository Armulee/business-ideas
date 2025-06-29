import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { signIn } from "@/lib/auth-actions"
import { CheckCircleIcon, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { GiFairyWand } from "react-icons/gi"

export default function MagicLink({
    setMagicLink,
}: {
    setMagicLink: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/"

    const [consent, setConsent] = useState<boolean>(false)
    const [email, setEmail] = useState<string>("")
    const [sent, setSent] = useState<boolean>(false)
    const [countdown, setCountdown] = useState(10)
    const handleMagicLink = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (consent && email) {
            await signIn("resend", { callbackUrl, email })
            setSent(true)
        }
    }
    useEffect(() => {
        if (sent) {
            setCountdown(10) // Reset to 10 seconds

            const interval = setInterval(() => {
                setCountdown((prev) => prev - 1)
            }, 1000)

            const timeout = setTimeout(() => {
                setMagicLink(false)
                clearInterval(interval)
            }, 10000)

            return () => {
                clearInterval(interval)
                clearTimeout(timeout)
            }
        }
    }, [sent, setMagicLink])

    return (
        <div className='max-w-sm mx-auto'>
            <Logo className='text-center mb-6' />
            {!sent ? (
                <>
                    <div
                        className='w-fit flex items-center gap-1 mb-4 underline underline-offset-4 cursor-pointer hover:-translate-x-1 duration-300'
                        onClick={() => setMagicLink(false)}
                    >
                        <ChevronLeft />
                        Go Back
                    </div>
                    <p className='text-left text-white mb-4'>
                        No password needed, you&apos;ll receive a “magic link”
                        in your email inbox. Click it within a few minutes to
                        log in instantly.
                    </p>

                    {/* Email input + submit button */}
                    <form onSubmit={handleMagicLink} className='space-y-4'>
                        <Input
                            type='email'
                            placeholder='Please enter your email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className='input w-full py-2 px-4'
                        />

                        <div className='flex items-center gap-2'>
                            <Checkbox
                                required
                                onCheckedChange={(checked) =>
                                    setConsent(checked ? true : false)
                                }
                                className='border border-white'
                            />
                            <p className='text-sm'>
                                I agree to the{" "}
                                <Link
                                    href='/terms'
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
                            </p>
                        </div>

                        <Button
                            type='submit'
                            className='button !bg-blue-600 w-full'
                        >
                            <GiFairyWand />
                            Send Magic Link
                        </Button>
                    </form>
                </>
            ) : (
                <>
                    <div className='flex items-center bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md mb-6'>
                        <CheckCircleIcon className='w-5 h-5 mr-2 animate-pulse' />
                        <p className='font-medium'>
                            Magic link sent! Check your email.
                        </p>
                    </div>
                    <p className='text-center'>
                        <span
                            onClick={() => setMagicLink(false)}
                            className='text-blue-400 underline underline-offset-2 cursor-pointer'
                        >
                            Go back
                        </span>{" "}
                        to the main page in {countdown}s
                    </p>
                </>
            )}
        </div>
    )
}
