"use client"

import { Button } from "@/components/ui/button"
import ThirdParties from "./signin/third-parties"

interface AuthProvidersProps {
    onContinueWithPassword: () => void
}

const AuthProviders = ({ onContinueWithPassword }: AuthProvidersProps) => {
    return (
        <div className='space-y-6'>
            <ThirdParties />

            <Button
                type='button'
                onClick={onContinueWithPassword}
                className='w-full bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white border border-gray-500/50 rounded-xl py-3 font-medium transition-all duration-200 shadow-lg hover:shadow-xl'
            >
                Continue with Password
            </Button>
        </div>
    )
}

export default AuthProviders