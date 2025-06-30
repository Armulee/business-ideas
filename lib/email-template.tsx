import { Sparkle } from "lucide-react"

export function ForgetPasswordEmailTemplate({
    name,
    resetUrl,
}: {
    name: string | null
    resetUrl: string
}) {
    return (
        <div className='font-sans max-w-xl mx-auto p-6 bg-gray-100 rounded-lg text-gray-800'>
            <div className='text-center mb-6'>
                <h1 className='text-2xl font-bold text-gray-900'>
                    <span className='text-blue-500'>Blue</span>BizHub
                </h1>
                <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/10 backdrop-blur text-white mt-2'>
                    <Sparkle />
                    Idea, Validate, Refine
                </span>
            </div>

            <div className='bg-white p-6 rounded-lg shadow'>
                <h2 className='text-xl font-semibold text-gray-900'>
                    Password Reset Request
                </h2>
                <p className='mt-4'>Hi {name || "there"},</p>
                <p className='mt-2'>
                    We received a request to reset the password associated with
                    this email address. If you made this request, please click
                    the button below to set a new password:
                </p>

                <div className='text-center my-6'>
                    <a
                        href={resetUrl}
                        className='bg-blue-500 text-white px-5 py-3 rounded-md text-base font-medium hover:bg-blue-600 transition'
                    >
                        Reset Password
                    </a>
                </div>

                <p>
                    If you didn&apos;t request this, you can safely ignore this
                    email. Your current password will remain unchanged.
                </p>
                <p className='text-sm text-gray-500 mt-4'>
                    This link will expire in 30 minutes for your security.
                </p>
            </div>

            <div className='text-center text-xs text-gray-400 mt-6'>
                &copy; {new Date().getFullYear()}{" "}
                <h1 className='text-2xl font-bold text-gray-900'>
                    <span className='text-blue-500'>Blue</span>BizHub
                </h1>
                . All rights reserved.
                <br />
                You received this email because you have an account with us.
            </div>
        </div>
    )
}

export function VerifyEmailTemplate({
    name,
    verifyUrl,
}: {
    name: string | null
    verifyUrl: string
}) {
    return (
        <div className='font-sans max-w-xl mx-auto p-6 bg-gray-100 rounded-lg text-gray-800'>
            <div className='text-center mb-6'>
                <h1 className='text-2xl font-bold text-gray-900'>
                    <span className='text-blue-500'>Blue</span>BizHub
                </h1>
                <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/10 backdrop-blur text-white mt-2'>
                    <Sparkle />
                    Idea, Validate, Refine
                </span>
            </div>

            <div className='bg-white p-6 rounded-lg shadow'>
                <h2 className='text-xl font-semibold text-gray-900'>
                    Password Reset Request
                </h2>
                <p className='mt-4'>Welcome, {name || "there"}!</p>
                <p className='mt-2'>
                    Thank you for signing up with{" "}
                    <h1 className='text-2xl font-bold text-gray-900'>
                        <span className='text-blue-500'>Blue</span>BizHub
                    </h1>
                    . We&apos;re excited to have you join our community of
                    innovators and entrepreneurs.
                </p>{" "}
                <p>
                    To activate your account, please verify your email address
                    by clicking the button below:{" "}
                </p>
                <div className='text-center my-6'>
                    <a
                        href={verifyUrl}
                        className='bg-blue-500 text-white px-5 py-3 rounded-md text-base font-medium hover:bg-blue-600 transition'
                    >
                        Verify Email
                    </a>
                </div>
                <p className='text-sm text-gray-500 mt-4'>
                    This link will expire in 30 minutes for your security.
                </p>
            </div>

            <div className='text-center text-xs text-gray-400 mt-6'>
                &copy; {new Date().getFullYear()}{" "}
                <h1 className='text-2xl font-bold text-gray-900'>
                    <span className='text-blue-500'>Blue</span>BizHub
                </h1>
                . All rights reserved.
                <br />
                You received this email because you have an account with us.
            </div>
        </div>
    )
}
