"use client"

import { ArrowUp, Compass, Sparkles } from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"
import { useAlert } from "../provider/alert"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTypewriter } from "react-simple-typewriter"
import ScrollAnimator from "./scroll-animator"
import { useState } from "react"
import AuthDialog from "../auth/auth-dialog"

export default function Hero() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { data: session } = useSession()
    const alert = useAlert()
    const [authDialogOpen, setAuthDialogOpen] = useState(false)

    const handleJoinlist = () => {
        if (!session?.user) {
            setAuthDialogOpen(true)
        } else {
            // User is authenticated, add joinlist param to URL
            const currentUrl = new URL(window.location.href)
            currentUrl.searchParams.set('joinlist', 'business')
            router.push(currentUrl.pathname + currentUrl.search)
        }
    }

    // Updated headlines for business owners focus
    const [text] = useTypewriter({
        words: [
            "Grow Your Business with Community Marketing",
            "Amplify Your Business Reach & Awareness",
            "Let Our Partners Promote Your Business",
            "Submit Your Business, Get More Customers",
            "Business Growth Powered by Community",
            "Expand Your Business Network Today",
        ],
        loop: true,
        typeSpeed: 50,
        deleteSpeed: 50,
        delaySpeed: 4000, // pause between each word
    })

    return (
        <>
            <ScrollAnimator className='relative z-10 flex flex-col justify-center items-center scroll-animate-scale'>
                <div className='w-full max-w-4xl mx-auto px-4 text-center'>
                    <ScrollAnimator className='inline-block mb-4 expand-from-left'>
                        <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/10 backdrop-blur-sm text-white relative'>
                            {/* Main sparkle with enhanced animation */}
                            <Sparkles className='h-4 w-4 mr-2 sparkle-animate' />

                            {/* Additional floating sparkles for extra effect */}
                            <div className='absolute -top-1 -right-1 w-2 h-2'>
                                <div
                                    className='w-full h-full bg-yellow-300 rounded-full sparkle-pulse'
                                    style={{ animationDelay: "0.5s" }}
                                ></div>
                            </div>
                            <div className='absolute -bottom-1 -left-1 w-1.5 h-1.5'>
                                <div
                                    className='w-full h-full bg-blue-300 rounded-full sparkle-pulse'
                                    style={{ animationDelay: "1s" }}
                                ></div>
                            </div>

                            <span>Submit, Amplify, Grow</span>
                        </span>
                    </ScrollAnimator>

                    <h2 className='text-4xl sm:text-5xl md:text-6xl font-extrabold text-white min-h-[180px] flex justify-center items-center mb-6 leading-tight'>
                        {text}
                    </h2>

                    <ScrollAnimator className='scroll-animate' threshold={0.3}>
                        <p className='text-sm sm:text-md text-white/80 max-w-2xl mx-auto mb-8'>
                            Submit your business information and let our community
                            partners promote you to gain more awareness, reach new
                            customers, and grow your business.
                        </p>
                    </ScrollAnimator>

                    <ScrollAnimator className='scroll-animate' threshold={0.4}>
                        <div className='flex sm:flex-row flex-col justify-center items-center gap-2'>
                            <Link href='/partner'>
                                <Button size='lg' className='button !px-8'>
                                    Become Our Partner
                                    <Compass className='h-5 w-5' />
                                </Button>
                            </Link>
                            <Button
                                size='lg'
                                onClick={handleJoinlist}
                                className='button !px-8'
                            >
                                Joinlist
                                <ArrowUp className='h-5 w-5' />
                            </Button>
                        </div>
                    </ScrollAnimator>
                </div>
            </ScrollAnimator>

            <AuthDialog
                open={authDialogOpen}
                onOpenChange={setAuthDialogOpen}
                title="Join Our Business List"
                description="Sign in to join our exclusive business list and get promoted by our community partners"
            />
        </>
    )
}
