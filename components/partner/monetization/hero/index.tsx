"use client"
import { Button } from "@/components/ui/button"
import { Handshake, Percent, TrendingUp, Users } from "lucide-react"
import { motion } from "framer-motion"
import BecomePartner from "./become-partner"

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
}

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
        },
    },
}

const stats = [
    {
        icon: Percent,
        title: "60%",
        description: "Revenue Share",
    },
    {
        icon: Users,
        title: "1000+",
        description: "Active Partners",
    },
    {
        icon: Handshake,
        title: "$80K",
        description: "Paid To Partners",
    },
]

export default function Hero() {
    return (
        <section className='relative px-4 pt-20 sm:px-6 lg:px-8'>
            <div className='mx-auto max-w-6xl'>
                <div className='text-center mb-6'>
                    <div className='mb-4 flex justify-center'>
                        <div className='relative'>
                            <div className='absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-lg opacity-75 animate-pulse' />
                            <div className='relative glassmorphism !rounded-full p-6'>
                                <TrendingUp className='h-10 w-10 text-white' />
                            </div>
                        </div>
                    </div>
                    <h1 className='mb-6 text-4xl font-bold tracking-tight text-white sm:text-7xl bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent'>
                        Monetize Your Website Traffic
                    </h1>
                    <p className='mb-8 text-md text-white/90 max-w-3xl mx-auto leading-relaxed'>
                        Join our partner program and turn your website visitors
                        into revenue. Earn up to 60% revenue share with our
                        innovative feedback widget.
                    </p>
                    <div className='flex flex-col gap-4 sm:flex-row sm:justify-center'>
                        <BecomePartner />
                        <Button
                            size='lg'
                            variant='ghost'
                            className='border-blue-300 text-blue-100 hover:bg-transparent hover:text-white px-8 py-4 underline underline-offset-2 backdrop-blur-sm bg-transparent'
                        >
                            View Demo
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <motion.div
                    className='grid grid-cols-3 gap-4'
                    variants={containerVariants}
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true }}
                >
                    {stats.map((feature, index) => (
                        <motion.div
                            key={index}
                            className='bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 hover:shadow-lg group'
                            variants={itemVariants}
                        >
                            <div className='flex flex-col items-center text-center'>
                                <div className='p-4 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-300/20 border border-white/20 mb-4 group-hover:scale-110 transition-transform duration-300'>
                                    <feature.icon
                                        size={32}
                                        className='text-white'
                                    />
                                </div>
                                <div className='text-xl font-semibold text-white mb-2'>
                                    {feature.title}
                                </div>
                                <p className='text-white/70 text-sm'>
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
