"use client"

import { useState } from "react"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, Mail, Sparkles } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

const partnerRegistrationLink = "/partner/registration"

export default function FooterCTA() {
    const [email, setEmail] = useState("")

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (email) {
            toast("Thanks for subscribing! ✨", {
                description: "You'll receive partner tips and updates soon.",
            })
            setEmail("")
        }
    }

    return (
        <section className='relative px-4 pt-10 pb-32 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600'>
            <div className='mx-auto max-w-4xl text-center'>
                <div className='mb-8 flex justify-center'>
                    <div className='relative'>
                        <div className='absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse'></div>
                        <div className='relative rounded-full bg-white/10 backdrop-blur-lg p-6'>
                            <Sparkles className='h-16 w-16 text-white' />
                        </div>
                    </div>
                </div>
                <h2 className='mb-6 text-3xl font-bold text-white sm:text-5xl'>
                    Ready to Start Earning?
                </h2>
                <p className='mb-12 text-lg text-white max-w-2xl mx-auto'>
                    Join thousands of partners already monetizing their
                    traffic with our partner program. Start earning in just
                    24 hours.
                </p>

                <form onSubmit={handleEmailSubmit} className='mb-12'>
                    <div className='flex flex-col gap-4 sm:flex-row sm:max-w-md sm:mx-auto'>
                        <Input
                            type='email'
                            placeholder='Enter your email for partner updates'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='bg-white/10 border-white/20 text-white placeholder:text-blue-200 backdrop-blur-sm'
                            required
                        />
                        <Button
                            type='submit'
                            variant='secondary'
                            className='bg-white text-blue-600 hover:bg-blue-50'
                        >
                            <Mail className='mr-2 h-4 w-4' />
                            Subscribe
                        </Button>
                    </div>
                </form>

                <div className='flex flex-col gap-4 sm:flex-row sm:justify-center'>
                    <Link href={partnerRegistrationLink}>
                        <Button
                            size='lg'
                            className='bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-2xl'
                        >
                            <Sparkles className='mr-2 h-5 w-5' />
                            Become a Partner Today
                        </Button>
                    </Link>
                    <Button
                        size='lg'
                        variant='outline'
                        className='text-white border-white hover:bg-white/10 px-8 py-4 text-lg backdrop-blur-sm bg-transparent'
                    >
                        Schedule a Demo
                    </Button>
                </div>

                <div className='mt-8 flex justify-center items-center gap-8 text-sm text-blue-100'>
                    <div className='flex items-center gap-2'>
                        <CheckCircle className='h-4 w-4' />
                        <span>No setup fees</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <CheckCircle className='h-4 w-4' />
                        <span>Cancel anytime</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <CheckCircle className='h-4 w-4' />
                        <span>24/7 support</span>
                    </div>
                </div>
            </div>
        </section>
    )
}