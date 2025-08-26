'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Rocket, Users } from 'lucide-react'
import Link from 'next/link'

const CTA = () => {
    return (
        <section className='relative py-20'>
            <div className='container mx-auto px-4'>
                <div className='max-w-5xl mx-auto'>
                    {/* Main CTA Card */}
                    <motion.div
                        className='relative overflow-hidden rounded-3xl'
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Gradient Background */}
                        <div className='absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700' />
                        <div className='absolute inset-0 bg-black/20 backdrop-blur-sm' />
                        
                        {/* Animated particles */}
                        <div className='absolute inset-0'>
                            <div className='absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse' />
                            <div className='absolute top-20 right-20 w-16 h-16 bg-blue-300/20 rounded-full blur-lg animate-bounce' style={{ animationDelay: '1s' }} />
                            <div className='absolute bottom-16 left-1/4 w-24 h-24 bg-purple-300/10 rounded-full blur-2xl animate-pulse' style={{ animationDelay: '2s' }} />
                            <div className='absolute bottom-20 right-10 w-12 h-12 bg-white/15 rounded-full blur-md animate-bounce' style={{ animationDelay: '0.5s' }} />
                        </div>
                        
                        {/* Content */}
                        <div className='relative p-12 lg:p-16 text-center text-white'>
                            {/* Icon */}
                            <motion.div
                                className='inline-flex items-center justify-center p-4 rounded-2xl bg-white/20 backdrop-blur-sm mb-8'
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                                <Rocket className='w-10 h-10 text-white' />
                            </motion.div>

                            {/* Headline */}
                            <motion.h2
                                className='text-4xl md:text-5xl lg:text-6xl font-bold mb-6'
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                Ready to Transform 
                                <br />
                                <span className='relative inline-block'>
                                    Your Ideas?
                                    <motion.div
                                        className='absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full'
                                        initial={{ scaleX: 0 }}
                                        whileInView={{ scaleX: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, delay: 0.8 }}
                                    />
                                </span>
                            </motion.h2>
                            
                            {/* Subtitle */}
                            <motion.p
                                className='text-xl md:text-2xl mb-10 opacity-90 max-w-3xl mx-auto'
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                Join thousands of entrepreneurs who are already building the future together.
                                Your next big idea is just one community away.
                            </motion.p>
                            
                            {/* Action Buttons */}
                            <motion.div
                                className='flex flex-col sm:flex-row gap-6 justify-center items-center'
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                            >
                                {/* Primary CTA */}
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link
                                        href='/auth/signup'
                                        className='group inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-2xl hover:shadow-3xl'
                                    >
                                        <Sparkles className='w-5 h-5 mr-2 group-hover:animate-spin' />
                                        Join Our Community
                                        <ArrowRight className='w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200' />
                                    </Link>
                                </motion.div>
                                
                                {/* Secondary CTA */}
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link
                                        href='/post'
                                        className='group inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold text-lg rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-200 backdrop-blur-sm'
                                    >
                                        <Users className='w-5 h-5 mr-2' />
                                        Explore Ideas
                                    </Link>
                                </motion.div>
                            </motion.div>

                            {/* Trust indicators */}
                            <motion.div
                                className='mt-12 flex flex-wrap justify-center items-center gap-8 opacity-80'
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 0.8 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                            >
                                <div className='flex items-center gap-2 text-sm'>
                                    <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse' />
                                    <span>50,000+ Active Members</span>
                                </div>
                                <div className='flex items-center gap-2 text-sm'>
                                    <div className='w-2 h-2 bg-yellow-400 rounded-full animate-pulse' />
                                    <span>100% Free to Join</span>
                                </div>
                                <div className='flex items-center gap-2 text-sm'>
                                    <div className='w-2 h-2 bg-blue-400 rounded-full animate-pulse' />
                                    <span>No Credit Card Required</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Decorative elements */}
                        <div className='absolute top-0 left-0 w-full h-full'>
                            <div className='absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl animate-pulse' />
                            <div className='absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-blue-300/20 to-transparent rounded-full blur-3xl animate-pulse' style={{ animationDelay: '1.5s' }} />
                        </div>
                    </motion.div>

                    {/* Additional info cards */}
                    <motion.div
                        className='grid md:grid-cols-3 gap-6 mt-12'
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        {[
                            { title: 'Start for Free', desc: 'No hidden fees or premium plans', icon: '🎉' },
                            { title: 'Expert Feedback', desc: 'Get insights from industry leaders', icon: '🧠' },
                            { title: 'Global Community', desc: 'Connect with entrepreneurs worldwide', icon: '🌍' }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                className='relative overflow-hidden rounded-2xl group'
                                whileHover={{ y: -2 }}
                            >
                                <div className='absolute inset-0 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl group-hover:border-white/20 transition-all duration-300' />
                                <div className='relative p-6 text-center'>
                                    <div className='text-3xl mb-3'>{item.icon}</div>
                                    <h3 className='text-lg font-semibold text-white mb-2'>{item.title}</h3>
                                    <p className='text-white/70 text-sm'>{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default CTA