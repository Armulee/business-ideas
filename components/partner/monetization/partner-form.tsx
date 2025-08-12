"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, ArrowRight } from "lucide-react"
import { toast } from "sonner"

export default function PartnerForm() {
    const [partnerForm, setPartnerForm] = useState({
        name: "",
        email: "",
        website: "",
        monthlyPageviews: "",
        niche: "",
    })

    const handleApplyPartner = () => {
        if (partnerForm.name && partnerForm.email && partnerForm.website) {
            toast("Application Sent! 🎉", {
                description:
                    "We'll review your application within 2-3 business days.",
            })
            setPartnerForm({
                name: "",
                email: "",
                website: "",
                monthlyPageviews: "",
                niche: "",
            })
        }
    }

    return (
        <section className='relative px-4 mt-16 sm:px-6 lg:px-8'>
            <div className='mx-auto max-w-2xl'>
                <div className='text-center mb-4'>
                    <h2 className='mb-4 text-4xl font-bold text-white'>
                        Ready to Become a Partner?
                    </h2>
                    <p className='text-xl text-blue-100'>
                        Apply now and start earning within 24 hours
                    </p>
                </div>

                <Card className='glassmorphism bg-transparent'>
                    <CardHeader>
                        <CardTitle className='text-2xl text-white text-center'>
                            Partner Application
                        </CardTitle>
                        <CardDescription className='text-blue-100 text-center'>
                            Fill out the form below and we&apos;ll get back
                            to you within 2-3 business days
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                        <div className='grid gap-4 md:grid-cols-2'>
                            <div>
                                <Label
                                    htmlFor='name'
                                    className='text-white mb-2 block'
                                >
                                    Full Name *
                                </Label>
                                <Input
                                    id='name'
                                    placeholder='John Doe'
                                    value={partnerForm.name}
                                    onChange={(e) =>
                                        setPartnerForm({
                                            ...partnerForm,
                                            name: e.target.value,
                                        })
                                    }
                                    className='bg-white/10 border-white/20 text-white placeholder:text-blue-200'
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor='email'
                                    className='text-white mb-2 block'
                                >
                                    Email Address *
                                </Label>
                                <Input
                                    id='email'
                                    type='email'
                                    placeholder='john@example.com'
                                    value={partnerForm.email}
                                    onChange={(e) =>
                                        setPartnerForm({
                                            ...partnerForm,
                                            email: e.target.value,
                                        })
                                    }
                                    className='bg-white/10 border-white/20 text-white placeholder:text-blue-200'
                                />
                            </div>
                        </div>

                        <div>
                            <Label
                                htmlFor='website'
                                className='text-white mb-2 block'
                            >
                                Website URL *
                            </Label>
                            <Input
                                id='website'
                                placeholder='https://yourwebsite.com'
                                value={partnerForm.website}
                                onChange={(e) =>
                                    setPartnerForm({
                                        ...partnerForm,
                                        website: e.target.value,
                                    })
                                }
                                className='bg-white/10 border-white/20 text-white placeholder:text-blue-200'
                            />
                        </div>

                        <div className='grid gap-4 md:grid-cols-2'>
                            <div>
                                <Label
                                    htmlFor='monthlyPageviews'
                                    className='text-white mb-2 block'
                                >
                                    Monthly Pageviews
                                </Label>
                                <Input
                                    id='monthlyPageviews'
                                    placeholder='50,000'
                                    value={partnerForm.monthlyPageviews}
                                    onChange={(e) =>
                                        setPartnerForm({
                                            ...partnerForm,
                                            monthlyPageviews:
                                                e.target.value,
                                        })
                                    }
                                    className='bg-white/10 border-white/20 text-white placeholder:text-blue-200'
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor='niche'
                                    className='text-white mb-2 block'
                                >
                                    Website Niche
                                </Label>
                                <Input
                                    id='niche'
                                    placeholder='Technology, Business, etc.'
                                    value={partnerForm.niche}
                                    onChange={(e) =>
                                        setPartnerForm({
                                            ...partnerForm,
                                            niche: e.target.value,
                                        })
                                    }
                                    className='bg-white/10 border-white/20 text-white placeholder:text-blue-200'
                                />
                            </div>
                        </div>

                        <div>
                            <Button
                                onClick={handleApplyPartner}
                                className='w-full button !bg-gradient-to-r !from-blue-500 !to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300'
                            >
                                <Sparkles className='mr-2 h-5 w-5' />
                                Submit Application
                                <ArrowRight className='ml-2 h-5 w-5' />
                            </Button>

                            <p className='mt-2 text-xs text-blue-200 text-left'>
                                * Required fields. We respect your privacy
                                and will never share your information.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}