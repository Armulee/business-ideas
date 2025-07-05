import { UseFormReturn } from "react-hook-form"
import { FaGoogle } from "react-icons/fa"
// import { FaXTwitter } from "react-icons/fa6"
import { FormValues } from "./types"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"
import { useLoading } from "@/components/loading-provider"

const SSO = ({
    form,
    setAuthentication,
    setShowDialog,
}: {
    form: UseFormReturn<FormValues>
    setAuthentication: React.Dispatch<
        React.SetStateAction<{ provider: string; email?: string }>
    >
    setShowDialog: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/"
    const { setIsLoading } = useLoading()
    const handleSSOSignIn = async (provider: string) => {
        let formattedProvider
        if (provider === "x") {
            formattedProvider = "twitter"
        } else {
            formattedProvider = provider
        }

        if (!form.getValues("consent")) {
            setAuthentication({ provider: formattedProvider })
            setShowDialog(true)
            return
        }

        if (formattedProvider === "twitter" || formattedProvider === "google") {
            setIsLoading(true)
            await signIn(formattedProvider, { callbackUrl, redirect: false })
        }
    }
    return (
        <div className='flex flex-col justify-center items-center gap-3'>
            <Button
                onClick={() => handleSSOSignIn("google")}
                className='group w-full inline-flex justify-center py-2 px-4 glassmorphism !border-0 bg-transparent text-sm font-medium text-white transition duration-300 hover:bg-white hover:text-blue-600'
            >
                <FaGoogle className='w-5 h-5 mr-2 text-white group-hover:text-blue-600 transition duration-300' />
                Continue with Google
            </Button>
            {/* <Button
                onClick={() => handleSSOSignIn("twitter")}
                className='group w-full inline-flex justify-center py-2 px-4 glassmorphism bg-transparent text-sm font-medium text-white transition duration-300 hover:bg-black'
            >
                <FaXTwitter className='w-5 h-5 mr-2 text-white' />
                Continue with X
            </Button> */}
        </div>
    )
}

export default SSO
