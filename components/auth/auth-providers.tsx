"use client"

import { Button } from "@/components/ui/button"
import ThirdParties from "./signin/third-parties"

interface AuthProvidersProps {
    onContinueWithPassword: () => void
}

const AuthProviders = ({ onContinueWithPassword }: AuthProvidersProps) => {
    return (
        <>
            <ThirdParties />

            {/* Third Party Authentication */}
            <div className='mt-6 w-full flex justify-between items-center relative'>
                <div className='w-20 border-t border-gray-300' />
                <div className='relative text-sm'>
                    <span className='px-2 text-gray-200'>Or continue with</span>
                </div>
                <div className='w-20 border-t border-gray-300' />
            </div>

            <Button
                type='button'
                onClick={onContinueWithPassword}
                className='w-full mt-4 bg-gray-700 hover:bg-gray-600 text-white border border-gray-600'
            >
                Continue with Password
            </Button>
        </>
    )
}

export default AuthProviders