'use client'

import { motion } from 'framer-motion'
import { Heart, Shield, Globe, Zap } from 'lucide-react'

const values = [
    {
        icon: Heart,
        title: "Community First",
        description: "We believe that the best ideas emerge from collaborative environments where entrepreneurs support each other.",
        gradient: "from-red-500 to-pink-500"
    },
    {
        icon: Shield,
        title: "Trust & Safety",
        description: "We maintain a secure, respectful platform where intellectual property is protected and discussions remain constructive.",
        gradient: "from-green-500 to-emerald-500"
    },
    {
        icon: Globe,
        title: "Global Impact",
        description: "We're building a worldwide network of innovators working together to solve real problems and create value.",
        gradient: "from-blue-500 to-cyan-500"
    },
    {
        icon: Zap,
        title: "Innovation Excellence",
        description: "We're committed to fostering breakthrough thinking and supporting ideas that can change the world.",
        gradient: "from-purple-500 to-indigo-500"
    }
]

const Values = () => {
    return (
        <section className='relative py-20'>
            <div className='container mx-auto px-4'>
                <div className='max-w-6xl mx-auto'>
                    {/* Header */}
                    <motion.div
                        className='text-center mb-16'
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className='inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 mb-6'>
                            <Heart className='w-8 h-8 text-white' />
                        </div>
                        <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
                            Our Core Values
                        </h2>
                        <p className='text-xl text-white/70 max-w-3xl mx-auto leading-relaxed'>
                            The fundamental principles that guide everything we do at BlueBizHub and shape our community
                        </p>
                    </motion.div>

                    {/* Values Grid */}
                    <div className='grid md:grid-cols-2 gap-8'>
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                className='relative group'
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: index * 0.2 }}
                                whileHover={{ scale: 1.02 }}
                            >
                                {/* Background */}
                                <div className='absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl group-hover:border-white/30 transition-all duration-300' />
                                
                                {/* Gradient overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-5 group-hover:opacity-10 rounded-3xl transition-opacity duration-300`} />
                                
                                {/* Content */}
                                <div className='relative p-8 lg:p-10'>
                                    <div className='flex items-start gap-6'>
                                        {/* Icon */}
                                        <motion.div
                                            className={`flex-shrink-0 p-4 rounded-2xl bg-gradient-to-br ${value.gradient} group-hover:scale-110 transition-transform duration-300`}
                                            whileHover={{ rotate: 5 }}
                                        >
                                            <value.icon className='w-8 h-8 text-white' />
                                        </motion.div>
                                        
                                        <div className='flex-1'>
                                            {/* Title */}
                                            <h3 className='text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300'>
                                                {value.title}
                                            </h3>
                                            
                                            {/* Description */}
                                            <p className='text-white/70 leading-relaxed'>
                                                {value.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Decorative elements */}
                                    <div className='absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                                    <div className='absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                                </div>

                                {/* Hover effect glow */}
                                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${value.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 blur-2xl`} />
                            </motion.div>
                        ))}
                    </div>

                    {/* Bottom section */}
                    <motion.div
                        className='mt-16 text-center'
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        <div className='relative inline-block'>
                            <div className='absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-2xl blur-xl opacity-30' />
                            <div className='relative px-8 py-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm'>
                                <p className='text-white/80 font-medium mb-2'>
                                    💎 Built on Trust, Powered by Community
                                </p>
                                <p className='text-white/60 text-sm'>
                                    These values aren&apos;t just words—they&apos;re the foundation of every interaction on our platform
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default Values