'use client'

import { motion } from 'framer-motion'
import { Lightbulb, Users, Target, Rocket, Zap, Heart, Star, TrendingUp } from 'lucide-react'

const features = [
    {
        icon: Lightbulb,
        title: "Idea Refinement",
        description: "Get valuable feedback from experienced entrepreneurs and industry experts to polish your business concepts.",
        color: "from-yellow-500 to-orange-500"
    },
    {
        icon: Users,
        title: "Community Collaboration",
        description: "Connect with like-minded innovators, potential co-founders, and mentors who share your entrepreneurial passion.",
        color: "from-blue-500 to-cyan-500"
    },
    {
        icon: Target,
        title: "Market Validation",
        description: "Test your ideas with real users and get insights on market demand before investing time and resources.",
        color: "from-purple-500 to-pink-500"
    },
    {
        icon: Rocket,
        title: "Launch Support",
        description: "Access resources, tools, and guidance to help transform your validated ideas into thriving businesses.",
        color: "from-green-500 to-emerald-500"
    },
    {
        icon: Zap,
        title: "Rapid Iteration",
        description: "Quickly iterate on your ideas based on real-time feedback and market insights from our community.",
        color: "from-indigo-500 to-blue-600"
    },
    {
        icon: Heart,
        title: "Supportive Environment",
        description: "Join a welcoming community that celebrates innovation and supports entrepreneurs at every stage.",
        color: "from-red-500 to-pink-500"
    },
    {
        icon: Star,
        title: "Expert Guidance",
        description: "Learn from successful entrepreneurs and industry leaders who provide mentorship and advice.",
        color: "from-amber-500 to-yellow-500"
    },
    {
        icon: TrendingUp,
        title: "Growth Tracking",
        description: "Monitor your idea's progress and see how it evolves through community feedback and validation.",
        color: "from-teal-500 to-cyan-500"
    }
]

const Features = () => {
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
                        <div className='inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-6'>
                            <Star className='w-8 h-8 text-white' />
                        </div>
                        <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
                            Why Choose BlueBizHub?
                        </h2>
                        <p className='text-xl text-white/70 max-w-3xl mx-auto leading-relaxed'>
                            Discover the powerful features that make our platform the perfect place for entrepreneurial growth and innovation
                        </p>
                    </motion.div>

                    {/* Features Grid */}
                    <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className='relative group'
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                            >
                                {/* Card Background */}
                                <div className='absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl group-hover:border-white/30 transition-all duration-300' />
                                <div className='absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent rounded-2xl group-hover:from-blue-500/10 group-hover:via-purple-500/10 transition-all duration-300' />
                                
                                {/* Content */}
                                <div className='relative p-6 h-full flex flex-col'>
                                    {/* Icon */}
                                    <motion.div
                                        className={`inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                                        whileHover={{ rotate: 5 }}
                                    >
                                        <feature.icon className='w-6 h-6 text-white' />
                                    </motion.div>
                                    
                                    {/* Title */}
                                    <h3 className='text-lg font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300'>
                                        {feature.title}
                                    </h3>
                                    
                                    {/* Description */}
                                    <p className='text-white/70 text-sm leading-relaxed flex-grow'>
                                        {feature.description}
                                    </p>

                                    {/* Hover Effect Border */}
                                    <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 blur-xl' />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <motion.div
                        className='text-center mt-16'
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        <div className='relative inline-block'>
                            <div className='absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-xl blur-xl opacity-30' />
                            <p className='relative text-white/70 text-sm px-6 py-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm'>
                                ✨ Join thousands of entrepreneurs already building the future together
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default Features