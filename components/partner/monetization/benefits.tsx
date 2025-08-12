import { Card, CardContent } from "@/components/ui/card"
import {
    Zap,
    Target,
    BarChart3,
    Smartphone,
    Clock,
    Award,
} from "lucide-react"

const whyPartnerWithUs = [
    {
        icon: Zap,
        title: "Lightning Fast Setup",
        description:
            "Get up and running in under 5 minutes with our simple integration.",
    },
    {
        icon: Target,
        title: "High Conversion Rates",
        description:
            "Our widgets achieve 25% fill rates with optimized user experience.",
    },
    {
        icon: BarChart3,
        title: "Real-time Analytics",
        description:
            "Track your earnings and performance with detailed analytics dashboard.",
    },
    {
        icon: Smartphone,
        title: "Mobile Optimized",
        description:
            "Fully responsive widgets that work perfectly on all devices.",
    },
    {
        icon: Clock,
        title: "Monthly Payouts",
        description:
            "Reliable monthly payments with no minimum threshold required.",
    },
    {
        icon: Award,
        title: "Dedicated Support",
        description: "Get priority support from our partner success team.",
    },
]

export default function Benefits() {
    return (
        <section className='relative px-4 mt-16 sm:px-6 lg:px-8'>
            <div className='mx-auto max-w-6xl'>
                <div className='text-center'>
                    <h2 className='mb-4 text-4xl font-bold text-white'>
                        Why Partner With Us?
                    </h2>
                    <p className='text-blue-100'>
                        Everything you need to maximize your revenue
                    </p>
                </div>

                <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6'>
                    {whyPartnerWithUs.map((why, index) => (
                        <Card
                            key={`why-partner-with-us-${index + 1}`}
                            className='glassmorphism bg-transparent text-white hover:bg-white/15 transition-all duration-300'
                        >
                            <CardContent className='p-6'>
                                <div className='mb-4 flex items-center gap-3'>
                                    <div className='rounded-lg glassmorphism bg-blue-500/50 p-2'>
                                        <why.icon className='h-6 w-6 text-white' />
                                    </div>
                                    <h3 className='text-lg text-white font-semibold'>
                                        {why.title}
                                    </h3>
                                </div>
                                <p className='text-blue-100'>
                                    {why.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}