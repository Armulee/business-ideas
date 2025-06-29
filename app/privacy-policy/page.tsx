// app/privacy-policy/page.tsx

import { FileText } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Privacy Policy | BlueBizHub",
    description:
        "Our commitment to your privacy under which we operate at BlueBizHub.",
}

// Structured content arrays for policy sections
const privacySections = [
    {
        title: "Introduction",
        content:
            'BlueBizHub ("we," "us," or "our") respects your privacy and is dedicated to safeguarding the confidentiality and security of your personal information. This Privacy Policy details the types of information we collect, the purposes for collecting such information, the methods we utilize to manage and protect your information, and your rights regarding your personal data.',
    },
    {
        title: "Information We Collect",
        content:
            "We collect personal information provided directly by you when registering an account, posting content, or engaging with our community. Such information may include but is not limited to your name, email address, user profile information, and any content, ideas, feedback, or comments you voluntarily share on our platform. Additionally, we automatically collect technical information, including IP addresses, browser type, operating system, and usage data via cookies and similar tracking technologies.",
    },
    {
        title: "Use of Information",
        content:
            "We utilize the collected data to operate, manage, enhance, and personalize your experience on our platform. This includes verifying user identity, providing user support, sending important notifications, analyzing user engagement and interactions, facilitating communication within our community, improving website functionality, and ensuring compliance with applicable laws and regulations.",
    },
    {
        title: "Cookies and Tracking Technologies",
        content:
            "BlueBizHub uses cookies and other tracking technologies to improve functionality, personalize user experience, analyze user activity, and deliver targeted advertising. Users may control cookie preferences or disable cookies entirely through browser settings. However, disabling cookies may affect functionality and limit the user experience.",
    },
    {
        title: "Information Sharing",
        content:
            "We do not sell, lease, or trade your personal information. However, we may share anonymized or aggregated data with third-party partners for analytics, research, and advertising purposes. Additionally, we reserve the right to disclose personal information if required by law, legal process, or regulatory request, or if we believe disclosure is necessary to protect our rights, safety, or the safety of others.",
    },
    {
        title: "Data Security",
        content:
            "We implement industry-standard security measures designed to protect your personal information from unauthorized access, misuse, alteration, loss, or destruction. Nevertheless, please be aware that no method of electronic transmission or storage is completely secure, and we cannot guarantee absolute security.",
    },
    {
        title: "Children’s Privacy",
        content:
            "Our platform is not intended for individuals under the age of thirteen (13). We do not knowingly collect personal data from minors. If we discover that we have unintentionally collected personal information from a minor, we will take immediate steps to delete such information.",
    },
    {
        title: "Changes to This Privacy Policy",
        content:
            "We reserve the right to modify this Privacy Policy at any time. Any revisions will be communicated by updating the effective date listed herein. Continued use of our service following such updates indicates acceptance of the amended Privacy Policy.",
    },
    {
        title: "Contact Information",
        content:
            "For any questions or concerns regarding this Privacy Policy, please contact us at privacy@bluebizhub.com.",
    },
]

const termsSections = [
    {
        title: "Acceptance of Terms",
        content:
            'By accessing or utilizing the BlueBizHub platform ("Service"), you acknowledge and agree to comply with these Terms of Service. If you do not accept these terms, refrain from using our Service.',
    },
    {
        title: "User Conduct",
        content:
            "Users agree to comply with all applicable laws and our established Community Guidelines. You bear full responsibility for all content and communications posted by your account.",
    },
    {
        title: "Intellectual Property Rights",
        content:
            "All materials, content, and intellectual property available on the BlueBizHub platform are owned exclusively by us or our licensors. Users may not copy, distribute, reproduce, or create derivative works from our content without prior express written permission.",
    },
    {
        title: "Disclaimers and Liability Limitations",
        content:
            'The BlueBizHub service is provided "as is" without warranties of any kind, either expressed or implied. We expressly disclaim all warranties regarding accuracy, reliability, completeness, or suitability of the Service for any particular purpose. To the fullest extent permissible under applicable law, we shall not be liable for indirect, incidental, consequential, special, or punitive damages arising from or related to your use of or inability to use our Service.',
    },
    {
        title: "Termination",
        content:
            "We reserve the right, at our sole discretion, to suspend or terminate user access and account privileges without notice for violations of these Terms of Service or any other reason deemed appropriate.",
    },
    {
        title: "Amendaments to Terms",
        content:
            "We reserve the right to amend these Terms of Service at any time, with notice of significant amendments communicated clearly to users. Continued use of our Service after amendments become effective signifies user acceptance of the revised terms.",
    },
    {
        title: "Governing Law",
        content:
            "These Terms of Service are governed and interpreted under the laws of Thailand, irrespective of conflicts of law principles.",
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
                        <FileText className='w-6 h-6' />
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
