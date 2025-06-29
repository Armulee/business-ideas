// app/privacy-policy/page.tsx

import { FileText } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Privacy Policy & Terms of Service | BlueBizHub",
    description:
        "Our commitment to your privacy and the terms under which we operate at BlueBizHub.",
}

// Structured content arrays for policy sections
const privacySections = [
    {
        title: "Introduction",
        content:
            "BlueBizHub (“we”, “us”, or “our”) is committed to protecting your privacy. This Privacy Policy explains what information we collect, how we use it, and your choices regarding that information.",
    },
    {
        title: "Information We Collect",
        content:
            "We collect information you provide directly when registering or posting content, such as your name, email address, profile details, and any ideas or feedback you share. We also collect usage data via cookies and similar technologies.",
    },
    {
        title: "How We Use Your Information",
        content:
            "Your data helps us operate, improve, and personalize the platform. This includes authentication, providing notifications, analyzing engagement metrics, and sending relevant updates.",
    },
    {
        title: "Cookies & Tracking",
        content:
            "We use cookies and tracking technologies to remember preferences, understand site usage, and support advertising efforts. You can manage cookie settings via your browser.",
    },
    {
        title: "Information Sharing",
        content:
            "We do not sell your personal data. We may share aggregated or de-identified data with partners. We may also disclose information to comply with legal obligations.",
    },
    {
        title: "Data Security",
        content:
            "We implement industry-standard measures to protect your data from unauthorized access, alteration, or destruction. However, no method is absolutely secure.",
    },
    {
        title: "Children’s Privacy",
        content:
            "Our service is not intended for children under 13. We do not knowingly collect data from minors. If we become aware of such data, we will delete it promptly.",
    },
    {
        title: "Updates to This Policy",
        content:
            "We may update this policy periodically. We will post changes here with a revised effective date. Continuing to use the service constitutes acceptance of the updated policy.",
    },
    {
        title: "Contact Us",
        content:
            "If you have questions about this Privacy Policy, please contact us at privacy@bluebizhub.com.",
    },
]

export const termsSections = [
    {
        title: "Acceptance of Terms",
        content:
            "By accessing or using BlueBizHub, you agree to these Terms of Service. If you do not agree, please do not use our platform.",
    },
    {
        title: "User Conduct",
        content:
            "You agree to use the service in compliance with our Community Guidelines. You are responsible for any content you post.",
    },
    {
        title: "Intellectual Property",
        content:
            "All content on BlueBizHub is owned by us or our licensors. You may not reproduce, distribute, or create derivative works without permission.",
    },
    {
        title: "Disclaimers",
        content:
            "The service is provided “as is” without warranties of any kind. We do not guarantee accuracy, reliability, or suitability for any purpose.",
    },
    {
        title: "Limitation of Liability",
        content:
            "To the maximum extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.",
    },
    {
        title: "Termination",
        content:
            "We may suspend or terminate your access at any time for violations of these Terms or for any other reason.",
    },
    {
        title: "Changes to Terms",
        content:
            "We may revise these Terms at any time. We will notify you of significant changes. Continued use constitutes acceptance of the new Terms.",
    },
    {
        title: "Governing Law",
        content:
            "These Terms are governed by the laws of [Your Jurisdiction], without regard to conflict of law principles.",
    },
]

export default function PolicyPage() {
    return (
        <>
            <Card className='max-w-3xl mx-auto mt-20 bg-transparent border-0 shadow-none'>
                <CardHeader>
                    <CardTitle className='text-blue-200 flex items-center space-x-2 text-2xl font-extrabold'>
                        <FileText className='w-6 h-6' />
                        <span>Privacy Policy</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className='space-y-6 text-gray-700'>
                    {privacySections.map((section) => (
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

            <Card className='max-w-3xl mx-auto mb-28 bg-transparent border-0 shadow-none'>
                <CardHeader>
                    <CardTitle className='text-blue-200 flex items-center space-x-2 text-2xl font-extrabold'>
                        <FileText className='w-6 h-6 text-blue-500' />
                        <span>Terms of Service</span>
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
        </>
    )
}
