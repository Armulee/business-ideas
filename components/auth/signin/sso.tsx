import { UseFormReturn } from "react-hook-form"
import { FaGoogle } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import { FormValues } from "./types"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"
import { Wand } from "lucide-react"

const providers = [
    { name: "Google", icon: <FaGoogle className='w-5 h-5 mr-2' /> },
    // { name: "Apple", icon: <FaApple className='w-5 h-5 mr-2' /> },
    // { name: "Facebook", icon: <FaFacebook className='w-5 h-5 mr-2' /> },
    { name: "X", icon: <FaXTwitter className='w-5 h-5 mr-2' /> },
    {
        name: "Magic Link",
        icon: <Wand className='w-5 h-5 mr-2' />,
    },
    // { name: "Linkedin", icon: <FaLinkedin className='w-5 h-5 mr-2' /> },
]

const SSO = ({
    form,
    setSelectedProvider,
    setShowDialog,
}: {
    form: UseFormReturn<FormValues>
    setSelectedProvider: React.Dispatch<React.SetStateAction<string | null>>
    setShowDialog: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/"

    const handleSSOSignIn = (provider: string) => {
        let formattedProvider
        if (provider === "x") {
            formattedProvider = "twitter"
        } else if (provider === "magic link") {
            formattedProvider = "email"
        } else {
            formattedProvider = provider
        }
        if (!form.getValues("consent")) {
            setSelectedProvider(formattedProvider)
            setShowDialog(true)
            return
        }

        signIn(formattedProvider, { callbackUrl })
    }
    return (
        <div className='flex flex-col justify-center items-center gap-3'>
            {providers.map((provider) => (
                <Button
                    key={`provider-${provider.name}`}
                    onClick={() => handleSSOSignIn(provider.name.toLowerCase())}
                    className='w-full inline-flex justify-center py-2 px-4 glassmorphism bg-transparent text-sm font-medium text-white hover:bg-gray-50 hover:text-blue-700'
                >
                    {provider.icon}
                    Continue with {provider.name}
                </Button>
            ))}{" "}
        </div>
    )
}

export default SSO
