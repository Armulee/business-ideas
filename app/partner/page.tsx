import type { Metadata } from "next"
import { createBaseMetadata, getDefaultOGImage } from "@/lib/seo/utils"
import PartnerHero from "@/components/partner/partner-hero"
import ScrollAnimator from "@/components/home/scroll-animator"
import {
    TrendingUp,
    Check,
    Zap,
    ArrowRight,
    Megaphone,
    Users,
    Award,
    Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = createBaseMetadata({
    title: "BlueBizHub - Partner Program - Join Our Business Promotion Network",
    description:
        "Join BlueBizHub's partner program and help businesses grow while earning rewards. Promote businesses, expand your network, and be part of our community-driven business growth platform.",
    path: "/partner",
    image: getDefaultOGImage(),
    keywords: [
        "partner program",
        "business promotion",
        "affiliate marketing",
        "business network",
        "community partners",
        "business growth",
        "promotion platform",
        "partner rewards",
        "business marketing",
        "network expansion",
    ],
})

export default async function PartnerPage() {
    return (
        <div className='pb-28 overflow-x-hidden'>
            {/* Hero Section */}
            <section className='relative pt-28 pb-16 overflow-hidden'>
                <PartnerHero />
            </section>

            {/* Introduction Section - Server Component */}
            <section className='relative py-16'>
                <div className='max-w-6xl mx-auto px-4'>
                    <ScrollAnimator className='text-center mb-12 scroll-animate-scale'>
                        <h2 className='text-3xl sm:text-4xl font-bold text-white mb-6'>
                            Welcome to Our{" "}
                            <span className='text-white'>Partner</span> Program
                        </h2>
                        <p className='text-lg text-white/80 max-w-4xl mx-auto mb-8 leading-relaxed'>
                            Join our exclusive partner network and help
                            businesses grow while building your own success. As
                            a partner, you&apos;ll promote businesses, expand your
                            network, and earn rewards while contributing to our
                            community-driven business growth platform.
                        </p>
                    </ScrollAnimator>

                    <div className='grid md:grid-cols-3 gap-8 mb-12'>
                        <ScrollAnimator className='text-center scroll-stagger scroll-stagger-delay-1'>
                            <div className='inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4'>
                                <Megaphone className='h-8 w-8 text-white' />
                            </div>
                            <h3 className='text-xl font-semibold text-white mb-2'>
                                Business Promotion
                            </h3>
                            <p className='text-white/70'>
                                Promote businesses to your network and help them
                                reach new audiences
                            </p>
                        </ScrollAnimator>

                        <ScrollAnimator className='text-center scroll-stagger scroll-stagger-delay-2'>
                            <div className='inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4'>
                                <Users className='h-8 w-8 text-white' />
                            </div>
                            <h3 className='text-xl font-semibold text-white mb-2'>
                                Network Building
                            </h3>
                            <p className='text-white/70'>
                                Expand your professional network by connecting
                                with business owners
                            </p>
                        </ScrollAnimator>

                        <ScrollAnimator className='text-center scroll-stagger scroll-stagger-delay-3'>
                            <div className='inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4'>
                                <TrendingUp className='h-8 w-8 text-white' />
                            </div>
                            <h3 className='text-xl font-semibold text-white mb-2'>
                                Earn Rewards
                            </h3>
                            <p className='text-white/70'>
                                Get rewarded for successful business promotions
                                and network growth
                            </p>
                        </ScrollAnimator>
                    </div>

                    <ScrollAnimator className='text-center scroll-animate-scale'>
                        <Link href='/partner/registration'>
                            <Button size='lg' className='button !px-8 text-lg'>
                                Join Partner Program
                                <ArrowRight className='ml-2 h-5 w-5' />
                            </Button>
                        </Link>
                    </ScrollAnimator>
                </div>
            </section>

            {/* Features Section - Server Component */}
            <section className='relative py-16'>
                <div className='absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent z-0'></div>
                <div className='relative z-10 max-w-6xl mx-auto px-4'>
                    <ScrollAnimator className='text-center mb-16 scroll-animate-scale'>
                        <h2 className='text-3xl sm:text-4xl font-bold text-white mb-4'>
                            Partner Program Benefits
                        </h2>
                        <p className='text-lg text-white/80 max-w-3xl mx-auto'>
                            Our partner program offers comprehensive benefits
                            designed to help you succeed as a business promoter.
                            From earning rewards to building your network, we
                            provide everything you need to thrive.
                        </p>
                    </ScrollAnimator>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                        <ScrollAnimator className='bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 hover:shadow-lg group scroll-stagger scroll-stagger-delay-1'>
                            <div className='flex flex-col items-center text-center'>
                                <div className='p-4 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-300/20 border border-white/20 mb-4 group-hover:scale-110 transition-transform duration-300'>
                                    <Megaphone
                                        size={32}
                                        className='text-white'
                                    />
                                </div>
                                <h3 className='text-xl font-semibold text-white mb-2'>
                                    Business Promotion
                                </h3>
                                <p className='text-white/70 text-sm'>
                                    Promote businesses to your network and help
                                    them reach new customers while building your
                                    influence.
                                </p>
                            </div>
                        </ScrollAnimator>

                        <ScrollAnimator className='bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 hover:shadow-lg group scroll-stagger scroll-stagger-delay-2'>
                            <div className='flex flex-col items-center text-center'>
                                <div className='p-4 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-300/20 border border-white/20 mb-4 group-hover:scale-110 transition-transform duration-300'>
                                    <Users size={32} className='text-white' />
                                </div>
                                <h3 className='text-xl font-semibold text-white mb-2'>
                                    Network Building
                                </h3>
                                <p className='text-white/70 text-sm'>
                                    Expand your professional network by
                                    connecting with business owners and other
                                    partners.
                                </p>
                            </div>
                        </ScrollAnimator>

                        <ScrollAnimator className='bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 hover:shadow-lg group scroll-stagger scroll-stagger-delay-3'>
                            <div className='flex flex-col items-center text-center'>
                                <div className='p-4 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-300/20 border border-white/20 mb-4 group-hover:scale-110 transition-transform duration-300'>
                                    <TrendingUp
                                        size={32}
                                        className='text-white'
                                    />
                                </div>
                                <h3 className='text-xl font-semibold text-white mb-2'>
                                    Performance Tracking
                                </h3>
                                <p className='text-white/70 text-sm'>
                                    Monitor your promotion performance and see
                                    real results as businesses grow through your
                                    efforts.
                                </p>
                            </div>
                        </ScrollAnimator>

                        <ScrollAnimator className='bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 hover:shadow-lg group scroll-stagger scroll-stagger-delay-4'>
                            <div className='flex flex-col items-center text-center'>
                                <div className='p-4 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-300/20 border border-white/20 mb-4 group-hover:scale-110 transition-transform duration-300'>
                                    <Award size={32} className='text-white' />
                                </div>
                                <h3 className='text-xl font-semibold text-white mb-2'>
                                    Rewards & Recognition
                                </h3>
                                <p className='text-white/70 text-sm'>
                                    Earn rewards and recognition for successful
                                    business promotions and network growth.
                                </p>
                            </div>
                        </ScrollAnimator>
                    </div>
                </div>
            </section>

            {/* Why Join Us Section - Server Component */}
            <section className='py-16 relative'>
                <div className='max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12'>
                    <ScrollAnimator className='glassmorphism p-8 scroll-animate-left'>
                        <h3 className='text-2xl font-bold text-white mb-6 md:mb-10 flex items-center'>
                            <span className='inline-block w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3 text-white'>
                                ?
                            </span>
                            Why Become a Partner?
                        </h3>
                        <div className='md:space-y-10 space-y-6'>
                            <ScrollAnimator className='flex items-start mb-4 scroll-stagger scroll-stagger-delay-1'>
                                <div className='flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mt-0.5 mr-3'>
                                    <Check className='w-3 h-3' />
                                </div>
                                <div>
                                    <h4 className='text-lg font-semibold text-white'>
                                        Earn Commissions
                                    </h4>
                                    <p className='text-white/70 mt-1'>
                                        Get rewarded for every successful
                                        business promotion and customer referral
                                        you generate.
                                    </p>
                                </div>
                            </ScrollAnimator>
                            <ScrollAnimator className='flex items-start mb-4 scroll-stagger scroll-stagger-delay-2'>
                                <div className='flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mt-0.5 mr-3'>
                                    <Check className='w-3 h-3' />
                                </div>
                                <div>
                                    <h4 className='text-lg font-semibold text-white'>
                                        Build Your Brand
                                    </h4>
                                    <p className='text-white/70 mt-1'>
                                        Establish yourself as a trusted business
                                        promoter and industry expert in your
                                        network.
                                    </p>
                                </div>
                            </ScrollAnimator>
                            <ScrollAnimator className='flex items-start mb-4 scroll-stagger scroll-stagger-delay-3'>
                                <div className='flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mt-0.5 mr-3'>
                                    <Check className='w-3 h-3' />
                                </div>
                                <div>
                                    <h4 className='text-lg font-semibold text-white'>
                                        Access Resources
                                    </h4>
                                    <p className='text-white/70 mt-1'>
                                        Get exclusive access to marketing
                                        materials, training, and promotional
                                        tools.
                                    </p>
                                </div>
                            </ScrollAnimator>
                        </div>
                    </ScrollAnimator>

                    <ScrollAnimator className='glassmorphism p-8 scroll-animate-right'>
                        <h3 className='text-2xl font-bold text-white mb-6 flex items-center'>
                            <span className='inline-block w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3 text-white'>
                                <Zap className='w-5 h-5' />
                            </span>
                            How It Works
                        </h3>
                        <div className='space-y-6'>
                            <ScrollAnimator className='relative pl-12 pb-6 scroll-stagger scroll-stagger-delay-1'>
                                <div className='absolute left-[7px] top-0 w-5 h-5 rounded-full bg-blue-500' />
                                <div className='absolute left-[16px] top-0 w-[2px] h-full bg-blue-500' />
                                <span className='text-sm font-medium text-white'>
                                    Step 1
                                </span>
                                <h4 className='text-lg font-semibold text-white mt-1'>
                                    Join Our Program
                                </h4>
                                <p className='text-white/70 mt-1'>
                                    Sign up as a partner and complete your
                                    profile to get started with our promotion
                                    platform.
                                </p>
                            </ScrollAnimator>
                            <ScrollAnimator className='relative pl-12 pb-6 scroll-stagger scroll-stagger-delay-2'>
                                <div className='absolute left-[7px] top-0 w-5 h-5 rounded-full bg-blue-500' />
                                <div className='absolute left-[16px] top-0 w-[2px] h-full bg-blue-500' />
                                <span className='text-sm font-medium text-white'>
                                    Step 2
                                </span>
                                <h4 className='text-lg font-semibold text-white mt-1'>
                                    Choose Businesses
                                </h4>
                                <p className='text-white/70 mt-1'>
                                    Browse and select businesses you want to
                                    promote based on your network and expertise.
                                </p>
                            </ScrollAnimator>
                            <ScrollAnimator className='relative pl-12 pb-6 scroll-stagger scroll-stagger-delay-3'>
                                <div className='absolute left-[7px] top-0 w-5 h-5 rounded-full bg-blue-500' />
                                <div className='absolute left-[16px] top-0 w-[2px] h-full bg-blue-500' />
                                <span className='text-sm font-medium text-white'>
                                    Step 3
                                </span>
                                <h4 className='text-lg font-semibold text-white mt-1'>
                                    Promote & Earn
                                </h4>
                                <p className='text-white/70 mt-1'>
                                    Use our tools to promote businesses to your
                                    network and earn rewards for successful
                                    referrals.
                                </p>
                            </ScrollAnimator>
                        </div>
                    </ScrollAnimator>
                </div>
            </section>

            {/* CTA Section - Server Component */}
            <section className='py-16 relative'>
                <div className='absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent z-0'></div>
                <ScrollAnimator className='relative z-10 max-w-4xl mx-auto px-4 text-center scroll-animate-scale'>
                    <h2 className='text-3xl sm:text-4xl font-bold text-white mb-6'>
                        Ready to Join Our Partner Network?
                    </h2>
                    <p className='text-lg text-white/80 mb-8 max-w-2xl mx-auto'>
                        Start your journey as a business promotion partner
                        today. Join thousands of successful partners who are
                        already helping businesses grow while building their own
                        success.
                    </p>
                    <div className='flex flex-col sm:flex-row justify-center items-center gap-4'>
                        <Link href='/partner/registration'>
                            <Button size='lg' className='cta-button text-lg'>
                                Join Partner Program
                                <ArrowRight className='ml-2 h-5 w-5' />
                            </Button>
                        </Link>
                        <Link href='/partner/monetization'>
                            <Button
                                size='lg'
                                variant='outline'
                                className='border-white text-white hover:bg-white hover:text-white text-lg'
                            >
                                Learn About Rewards
                                <Star className='ml-2 h-5 w-5' />
                            </Button>
                        </Link>
                    </div>
                </ScrollAnimator>
            </section>
        </div>
    )
}
