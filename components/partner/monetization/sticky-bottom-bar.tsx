"use client"

import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { useAlert } from "@/components/provider/alert"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function StickyBottomBar() {
    const router = useRouter()
    const { data: session } = useSession()
    const alert = useAlert()
    const handleClick = () => {
        if (!session) {
            alert.show({
                title: "Please log in before continuing.",
                description: "You need to log in to become a partner.",
                cancel: "Cancel",
                action: "Log in",
                onAction: () => {
                    router.push(
                        `/auth/signin?callbackUrl=${encodeURIComponent("/partner/registration")}`
                    )
                },
            })
            return
        }

        router.push("/partner/registration")
    }
    return (
        <>
            {/* Sticky Bottom Bar (Mobile) */}
            <div className='h-[90px] flex items-center justify-between fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-cyan-600 border-t border-blue-500/30 p-4 z-50 backdrop-blur-lg'>
                <div>
                    <p className='text-sm font-semibold text-white'>
                        Start earning today
                    </p>
                    <p className='text-xs text-blue-100'>
                        60% revenue share • No fees
                    </p>
                </div>

                <Button
                    size='sm'
                    className='bg-white text-blue-600 hover:bg-blue-50 font-semibold'
                    onClick={handleClick}
                >
                    <Sparkles className='mr-1 h-3 w-3' />
                    Apply Now
                </Button>
            </div>

            {/* Add bottom padding for mobile sticky bar */}
            <div className='h-20 sm:hidden' />
        </>
    )
}
