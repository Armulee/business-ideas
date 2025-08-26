'use client'

import { motion } from 'framer-motion'
import { Target, Lightbulb } from 'lucide-react'

const Mission = () => {
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
                        <div className='inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-6'>
                            <Target className='w-8 h-8 text-white' />
                        </div>
                        <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
                            Our Mission
                        </h2>
                        <p className='text-xl text-white/70 max-w-3xl mx-auto leading-relaxed'>
                            To democratize entrepreneurship by creating a platform where anyone with an idea can access the feedback, resources, and community support needed to turn their vision into reality.
                        </p>
                    </motion.div>

                    {/* Content Grid */}
                    <div className='grid lg:grid-cols-2 gap-12 items-center'>
                        {/* What We Believe */}
                        <motion.div
                            className='relative overflow-hidden rounded-3xl group'
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                        >
                            <div className='absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl group-hover:border-white/30 transition-all duration-300' />
                            <div className='absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent rounded-3xl group-hover:from-blue-500/20 transition-all duration-300' />
                            
                            <div className='relative p-8 lg:p-12'>
                                <div className='inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 mb-6'>
                                    <Lightbulb className='w-6 h-6 text-white' />
                                </div>
                                
                                <h3 className='text-2xl font-bold text-white mb-6'>
                                    What We Believe
                                </h3>
                                
                                <p className='text-white/70 leading-relaxed mb-6'>
                                    Every great business started as an idea in someone&apos;s mind. We believe that by bringing together diverse perspectives, experiences, and expertise, we can help transform raw concepts into viable business opportunities.
                                </p>
                                
                                <div className='space-y-3'>
                                    {[
                                        'Ideas deserve to be heard',
                                        'Collaboration breeds innovation',
                                        'Everyone has potential to succeed'
                                    ].map((item, index) => (
                                        <motion.div
                                            key={index}
                                            className='flex items-center gap-3'
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                                        >
                                            <div className='w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400' />
                                            <span className='text-white/80 text-sm'>{item}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* How We Help */}
                        <motion.div
                            className='relative overflow-hidden rounded-3xl group'
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                        >
                            <div className='absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-3xl group-hover:border-white/30 transition-all duration-300' />
                            <div className='absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-transparent rounded-3xl group-hover:from-purple-500/20 transition-all duration-300' />
                            
                            <div className='relative p-8 lg:p-12'>
                                <div className='inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 mb-6'>
                                    <Target className='w-6 h-6 text-white' />
                                </div>
                                
                                <h3 className='text-2xl font-bold text-white mb-6'>
                                    How We Help
                                </h3>
                                
                                <p className='text-white/70 leading-relaxed mb-6'>
                                    Through structured feedback, community voting, expert insights, and collaborative discussions, we provide a comprehensive ecosystem where ideas can evolve and mature.
                                </p>
                                
                                <div className='grid grid-cols-2 gap-4'>
                                    {[
                                        { label: 'Feedback', value: '24/7' },
                                        { label: 'Experts', value: '500+' },
                                        { label: 'Ideas', value: '100K+' },
                                        { label: 'Success', value: '85%' },
                                    ].map((stat, index) => (
                                        <motion.div
                                            key={index}
                                            className='text-center p-3 rounded-xl bg-white/5 border border-white/10'
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                                        >
                                            <div className='text-lg font-bold text-blue-400'>{stat.value}</div>
                                            <div className='text-xs text-white/60'>{stat.label}</div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Mission