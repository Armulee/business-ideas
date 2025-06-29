import { UseFormReturn } from "react-hook-form"
import { FaGoogle } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import { GiFairyWand } from "react-icons/gi"
import { FormValues } from "./types"
import { signIn } from "@/lib/auth-actions"
import { signIn as passkeySignIn } from "next-auth/webauthn"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"
import { Fingerprint } from "lucide-react"

const SSO = ({
    form,
    setAuthentication,
    setShowDialog,
    setMagicLink,
}: {
    form: UseFormReturn<FormValues>
    setAuthentication: React.Dispatch<
        React.SetStateAction<{ provider: string; email?: string }>
    >
    setShowDialog: React.Dispatch<React.SetStateAction<boolean>>
    setMagicLink: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/"

    const handleSSOSignIn = async (provider: string) => {
        let formattedProvider
        if (provider === "x") {
            formattedProvider = "twitter"
        } else if (provider === "magic link") {
            formattedProvider = "resend"
        } else {
            formattedProvider = provider
        }

        if (!form.getValues("consent")) {
            setAuthentication({ provider: formattedProvider })
            setShowDialog(true)
            return
        }

        if (
            formattedProvider === "twitter" ||
            formattedProvider === "google" ||
            formattedProvider === "resend"
        ) {
            await signIn(formattedProvider, { callbackUrl })
        } else if (formattedProvider === "passkey") {
            await passkeySignIn("passkey")
        }
    }
    return (
        <div className='flex flex-col justify-center items-center gap-3'>
            <Button
                onClick={() => handleSSOSignIn("google")}
                className='w-full inline-flex justify-center py-2 px-4 glassmorphism bg-transparent text-sm font-medium text-white hover:bg-gray-50 hover:text-blue-700'
            >
                <FaGoogle className='w-5 h-5 mr-2' />
                Continue with Google
            </Button>
            <Button
                onClick={() => handleSSOSignIn("twitter")}
                className='w-full inline-flex justify-center py-2 px-4 glassmorphism bg-transparent text-sm font-medium text-white hover:bg-gray-50 hover:text-blue-700'
            >
                <FaXTwitter className='w-5 h-5 mr-2' />
                Continue with X
            </Button>
            <Button
                onClick={() => setMagicLink(true)}
                className='w-full inline-flex justify-center py-2 px-4 glassmorphism bg-transparent text-sm font-medium text-white hover:bg-gray-50 hover:text-blue-700'
            >
                <GiFairyWand className='w-5 h-5 mr-2' />
                Continue with Magic Link
            </Button>
            <Button
                onClick={() => passkeySignIn("passkey")}
                className='w-full inline-flex justify-center py-2 px-4 glassmorphism bg-transparent text-sm font-medium text-white hover:bg-gray-50 hover:text-blue-700'
            >
                <Fingerprint className='w-5 h-5 mr-2' />
                Continue with Passkey
            </Button>
        </div>
    )
}

export default SSO
