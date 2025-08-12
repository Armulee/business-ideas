"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BarChart3, Star } from "lucide-react"

export default function RevenueCalculator() {
    const [partnerPageviews, setPartnerPageviews] = useState("")

    const calculatePartnerEarnings = (pageviews: number) => {
        const fillRate = 0.25
        const revenuePerFill = 0.8
        const revenueShare = 0.6
        const monthlyEarnings = Math.round(
            pageviews * fillRate * revenuePerFill * revenueShare
        )
        return monthlyEarnings
    }

    return (
        <section className='relative px-4 mt-16 sm:px-6 lg:px-8'>
            <div className='mx-auto max-w-4xl'>
                <div className='text-center mb-4'>
                    <h2 className='mb-4 text-3xl font-bold text-white'>
                        Calculate Your Potential Earnings
                    </h2>
                    <p className='text-blue-100'>
                        See how much you could earn with our partner program
                    </p>
                </div>

                <div className='grid gap-4 lg:grid-cols-2'>
                    <Card className='glassmorphism bg-transparent text-white'>
                        <CardHeader>
                            <CardTitle className='text-2xl flex items-center gap-3'>
                                <div className='rounded-lg glassmorphism bg-blue-500/50 p-2'>
                                    <BarChart3 className='h-6 w-6 text-white' />
                                </div>
                                Revenue Calculator
                            </CardTitle>
                            <CardDescription className='text-blue-100'>
                                Enter your monthly pageviews to estimate
                                earnings
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            <div>
                                <Label
                                    htmlFor='pageviews'
                                    className='text-white mb-2 block'
                                >
                                    Monthly Pageviews
                                </Label>
                                <Input
                                    id='pageviews'
                                    type='number'
                                    placeholder='e.g., 50,000'
                                    value={partnerPageviews}
                                    onChange={(e) =>
                                        setPartnerPageviews(e.target.value)
                                    }
                                    className='bg-white/10 border-white/20 text-white placeholder:text-blue-200'
                                />
                            </div>
                            {partnerPageviews && (
                                <div className='rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-6 border border-green-500/30'>
                                    <h4 className='font-semibold text-green-300 mb-3 text-lg'>
                                        Estimated Monthly Earnings:
                                    </h4>
                                    <div className='text-4xl font-bold text-green-400 mb-2'>
                                        ฿
                                        {calculatePartnerEarnings(
                                            Number(partnerPageviews)
                                        ).toLocaleString()}
                                    </div>
                                    <div className='space-y-2 text-sm text-green-200'>
                                        <p>
                                            • Based on 25% widget fill rate
                                        </p>
                                        <p>
                                            • 60% revenue share to partners
                                        </p>
                                        <p>
                                            • Average ฿0.80 per interaction
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className='glassmorphism bg-transparent text-white'>
                        <CardHeader>
                            <CardTitle className='text-2xl flex items-center gap-3'>
                                <div className='rounded-lg glassmorphism bg-blue-500/50 p-2'>
                                    <Star className='h-6 w-6 text-white' />
                                </div>
                                Success Stories
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            <div className='border-l-4 border-blue-500 pl-4 py-2'>
                                <p className='text-blue-100 mb-2'>
                                    &quot;Our tech blog now generates
                                    ฿12,000 monthly through our partner
                                    program. The integration was
                                    seamless!&quot;
                                </p>
                                <div className='flex items-center gap-2'>
                                    <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold'>
                                        M
                                    </div>
                                    <div>
                                        <p className='text-sm font-medium text-white'>
                                            Mike Chen
                                        </p>
                                        <p className='text-xs text-blue-300'>
                                            TechInsights.com
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className='border-l-4 border-green-500 pl-4 py-2'>
                                <p className='text-blue-100 mb-2'>
                                    &quot;Amazing revenue stream! We&apos;re
                                    earning ฿8,500/month from our startup
                                    community site.&quot;
                                </p>
                                <div className='flex items-center gap-2'>
                                    <div className='w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold'>
                                        S
                                    </div>
                                    <div>
                                        <p className='text-sm font-medium text-white'>
                                            Sarah Kim
                                        </p>
                                        <p className='text-xs text-blue-300'>
                                            StartupHub.co
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className='border-l-4 border-purple-500 pl-4 py-2'>
                                <p className='text-blue-100 mb-2'>
                                    &quot;The widget fits perfectly with our
                                    content. Our readers love giving
                                    feedback to entrepreneurs!&quot;
                                </p>
                                <div className='flex items-center gap-2'>
                                    <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold'>
                                        A
                                    </div>
                                    <div>
                                        <p className='text-sm font-medium text-white'>
                                            Alex Rodriguez
                                        </p>
                                        <p className='text-xs text-blue-300'>
                                            BusinessDaily.net
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}