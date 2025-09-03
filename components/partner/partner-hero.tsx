"use client"

import { ArrowUp, Compass, Users } from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"
import { useTypewriter } from "react-simple-typewriter"
import ScrollAnimator from "../home/scroll-animator"

export default function PartnerHero() {
    // Partner-focused headlines
    const [text] = useTypewriter({
        words: [
            "Join Our Business Promotion Network",
            "Help Businesses Grow & Earn Rewards",
            "Be Part of Our Community Success",
            "Promote Businesses, Build Your Network",
            "Partner with Us, Grow Together",
            "Expand Your Reach as a Partner",
        ],
        loop: true,
        typeSpeed: 50,
        deleteSpeed: 50,
        delaySpeed: 4000,
    })

    return (
        // <ScrollAnimator className='relative z-10 flex flex-col justify-center items-center scroll-animate-scale'>
        <div className='w-full max-w-4xl mx-auto px-4 text-center'>
            <ScrollAnimator className='inline-block mb-4 expand-from-left'>
                <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/10 text-white border border-white/20 relative'>
                    {/* Main icon with enhanced animation */}
                    <Users className='h-4 w-4 mr-2 sparkle-animate' />

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

                    <span>Partner Program</span>
                </span>
            </ScrollAnimator>

            <h2 className='text-4xl sm:text-5xl md:text-6xl font-extrabold text-white min-h-[180px] flex justify-center items-center mb-6 leading-tight'>
                {text}
            </h2>

            <ScrollAnimator className='scroll-animate' threshold={0.3}>
                <p className='text-sm text-white/70 max-w-3xl mx-auto mb-8'>
                    Join our exclusive partner program and help businesses grow
                    while building your own network. Promote businesses, earn
                    rewards, and be part of our community-driven success story.
                </p>
            </ScrollAnimator>

            <ScrollAnimator className='scroll-animate' threshold={0.4}>
                <div className='flex sm:flex-row flex-col justify-center items-center gap-4'>
                    <Link href='/partner/registration'>
                        <Button size='lg' className='button !px-8'>
                            Join Partner Program
                            <ArrowUp className='h-5 w-5 ml-2' />
                        </Button>
                    </Link>
                    <Link href='/partner/monetization'>
                        <Button
                            size='lg'
                            variant='outline'
                            className='button !px-8 border-white text-white hover:bg-white hover:text-blue-900'
                        >
                            Learn About Rewards
                            <Compass className='h-5 w-5 ml-2' />
                        </Button>
                    </Link>
                </div>
            </ScrollAnimator>
        </div>
        // </ScrollAnimator>
    )
}
