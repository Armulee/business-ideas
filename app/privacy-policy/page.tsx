import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Metadata } from "next"
import Link from "next/link"

interface PolicySection {
    title: string
    content: string
    list?: string[]
}

interface Policy {
    _id?: string
    type?: string
    sections: PolicySection[]
    updatedAt?: Date
}

const schemaInformation = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Privacy Policy",
    description:
        "Privacy policy for BlueBizHub platform - how we collect, use, and protect your information.",
    url: "https://bluebizhub.com/privacy-policy",
    publisher: {
        "@type": "Organization",
        name: "BlueBizHub",
    },
}

export const metadata: Metadata = {
    title: "Privacy Policy | BlueBizHub",
    description:
        "Privacy policy for BlueBizHub platform - how we collect, use, and protect your information.",
}

export default async function PrivacyPolicyPage() {
    const policy = await getPrivacyPolicy()

    // If no policy found, show beautiful error message
    if (!policy || !policy.sections || policy.sections.length === 0) {
        return (
            <>
                {/* SEO structured data */}
                <script
                    type='application/ld+json'
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            ...schemaInformation,
                        }),
                    }}
                />

                <div className='container mx-auto px-4 pt-20 pb-28'>
                    <Card className='max-w-2xl mx-auto glassmorphism bg-transparent border-0'>
                        <CardHeader className='text-center pb-8'>
                            <div className='mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6'>
                                <svg
                                    className='w-12 h-12 text-white'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2'
                                        d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
                                    />
                                </svg>
                            </div>
                            <CardTitle>
                                <h1 className='text-4xl font-bold text-white mb-4'>
                                    Privacy Policy
                                </h1>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className='text-center space-y-6'>
                            <div className='space-y-4'>
                                <h2 className='text-2xl font-semibold text-blue-200'>
                                    Content Not Available
                                </h2>
                                <p className='text-lg text-gray-300 leading-relaxed'>
                                    Our privacy policy content is currently
                                    being updated to serve you better.
                                    We&apos;re working hard to make sure you
                                    have access to the most comprehensive and
                                    transparent privacy information.
                                </p>
                            </div>

                            <div className='bg-blue-900/30 border border-blue-500/50 rounded-lg p-6 space-y-4'>
                                <h3 className='text-xl font-semibold text-white'>
                                    In the meantime
                                </h3>
                                <p className='text-gray-300'>
                                    We are committed to protecting your privacy
                                    and handling your data responsibly. For any
                                    privacy-related questions or concerns,
                                    please don&apos;t hesitate to reach out.
                                </p>

                                <div className='flex flex-col sm:flex-row gap-4 justify-center mt-6'>
                                    <a
                                        href='mailto:admin@bluebizhub.com'
                                        className='inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl'
                                    >
                                        <svg
                                            className='w-5 h-5 mr-2'
                                            fill='none'
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth='2'
                                                d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                                            />
                                        </svg>
                                        Contact Us
                                    </a>

                                    <Link
                                        href='/'
                                        className='inline-flex items-center justify-center px-6 py-3 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-medium rounded-lg transition-all duration-200'
                                    >
                                        <svg
                                            className='w-5 h-5 mr-2'
                                            fill='none'
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth='2'
                                                d='M10 19l-7-7m0 0l7-7m-7 7h18'
                                            />
                                        </svg>
                                        Back to Home
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </>
        )
    }

    // Render policy content if available
    return (
        <>
            {/* SEO structured data */}
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        ...schemaInformation,
                        dateModified:
                            policy.updatedAt || new Date().toISOString(),
                    }),
                }}
            />

            <div className='container mx-auto px-4 py-16'>
                <Card className='max-w-4xl mx-auto bg-transparent border-none'>
                    <CardHeader className='text-center pb-4'>
                        <CardTitle>
                            <h1 className='text-4xl md:text-5xl font-bold text-blue-200 mb-4'>
                                Privacy Policy
                            </h1>
                            {policy.updatedAt && (
                                <p className='text-sm text-white/80'>
                                    Last updated:{" "}
                                    {new Date(
                                        policy.updatedAt
                                    ).toLocaleDateString()}
                                </p>
                            )}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className='space-y-8 mb-20'>
                        {policy.sections.map((section, index) => (
                            <section key={index} className='space-y-4'>
                                <h2 className='text-2xl font-bold text-white border-b border-gray-600 pb-2'>
                                    {section.title}
                                </h2>
                                <div className='text-white/70 leading-relaxed'>
                                    {section.content}
                                </div>

                                {section.list && section.list.length > 0 && (
                                    <ul className='list-disc list-inside space-y-2 text-white/70 ml-4'>
                                        {section.list.map((item, listIndex) => (
                                            <li key={listIndex}>{item}</li>
                                        ))}
                                    </ul>
                                )}
                            </section>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

async function getPrivacyPolicy(): Promise<Policy | null> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "https://bluebizhub.com/api"}/policies/privacy`,
            {
                cache: "no-store", // Always fetch fresh data
            }
        )

        if (!response.ok) {
            throw new Error("Failed to fetch privacy policy")
        }

        const data = await response.json()
        return Array.isArray(data) ? data[0] : data
    } catch (error) {
        console.error("Error fetching privacy policy:", error)
        return null
    }
}
