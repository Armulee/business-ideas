import { Metadata } from "next"

export const metadata: Metadata = {
    title: "About BlueBizHub",
    description:
        "Learn about BlueBizHub, the community-powered platform where entrepreneurs share, refine, and transform innovative business ideas into successful ventures.",
    openGraph: {
        title: "About BlueBizHub - Community-Powered Innovation",
        description:
            "Discover how BlueBizHub connects visionary entrepreneurs with a vibrant community to share, discuss, and refine innovative business ideas.",
    },
}

export default function AboutPage() {
    return (
        <div className='min-h-screen relative'>
            <div className='container mx-auto px-4 py-16'>
                <h1 className='text-4xl font-bold text-center mb-8'>About BlueBizHub</h1>
                <div className='max-w-3xl mx-auto'>
                    <p className='text-lg mb-6'>
                        BlueBizHub is a community-powered platform where entrepreneurs share, refine, and transform innovative business ideas into successful ventures.
                    </p>
                    <p className='text-lg mb-6'>
                        Our platform connects visionary entrepreneurs with a vibrant community to discuss, develop, and refine business ideas through collaborative innovation.
                    </p>
                    <p className='text-lg'>
                        Join us in building the future of entrepreneurship through shared knowledge and community-driven innovation.
                    </p>
                </div>
            </div>
        </div>
    )
}