import { CheckCircleIcon, ChevronLeft } from "lucide-react"

export default function MagicLinkMessage({
    setSentMagicLink,
    resendCooldown,
    sendingMagicLink,
    handleMagicLinkClick,
}: {
    setSentMagicLink: React.Dispatch<React.SetStateAction<boolean>>
    resendCooldown: number
    sendingMagicLink: boolean
    handleMagicLinkClick: () => void
}) {
    return (
        <>
            <div
                onClick={() => setSentMagicLink(false)}
                className='w-fit flex items-center hover:-translate-x-1 duration-300 mb-5 cursor-pointer group'
            >
                <ChevronLeft className='w-5 h-5' />
                <span className='text-sm text-white group-hover:underline underline-offset-2'>
                    Go back
                </span>
            </div>
            <div className='flex items-center bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md mb-6'>
                <CheckCircleIcon className='w-5 h-5 mr-2 animate-pulse' />
                <p className='font-medium'>
                    Magic link sent! Check your email.
                </p>
            </div>
            <p className='text-left text-sm'>
                Not receive any email?{" "}
                <span
                    className={
                        resendCooldown > 0 || sendingMagicLink
                            ? "pointer-events-none text-gray-400 cursor-not-allowed"
                            : "text-blue-400 hover:underline hover:underline-offset-2 cursor-pointer "
                    }
                    onClick={() => {
                        if (resendCooldown === 0 && !sendingMagicLink) {
                            handleMagicLinkClick()
                        }
                    }}
                >
                    {resendCooldown > 0
                        ? `Resend in ${resendCooldown}s`
                        : sendingMagicLink
                          ? "Resending..."
                          : "Resend"}
                </span>
            </p>
        </>
    )
}
