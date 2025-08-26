'use client'

import { motion } from 'framer-motion'
import { Users, Lightbulb, Trophy, Globe, TrendingUp, Star } from 'lucide-react'
import { useState, useEffect } from 'react'

const stats = [
    {
        icon: Users,
        number: 50000,
        suffix: '+',
        label: 'Active Entrepreneurs',
        description: 'Growing community',
        color: 'from-blue-500 to-cyan-500'
    },
    {
        icon: Lightbulb,
        number: 100000,
        suffix: '+',
        label: 'Business Ideas Shared',
        description: 'And counting',
        color: 'from-yellow-500 to-orange-500'
    },
    {
        icon: Trophy,
        number: 25000,
        suffix: '+',
        label: 'Success Stories',
        description: 'Ideas turned reality',
        color: 'from-green-500 to-emerald-500'
    },
    {
        icon: Globe,
        number: 150,
        suffix: '+',
        label: 'Countries Represented',
        description: 'Global reach',
        color: 'from-purple-500 to-pink-500'
    },
    {
        icon: TrendingUp,
        number: 85,
        suffix: '%',
        label: 'Success Rate',
        description: 'Validated ideas',
        color: 'from-indigo-500 to-blue-600'
    },
    {
        icon: Star,
        number: 4.9,
        suffix: '/5',
        label: 'Community Rating',
        description: 'User satisfaction',
        color: 'from-red-500 to-pink-500'
    }
]

// Counter component for animated numbers
const Counter = ({ target, suffix }: { target: number; suffix: string }) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
        const duration = 2000 // 2 seconds
        const steps = 60
        const stepValue = target / steps
        const stepTime = duration / steps

        let current = 0
        const timer = setInterval(() => {
            current += stepValue
            if (current >= target) {
                setCount(target)
                clearInterval(timer)
            } else {
                setCount(Math.floor(current))
            }
        }, stepTime)

        return () => clearInterval(timer)
    }, [target])

    return (
        <span>
            {target < 10 ? count.toFixed(1) : count.toLocaleString()}{suffix}
        </span>
    )
}

const Stats = () => {
    return (
        <section className='relative py-20'>
            <div className='container mx-auto px-4'>
                <div className='max-w-7xl mx-auto'>
                    {/* Header */}
                    <motion.div
                        className='text-center mb-16'
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className='inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 mb-6'>
                            <TrendingUp className='w-8 h-8 text-white' />
                        </div>
                        <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
                            Our Impact in Numbers
                        </h2>
                        <p className='text-xl text-white/70 max-w-3xl mx-auto leading-relaxed'>
                            See how BlueBizHub is transforming the entrepreneurial landscape through community-driven innovation
                        </p>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                className='relative group'
                                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                            >
                                {/* Background */}
                                <div className='absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl group-hover:border-white/30 transition-all duration-300' />
                                
                                {/* Gradient overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 rounded-3xl transition-opacity duration-300`} />
                                
                                {/* Content */}
                                <div className='relative p-8 text-center'>
                                    {/* Icon */}
                                    <motion.div
                                        className={`inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br ${stat.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
                                        whileHover={{ rotate: 5 }}
                                    >
                                        <stat.icon className='w-8 h-8 text-white' />
                                    </motion.div>
                                    
                                    {/* Number */}
                                    <motion.div
                                        className='text-4xl md:text-5xl font-bold text-white mb-2'
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                                    >
                                        <Counter target={stat.number} suffix={stat.suffix} />
                                    </motion.div>
                                    
                                    {/* Label */}
                                    <h3 className='text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300'>
                                        {stat.label}
                                    </h3>
                                    
                                    {/* Description */}
                                    <p className='text-white/60 text-sm'>
                                        {stat.description}
                                    </p>

                                    {/* Decorative elements */}
                                    <div className='absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                                </div>

                                {/* Hover glow effect */}
                                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 blur-2xl`} />
                            </motion.div>
                        ))}
                    </div>

                    {/* Bottom section with additional info */}
                    <motion.div
                        className='mt-16 grid md:grid-cols-3 gap-8'
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        {[
                            { title: 'Daily Growth', value: '500+', subtitle: 'New members join daily' },
                            { title: 'Response Time', value: '<2hrs', subtitle: 'Average feedback time' },
                            { title: 'Success Rate', value: '3x Higher', subtitle: 'Than traditional methods' }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                className='text-center'
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className='relative inline-block'>
                                    <div className='absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-xl blur-xl opacity-20' />
                                    <div className='relative px-6 py-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm'>
                                        <div className='text-2xl font-bold text-blue-400 mb-1'>{item.value}</div>
                                        <div className='text-white font-medium mb-1'>{item.title}</div>
                                        <div className='text-white/60 text-xs'>{item.subtitle}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default Stats