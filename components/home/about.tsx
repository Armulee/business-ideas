"use client"

import { Lightbulb, MessageCircle, StickyNote, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

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

const features = [
    {
        icon: Lightbulb,
        title: "Share Your Idea",
        description:
            "Post your business ideas and see how they resonate with a global audience.",
    },
    {
        icon: MessageCircle,
        title: "Gather Valuable Feedback",
        description:
            "Discover what people truly think about your idea to refine and improve it.",
    },
    {
        icon: TrendingUp,
        title: "Explore Trending Concepts",
        description:
            "Find out which ideas are gaining traction and identify promising opportunities.",
    },
    {
        icon: StickyNote,
        title: "Recognition and Validation",
        description:
            "Gain visibility and validation as your ideas resonate with the community.",
    },
]

const About = () => {
    return (
        <>
            <div className='absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent z-0'></div>
            <div className='relative z-10 max-w-6xl mx-auto px-4'>
                <motion.div
                    className='text-center mb-16'
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className='text-3xl sm:text-4xl font-bold text-white mb-4'>
                        Welcome To <span className='text-blue-400'>Blue</span>
                        BizHub
                    </h2>
                    <p className='text-lg text-white/80 max-w-3xl mx-auto'>
                        Our platform is designed to give entrepreneurs,
                        creators, and visionaries a space to
                        <span className='font-semibold text-white'>
                            {" "}
                            share, discuss, validate and refine{" "}
                        </span>
                        their startup concepts with a like-minded community.
                    </p>
                </motion.div>

                <motion.div
                    className='grid grid-cols-1 md:grid-cols-2 gap-8'
                    variants={containerVariants}
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true }}
                >
                    {features.map((feature, index) => (
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
                                <h3 className='text-xl font-semibold text-white mb-2'>
                                    {feature.title}
                                </h3>
                                <p className='text-white/70 text-sm'>
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </>
    )
}

export default About
