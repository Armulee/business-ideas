"use client"

import { Logo } from "@/components/logo"
import Form from "@/components/auth/signin/form"
import SignUpLink from "@/components/auth/signin/signup-link"
import ThirdParties from "@/components/auth/signin/third-parties"
import { useMagicLink } from "@/components/auth/signin/magic-link/context"
import MagicLinkMessage from "@/components/auth/signin/magic-link/message"

const SignInContent = () => {
    const {
        sentMagicLink,
        setSentMagicLink,
        resendCooldown,
        sendingMagicLink,
        setSendingMagicLink,
        setResendCooldown,
        magicLinkEmail,
    } = useMagicLink()

    // Handle magic link click for resend
    const handleMagicLinkClick = async () => {
        setSendingMagicLink(true)
        // Add your magic link sending logic here
        // For now, just simulate the process
        setTimeout(() => {
            setSendingMagicLink(false)
            setResendCooldown(60)
        }, 2000)
    }

    if (sentMagicLink) {
        return (
            <MagicLinkMessage
                email={magicLinkEmail}
                setSentMagicLink={setSentMagicLink}
                resendCooldown={resendCooldown}
                sendingMagicLink={sendingMagicLink}
                handleMagicLinkClick={handleMagicLinkClick}
            />
        )
    }

    return (
        <>
            <Logo className='w-fit mx-auto text-center' />
            <h2 className='mt-2 text-center text-3xl font-extrabold text-white'>
                Welcome Back
            </h2>
            <p className='mt-2 mb-4 text-center text-sm text-gray-200'>
                Sign in quickly and securely with your favorite provider
            </p>

            <ThirdParties />

            {/* Third Party Authentication */}
            <div className='mt-6 w-full flex justify-between items-center relative'>
                <div className='w-20 border-t border-gray-300' />
                <div className='relative text-sm'>
                    <span className='px-2 text-gray-200'>Or continue with</span>
                </div>
                <div className='w-20 border-t border-gray-300' />
            </div>

            <Form />
            <SignUpLink />
        </>
    )
}

export default SignInContent
