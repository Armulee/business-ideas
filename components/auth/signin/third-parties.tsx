"use client"

import { FaGoogle, FaLinkedin } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import { GiFairyWand } from "react-icons/gi"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"
import { useLoading } from "@/components/loading-provider"
import { useMagicLink } from "./magic-link/context"

const ThirdParties = () => {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/"
    const { setIsLoading } = useLoading()
    const { isMagicLinkMode, toggleMagicLinkMode, sendingMagicLink } =
        useMagicLink()

    const handleSSOSignIn = async (provider: string) => {
        setIsLoading(true)
        await signIn(provider, { callbackUrl })
    }

    return (
        <div className='flex flex-col justify-center items-center gap-3'>
            <Button
                onClick={() => handleSSOSignIn("google")}
                disabled={sendingMagicLink}
                className='group w-full inline-flex justify-center py-2 px-4 glassmorphism !border-0 bg-transparent text-sm font-medium text-white transition duration-300 hover:bg-white hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white'
            >
                <FaGoogle className='w-5 h-5 mr-2 text-white group-hover:text-blue-600 transition duration-300' />
                Continue with Google
            </Button>
            <Button
                onClick={() => handleSSOSignIn("twitter")}
                disabled={sendingMagicLink}
                className='group w-full inline-flex justify-center py-2 px-4 glassmorphism !border-0 bg-transparent text-sm font-medium text-white transition duration-300 hover:bg-white hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white'
            >
                <FaXTwitter className='w-5 h-5 mr-2 text-white group-hover:text-blue-600 transition duration-300' />
                Continue with X
            </Button>
            <Button
                onClick={() => handleSSOSignIn("linkedin")}
                disabled={sendingMagicLink}
                className='group w-full inline-flex justify-center py-2 px-4 glassmorphism !border-0 bg-transparent text-sm font-medium text-white transition duration-300 hover:bg-white hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white'
            >
                <FaLinkedin className='w-5 h-5 mr-2 text-white group-hover:text-blue-600 transition duration-300' />
                Continue with LinkedIn
            </Button>

            {/* Magic Link Button */}
            <Button
                type='button'
                onClick={toggleMagicLinkMode}
                disabled={sendingMagicLink}
                className={`group w-full inline-flex justify-center py-2 px-4 glassmorphism text-sm font-medium transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isMagicLinkMode
                        ? "!border-0 bg-blue-600/50 text-white hover:bg-blue-700 hover:text-white disabled:hover:bg-blue-600/50"
                        : "!border-0 bg-transparent text-white hover:bg-indigo-600 hover:text-white disabled:hover:bg-transparent"
                }`}
            >
                <GiFairyWand className='w-5 h-5 mr-2 transition duration-300' />
                {isMagicLinkMode
                    ? "Use Password Instead"
                    : "Continue with Magic Link"}
            </Button>
        </div>
    )
}

export default ThirdParties
