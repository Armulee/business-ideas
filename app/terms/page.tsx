// app/terms-conditions/page.tsx

import { FileText } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Terms & Conditions | BlueBizHub",
    description:
        "Terms and conditions governing use of the BlueBizHub platform.",
}

export const termsSections = [
    {
        title: "Acceptance of Terms",
        content:
            "By accessing or using BlueBizHub, you agree to abide by these Terms & Conditions and all applicable laws and regulations. If you do not agree, please discontinue use of the service.",
    },
    {
        title: "Eligibility",
        content:
            "You must be at least 18 years old and capable of entering into binding contracts to use this platform. By registering, you represent and warrant that you meet these requirements.",
    },
    {
        title: "Account Registration & Security",
        content:
            "Users must create an account with accurate, complete information. You are responsible for maintaining the confidentiality of your credentials and all activities under your account.",
    },
    {
        title: "User Content & License",
        content:
            "You retain ownership of ideas and content you post but grant BlueBizHub a worldwide, royalty-free, non-exclusive license to reproduce, distribute, and display such content as necessary to operate the service.",
    },
    {
        title: "Prohibited Conduct",
        content:
            "You agree not to post unlawful, infringing, harmful, or offensive content. You may not use automation or bots to manipulate engagement or user data.",
    },
    {
        title: "Intellectual Property Rights",
        content:
            "All platform content except user submissions is owned by BlueBizHub or our licensors. You may not copy, modify, or distribute our proprietary materials without prior written consent.",
    },
    {
        title: "Third-Party Links",
        content:
            "BlueBizHub may contain links to external websites. We do not endorse or assume liability for third-party content or practices.",
    },
    {
        title: "Termination",
        content:
            "BlueBizHub reserves the right to suspend or terminate your account for violations of these Terms, without prior notice or liability.",
    },
    {
        title: "Disclaimer of Warranties",
        content:
            'The platform is provided "as is" and "as available" without warranties of any kind, express or implied. We do not guarantee uninterrupted or error-free service.',
    },
    {
        title: "Limitation of Liability",
        content:
            "To the fullest extent permitted by law, BlueBizHub and its affiliates are not liable for indirect, incidental, or consequential damages arising from your use of the platform.",
    },
    {
        title: "Indemnification",
        content:
            "You agree to defend, indemnify, and hold harmless BlueBizHub from claims, liabilities, damages, and expenses arising from your breach of these Terms or your user content.",
    },
    {
        title: "Governing Law",
        content:
            "These Terms are governed by the laws of [Your Jurisdiction], without regard to conflict of law principles.",
    },
    {
        title: "Changes to Terms",
        content:
            "We may update these Terms periodically. We will notify you of significant changes via email or platform notification. Continued use constitutes acceptance of the revised Terms.",
    },
    {
        title: "Contact Us",
        content:
            "For questions about these Terms, please reach out to support@bluebizhub.com.",
    },
]

export default function TermsConditionsPage() {
    return (
        <Card className='max-w-3xl mx-auto mt-20 bg-transparent border-0 shadow-none'>
            <CardHeader>
                <CardTitle className='text-blue-200 flex items-center space-x-2 text-2xl font-extrabold'>
                    <FileText className='w-6 h-6' />
                    <span>Privacy Policy</span>
                </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6 text-gray-700'>
                {termsSections.map((section) => (
                    <div key={section.title}>
                        <h3 className='text-blue-200 font-bold glassmorphism mb-2 px-4 py-2 w-fit'>
                            {section.title}
                        </h3>
                        <p className='mt-1 text-white text-sm'>
                            {section.content}
                        </p>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
