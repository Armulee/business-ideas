import type { Metadata } from "next"
import { getInitialHomePosts } from "@/lib/server/posts"
import {
    createOrganizationSchema,
    createWebSiteSchema,
} from "@/lib/seo/schemas"
import { createBaseMetadata, getDefaultOGImage } from "@/lib/seo/utils"
import AnimatedBackground from "@/components/home/animated-background"
import Hero from "@/components/home/hero"
import About from "@/components/home/about"
import WhyJoinUs from "@/components/home/why-join-us"
import HowItWorks from "@/components/home/how-it-works"
import CTA from "@/components/home/cta"
import PostsSection from "@/components/home/posts-section"

export const metadata: Metadata = createBaseMetadata({
    title: "BlueBizHub - Business Advertising & Lead Generation Platform",
    description:
        "Connect your business with marketing partners who amplify your reach and earn commissions for generating leads. Join our community-driven advertising platform.",
    path: "/",
    image: getDefaultOGImage(),
    keywords: [
        "business advertising",
        "lead generation",
        "marketing partners",
        "commission marketing",
        "business promotion",
        "affiliate marketing",
        "business networking",
        "marketing platform",
    ],
})

export default async function Homepage() {
    // Server-side data fetching
    const { topVotedPosts, latestPosts } = await getInitialHomePosts()

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

                {/* Posts Section */}
                <PostsSection 
                    topVotedPosts={topVotedPosts} 
                    latestPosts={latestPosts} 
                />

                {/* Features Section - Static server components */}
                <section className='relative py-16'>
                    <About />
                </section>

                {/* Why Join Us Section - Static server components */}
                <section className='py-16 relative'>
                    <div className='max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12'>
                        <WhyJoinUs />
                        <HowItWorks />
                    </div>
                </section>

                {/* CTA Section - Static server component */}
                <section className='py-16 relative'>
                    <CTA />
                </section>
            </div>
        </>
    )
}
