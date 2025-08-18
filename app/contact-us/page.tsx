import { Metadata } from "next"
import { Mail, MessageSquare, MapPin } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import ContactForm from "@/components/contact-us/form"

export const metadata: Metadata = {
    title: "Contact Us - BlueBizHub",
    description:
        "Get in touch with BlueBizHub. We're here to help with questions, feedback, and partnership opportunities.",
}

const infos = [
    { icon: Mail, topic: "Email Us", content: "admin@bluebizhub.com" },
    {
        icon: MessageSquare,
        topic: "Response Time",
        content: "1-2 business day",
    },
    { icon: MapPin, topic: "Based In", content: "Global Remote Team" },
]

export default function ContactUsPage() {
    return (
        <div className='min-h-screen pt-28 pb-28 px-4'>
            <div className='max-w-6xl mx-auto'>
                {/* Header */}
                <div className='text-center mb-10'>
                    <h1 className='text-4xl sm:text-5xl font-bold text-white mb-4'>
                        Get in Touch
                    </h1>
                    <p className='text-lg text-white/80 max-w-2xl mx-auto'>
                        Have questions about BlueBizHub? Want to share feedback
                        or explore partnership opportunities? We&apos;d love to
                        hear from you!
                    </p>
                </div>

                <div className='grid gap-4'>
                    {/* Contact Info */}
                    <div className='space-y-8'>
                        <div>
                            <h2 className='text-xl font-semibold text-white mb-4'>
                                Let&apos;s Start a Conversation
                            </h2>
                            <p className='text-sm text-white/70 mb-8'>
                                We&apos;re here to help you make the most of
                                BlueBizHub. Whether you&apos;re looking for
                                support, have suggestions, or want to explore
                                collaboration opportunities, our team is ready
                                to assist.
                            </p>
                        </div>

                        <div className='grid md:grid-cols-3 gap-4 mb-6'>
                            {infos.map((info, index) => (
                                <div
                                    key={`contact-info-${index + 1}`}
                                    className='w-full flex items-center space-x-4 glassmorphism p-4 rounded-xl'
                                >
                                    <info.icon className='h-6 w-6 text-blue-300' />
                                    <div>
                                        <h3 className='font-bold text-white'>
                                            {info.topic}
                                        </h3>
                                        <p className='text-white/70'>
                                            {info.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact Form */}

                    <Card className='max-w-2xl w-full mx-auto glassmorphism bg-transparent border-white/10 mt-6'>
                        <CardHeader>
                            <CardTitle className='text-white text-xl'>
                                Send us a Message
                            </CardTitle>
                            <CardDescription className='text-white/70'>
                                Fill out the form below and we&apos;ll get back
                                to you soon.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ContactForm />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
