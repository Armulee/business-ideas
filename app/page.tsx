import type { Metadata } from "next"
import {
    createOrganizationSchema,
    createWebSiteSchema,
} from "@/lib/seo/schemas"
import { createBaseMetadata, getDefaultOGImage } from "@/lib/seo/utils"
import AnimatedBackground from "@/components/home/animated-background"
import Hero from "@/components/home/hero"
import ScrollAnimator from "@/components/home/scroll-animator"
import {
    Lightbulb,
    MessageCircle,
    StickyNote,
    TrendingUp,
    Check,
    Zap,
    ArrowRight,
    Megaphone,
    Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = createBaseMetadata({
    title: "BlueBizHub - Business Growth & Amplification Platform",
    description:
        "Grow and amplify your business with our community-driven platform. Submit your business information and let our partners promote you to gain more awareness and reach new customers.",
    path: "/",
    image: getDefaultOGImage(),
    keywords: [
        "business growth",
        "business amplification",
        "business awareness",
        "business promotion",
        "marketing platform",
        "business networking",
        "customer acquisition",
        "business expansion",
        "digital marketing",
        "business visibility",
    ],
})

export default async function Homepage() {
    // Create structured data
    const organizationSchema = createOrganizationSchema()
    const websiteSchema = createWebSiteSchema()

    return (
        <>
            {/* Organization structured data */}
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(organizationSchema),
                }}
            />
            {/* Website structured data */}
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(websiteSchema),
                }}
            />

            <div className='pb-28 overflow-x-hidden'>
                {/* Hero Section with Animated Background */}
                <section className='relative pt-28 pb-16 overflow-hidden'>
                    {/* Static animated background - no client interaction needed */}
                    <AnimatedBackground />
                    {/* Client-side interactive hero */}
                    <Hero />
                </section>
                {/* Introduction Section - Server Component */}
                <section className='relative py-16'>
                    <div className='max-w-6xl mx-auto px-4'>
                        <ScrollAnimator className='text-center mb-12 scroll-animate-scale'>
                            <h2 className='text-3xl sm:text-4xl font-bold text-white mb-6'>
                                Welcome to{" "}
                                <span className='text-blue-400'>Blue</span>
                                BizHub
                            </h2>
                            <p className='text-lg text-white/80 max-w-4xl mx-auto mb-8 leading-relaxed'>
                                BlueBizHub is a revolutionary community-driven
                                platform that transforms how businesses grow and
                                expand their reach. Simply submit your business
                                information and let our network of partners
                                promote you to gain more awareness, reach new
                                customers, and drive sustainable business
                                growth.
                            </p>
                        </ScrollAnimator>

                        <div className='grid md:grid-cols-3 gap-8 mb-12'>
                            <ScrollAnimator className='text-center scroll-stagger scroll-stagger-delay-1'>
                                <div className='inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4'>
                                    <Megaphone className='h-8 w-8 text-blue-400' />
                                </div>
                                <h3 className='text-xl font-semibold text-white mb-2'>
                                    Easy Business Submission
                                </h3>
                                <p className='text-white/70'>
                                    Submit your business details and let our
                                    partners handle the promotion to reach new
                                    audiences
                                </p>
                            </ScrollAnimator>

                            <ScrollAnimator className='text-center scroll-stagger scroll-stagger-delay-2'>
                                <div className='inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4'>
                                    <Users className='h-8 w-8 text-blue-400' />
                                </div>
                                <h3 className='text-xl font-semibold text-white mb-2'>
                                    Community Promotion
                                </h3>
                                <p className='text-white/70'>
                                    Our community partners actively promote your
                                    business to expand your reach and customer
                                    base
                                </p>
                            </ScrollAnimator>

                            <ScrollAnimator className='text-center scroll-stagger scroll-stagger-delay-3'>
                                <div className='inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4'>
                                    <TrendingUp className='h-8 w-8 text-blue-400' />
                                </div>
                                <h3 className='text-xl font-semibold text-white mb-2'>
                                    Business Growth
                                </h3>
                                <p className='text-white/70'>
                                    Track your business expansion and see real
                                    results as awareness and customer reach
                                    increases
                                </p>
                            </ScrollAnimator>
                        </div>

                        <ScrollAnimator className='text-center scroll-animate-scale'>
                            <Link href='/about'>
                                <Button
                                    size='lg'
                                    className='button !px-8 text-lg'
                                >
                                    Learn More About Us
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
                                Services We Provide
                            </h2>
                            <p className='text-lg text-white/80 max-w-3xl mx-auto'>
                                Our platform offers comprehensive services
                                designed to maximize your business growth
                                potential. From easy business submission to
                                community-driven promotion, we provide
                                everything you need to succeed in expanding your
                                business reach and gaining more customer
                                awareness.
                            </p>
                        </ScrollAnimator>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                            <ScrollAnimator className='bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 hover:shadow-lg group scroll-stagger scroll-stagger-delay-1'>
                                <div className='flex flex-col items-center text-center'>
                                    <div className='p-4 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-300/20 border border-white/20 mb-4 group-hover:scale-110 transition-transform duration-300'>
                                        <Lightbulb
                                            size={32}
                                            className='text-white'
                                        />
                                    </div>
                                    <h3 className='text-xl font-semibold text-white mb-2'>
                                        Join A Waitlist
                                    </h3>
                                    <p className='text-white/70 text-sm'>
                                        Share your business information and
                                        marketing goals to get started with our
                                        promotion platform.
                                    </p>
                                </div>
                            </ScrollAnimator>

                            <ScrollAnimator className='bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 hover:shadow-lg group scroll-stagger scroll-stagger-delay-2'>
                                <div className='flex flex-col items-center text-center'>
                                    <div className='p-4 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-300/20 border border-white/20 mb-4 group-hover:scale-110 transition-transform duration-300'>
                                        <MessageCircle
                                            size={32}
                                            className='text-white'
                                        />
                                    </div>
                                    <h3 className='text-xl font-semibold text-white mb-2'>
                                        Community Promotion
                                    </h3>
                                    <p className='text-white/70 text-sm'>
                                        Our community partners actively promote
                                        your business to expand your reach and
                                        customer base.
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
                                        Track Growth
                                    </h3>
                                    <p className='text-white/70 text-sm'>
                                        Monitor your business expansion and see
                                        real results as awareness and customer
                                        reach increases.
                                    </p>
                                </div>
                            </ScrollAnimator>

                            <ScrollAnimator className='bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 hover:shadow-lg group scroll-stagger scroll-stagger-delay-4'>
                                <div className='flex flex-col items-center text-center'>
                                    <div className='p-4 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-300/20 border border-white/20 mb-4 group-hover:scale-110 transition-transform duration-300'>
                                        <StickyNote
                                            size={32}
                                            className='text-white'
                                        />
                                    </div>
                                    <h3 className='text-xl font-semibold text-white mb-2'>
                                        Increased Visibility
                                    </h3>
                                    <p className='text-white/70 text-sm'>
                                        Gain more awareness and reach new
                                        customers through our community-driven
                                        promotion system.
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
                                Why Choose Us?
                            </h3>
                            <div className='md:space-y-10 space-y-6'>
                                <ScrollAnimator className='flex items-start mb-4 scroll-stagger scroll-stagger-delay-1'>
                                    <div className='flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mt-0.5 mr-3'>
                                        <Check className='w-3 h-3' />
                                    </div>
                                    <div>
                                        <h4 className='text-lg font-semibold text-white'>
                                            Easy Business Submission
                                        </h4>
                                        <p className='text-white/70 mt-1'>
                                            Simple and straightforward process
                                            to submit your business information
                                            and get started with promotion.
                                        </p>
                                    </div>
                                </ScrollAnimator>
                                <ScrollAnimator className='flex items-start mb-4 scroll-stagger scroll-stagger-delay-2'>
                                    <div className='flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mt-0.5 mr-3'>
                                        <Check className='w-3 h-3' />
                                    </div>
                                    <div>
                                        <h4 className='text-lg font-semibold text-white'>
                                            Community-Driven Growth
                                        </h4>
                                        <p className='text-white/70 mt-1'>
                                            Leverage our community of partners
                                            who actively promote businesses to
                                            expand reach and awareness.
                                        </p>
                                    </div>
                                </ScrollAnimator>
                                <ScrollAnimator className='flex items-start mb-4 scroll-stagger scroll-stagger-delay-3'>
                                    <div className='flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mt-0.5 mr-3'>
                                        <Check className='w-3 h-3' />
                                    </div>
                                    <div>
                                        <h4 className='text-lg font-semibold text-white'>
                                            Track Your Progress
                                        </h4>
                                        <p className='text-white/70 mt-1'>
                                            Monitor your business growth and see
                                            real results as awareness increases
                                            and customer reach expands.
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
                                    <span className='text-sm font-medium text-blue-300'>
                                        Step 1
                                    </span>
                                    <h4 className='text-lg font-semibold text-white mt-1'>
                                        Join A Waitlist
                                    </h4>
                                    <p className='text-white/70 mt-1'>
                                        Business owners submit their business
                                        information, services, and target
                                        audience for promotion.
                                    </p>
                                </ScrollAnimator>
                                <ScrollAnimator className='relative pl-12 pb-6 scroll-stagger scroll-stagger-delay-2'>
                                    <div className='absolute left-[7px] top-0 w-5 h-5 rounded-full bg-blue-500' />
                                    <div className='absolute left-[16px] top-0 w-[2px] h-full bg-blue-500' />
                                    <span className='text-sm font-medium text-blue-300'>
                                        Step 2
                                    </span>
                                    <h4 className='text-lg font-semibold text-white mt-1'>
                                        Partners Promote
                                    </h4>
                                    <p className='text-white/70 mt-1'>
                                        Our community partners actively promote
                                        your business to expand your reach and
                                        gain more awareness.
                                    </p>
                                </ScrollAnimator>
                                <ScrollAnimator className='relative pl-12 pb-6 scroll-stagger scroll-stagger-delay-3'>
                                    <div className='absolute left-[7px] top-0 w-5 h-5 rounded-full bg-blue-500' />
                                    <div className='absolute left-[16px] top-0 w-[2px] h-full bg-blue-500' />
                                    <span className='text-sm font-medium text-blue-300'>
                                        Step 3
                                    </span>
                                    <h4 className='text-lg font-semibold text-white mt-1'>
                                        Grow & Expand
                                    </h4>
                                    <p className='text-white/70 mt-1'>
                                        Watch your business grow as awareness
                                        increases and you reach new customers
                                        through our platform.
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
                            Ready to Grow and Amplify Your Business?
                        </h2>
                        <p className='text-lg text-white/80 mb-8 max-w-2xl mx-auto'>
                            Join our community-driven platform and let our
                            partners promote your business to gain more
                            awareness, reach new customers, and expand your
                            business reach today.
                        </p>
                        <Link href='/post'>
                            <Button size='lg' className='cta-button text-lg'>
                                Get Started Now
                                <ArrowRight className='ml-2 h-5 w-5' />
                            </Button>
                        </Link>
                    </ScrollAnimator>
                </section>
            </div>
        </>
    )
}
