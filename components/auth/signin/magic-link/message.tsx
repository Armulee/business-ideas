import { Logo } from "@/components/logo"
import { CheckCircleIcon, ChevronLeft } from "lucide-react"

export default function MagicLinkMessage({
    email,
    setSentMagicLink,
    resendCooldown,
    sendingMagicLink,
    handleMagicLinkClick,
}: {
    email: string
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
            <Logo className='mb-4' />
            <div className='w-fit flex items-center glassmorphism bg-green-600 border border-green-200 text-green-800 px-4 py-3 rounded-md mb-4'>
                <CheckCircleIcon className='min-w-5 min-h-5 mr-2 text-green-100' />
                <p className='font-medium text-green-100'>Sent!</p>
            </div>
            <div className='glassmorphism p-4 mb-4'>
                We&apos;ve sent a Magic Link to{" "}
                <div className='font-extrabold glassmorphism px-4 py-2 my-2'>
                    {email}
                </div>
                <p className='text-sm'>
                    If you don&apos;t see it soon, please check your spam or
                    promotions folder.
                </p>
            </div>
            <p className='text-left text-sm'>
                Not receive any email?{" "}
                <span
                    className={
                        resendCooldown > 0 || sendingMagicLink
                            ? "pointer-events-none text-gray-400 cursor-not-allowed animate-pulse"
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
