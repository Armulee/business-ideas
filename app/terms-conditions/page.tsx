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
    name: "Terms & Conditions",
    description:
        "Terms and conditions for BlueBizHub business advertising platform - rules and guidelines for using our services.",
    url: "https://bluebizhub.com/terms-conditions",
    publisher: {
        "@type": "Organization",
        name: "BlueBizHub",
    },
}

export const metadata: Metadata = {
    title: "Terms & Conditions | BlueBizHub",
    description:
        "Terms and conditions for BlueBizHub business advertising platform - rules and guidelines for using our services.",
}

export default async function TermsConditionsPage() {
    const policy = await getTermsConditions()

    // If no policy found, show beautiful error message
    if (!policy || !policy.sections || policy.sections.length === 0) {
        return (
            <>
                {/* SEO structured data */}
                <script
                    type='application/ld+json'
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(schemaInformation),
                    }}
                />

                <div className='container mx-auto px-4 pt-20 pb-28'>
                    <Card className='max-w-2xl mx-auto glassmorphism bg-transparent border-0'>
                        <CardHeader className='text-center pb-8'>
                            <div className='mx-auto w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-6'>
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
                                        d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                                    />
                                </svg>
                            </div>
                            <CardTitle>
                                <h1 className='text-4xl font-bold text-white mb-4'>
                                    Terms &amp; Conditions
                                </h1>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className='text-center space-y-6'>
                            <div className='space-y-4'>
                                <h2 className='text-2xl font-semibold text-green-200'>
                                    Content Not Available
                                </h2>
                                <p className='text-lg text-white/70 leading-relaxed'>
                                    Our terms and conditions are currently being
                                    reviewed and updated. We&apos;re working to
                                    provide you with the most current and
                                    comprehensive terms that govern the use of
                                    our platform.
                                </p>
                            </div>

                            <div className='bg-green-900/30 border border-green-500/50 rounded-lg p-6 space-y-4'>
                                <h3 className='text-xl font-semibold text-white'>
                                    Need Assistance?
                                </h3>
                                <p className='text-white/70'>
                                    We maintain fair and transparent terms for
                                    all our users. If you have questions about
                                    our terms of service or need clarification,
                                    our team is here to help.
                                </p>

                                <div className='flex flex-col sm:flex-row gap-4 justify-center mt-6'>
                                    <a
                                        href='mailto:legal@bluebizhub.com'
                                        className='inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl'
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
                                        Contact Legal Team
                                    </a>

                                    <Link
                                        href='/'
                                        className='inline-flex items-center justify-center px-6 py-3 border border-gray-600 hover:border-gray-500 text-white/70 hover:text-white font-medium rounded-lg transition-all duration-200'
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
                            policy?.updatedAt || new Date().toISOString(),
                    }),
                }}
            />

            <div className='container mx-auto px-4 pt-20 pb-28'>
                <Card className='max-w-4xl mx-auto bg-transparent border-0'>
                    <CardHeader className='text-center pb-8'>
                        <CardTitle>
                            <h1 className='text-4xl md:text-5xl font-bold text-blue-200 mb-4'>
                                Terms &amp; Conditions
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

                    <CardContent className='space-y-8'>
                        {/* <div className='prose prose-invert max-w-none'>
                            <p className='text-lg text-white/70 mb-8 leading-relaxed text-center'>
                                These Terms and Conditions govern your use of
                                BlueBizHub and outline the rules and guidelines
                                for using our platform.
                            </p>
                        </div> */}

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

async function getTermsConditions(): Promise<Policy | null> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "https://bluebizhub.com/api"}/policies/terms`,
            {
                next: { revalidate: 3600 }, // Revalidate every hour
            }
        )

        if (!response.ok) {
            throw new Error("Failed to fetch terms and conditions")
        }

        const data = await response.json()
        return Array.isArray(data) ? data[0] : data
    } catch (error) {
        console.error("Error fetching terms and conditions:", error)
        return null
    }
}
