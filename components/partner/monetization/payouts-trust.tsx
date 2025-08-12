import { Card, CardContent } from "@/components/ui/card"
import {
    CreditCard,
    Calendar,
    Shield,
    DollarSign,
    Globe,
    CheckCircle,
    Users,
} from "lucide-react"

export default function PayoutsTrust() {
    return (
        <section className='relative px-4 py-20 sm:px-6 lg:px-8'>
            <div className='mx-auto max-w-6xl'>
                <div className='text-center mb-16'>
                    <h2 className='mb-4 text-4xl font-bold text-white'>
                        Secure & Reliable Payouts
                    </h2>
                    <p className='text-xl text-blue-100'>
                        Trusted by thousands of partners worldwide
                    </p>
                </div>

                <div className='grid gap-8 md:grid-cols-3'>
                    <Card className='bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/15 transition-all duration-300'>
                        <CardContent className='p-8 text-center'>
                            <div className='mb-6 flex justify-center'>
                                <div className='rounded-full bg-blue-500/20 p-4'>
                                    <CreditCard className='h-10 w-10 text-blue-400' />
                                </div>
                            </div>
                            <h3 className='mb-4 text-xl font-semibold'>
                                Multiple Payment Methods
                            </h3>
                            <div className='space-y-3'>
                                <div className='flex items-center justify-center gap-2 p-2 bg-white/5 rounded-lg'>
                                    <CreditCard className='h-4 w-4 text-blue-400' />
                                    <span className='text-sm'>
                                        Bank Transfer
                                    </span>
                                </div>
                                <div className='flex items-center justify-center gap-2 p-2 bg-white/5 rounded-lg'>
                                    <DollarSign className='h-4 w-4 text-green-400' />
                                    <span className='text-sm'>
                                        PromptPay
                                    </span>
                                </div>
                                <div className='flex items-center justify-center gap-2 p-2 bg-white/5 rounded-lg'>
                                    <Globe className='h-4 w-4 text-purple-400' />
                                    <span className='text-sm'>
                                        International Wire
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/15 transition-all duration-300'>
                        <CardContent className='p-8 text-center'>
                            <div className='mb-6 flex justify-center'>
                                <div className='rounded-full bg-green-500/20 p-4'>
                                    <Calendar className='h-10 w-10 text-green-400' />
                                </div>
                            </div>
                            <h3 className='mb-4 text-xl font-semibold'>
                                Payout Schedule
                            </h3>
                            <ul className='space-y-3 text-blue-100'>
                                <li className='flex items-center gap-2'>
                                    <CheckCircle className='h-4 w-4 text-green-400' />
                                    <span className='text-sm'>
                                        Monthly payouts on the 15th
                                    </span>
                                </li>
                                <li className='flex items-center gap-2'>
                                    <CheckCircle className='h-4 w-4 text-green-400' />
                                    <span className='text-sm'>
                                        No minimum payout threshold
                                    </span>
                                </li>
                                <li className='flex items-center gap-2'>
                                    <CheckCircle className='h-4 w-4 text-green-400' />
                                    <span className='text-sm'>
                                        Zero transaction fees
                                    </span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className='bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/15 transition-all duration-300'>
                        <CardContent className='p-8 text-center'>
                            <div className='mb-6 flex justify-center'>
                                <div className='rounded-full bg-purple-500/20 p-4'>
                                    <Shield className='h-10 w-10 text-purple-400' />
                                </div>
                            </div>
                            <h3 className='mb-4 text-xl font-semibold'>
                                Security & Trust
                            </h3>
                            <div className='space-y-3 text-sm text-blue-100'>
                                <div className='flex items-center justify-center gap-2'>
                                    <Shield className='h-4 w-4 text-purple-400' />
                                    <span>SSL Secured</span>
                                </div>
                                <div className='flex items-center justify-center gap-2'>
                                    <CheckCircle className='h-4 w-4 text-green-400' />
                                    <span>GDPR Compliant</span>
                                </div>
                                <div className='flex items-center justify-center gap-2'>
                                    <Users className='h-4 w-4 text-blue-400' />
                                    <span>1000+ Happy Partners</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}