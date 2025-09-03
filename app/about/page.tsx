import { Metadata } from "next"

export const metadata: Metadata = {
    title: "About BlueBizHub",
    description:
        "Learn about BlueBizHub, the community-powered platform where businesses connect with marketing partners to amplify reach and generate qualified leads.",
    openGraph: {
        title: "About BlueBizHub - Community-Powered Business Advertising",
        description:
            "Discover how BlueBizHub connects businesses with marketing partners to drive growth through community-driven advertising and lead generation.",
    },
}

export default function AboutPage() {
    return (
        <div className='min-h-screen relative'>
            <div className='container mx-auto px-4 py-16'>
                <h1 className='text-4xl font-bold text-center mb-8'>
                    About BlueBizHub
                </h1>
                <div className='max-w-3xl mx-auto'>
                    <p className='text-lg mb-6'>
                        BlueBizHub is a community-powered platform where
                        businesses connect with marketing partners to amplify
                        their reach and generate qualified leads through
                        collaborative advertising efforts.
                    </p>
                    <p className='text-lg mb-6'>
                        Our platform bridges the gap between business owners
                        seeking growth and marketing partners looking to earn
                        commissions by promoting amazing businesses through
                        their networks and expertise.
                    </p>
                    <p className='text-lg'>
                        Join us in building the future of business growth
                        through community-driven marketing and strategic
                        partnerships.
                    </p>
                </div>
            </div>
        </div>
    )
}
