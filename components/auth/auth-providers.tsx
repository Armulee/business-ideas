"use client"

import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"
import ThirdParties from "./signin/third-parties"

interface AuthProvidersProps {
    onContinueWithPassword: () => void
}

const AuthProviders = ({ onContinueWithPassword }: AuthProvidersProps) => {
    return (
        <div className='space-y-4'>
            <ThirdParties />

            <Button
                type='button'
                onClick={onContinueWithPassword}
                className='w-full flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 rounded-lg py-3 font-medium transition-all duration-200'
            >
                <Lock className='h-5 w-5' />
                Continue with Password
            </Button>
        </div>
    )
}

export default AuthProviders