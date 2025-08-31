"use client"

import { motion } from "framer-motion"
import { Zap } from "lucide-react"

const items = [
    {
        step: "Step 1",
        title: "Share Your Idea",
        description: "Post your business idea to the community.",
    },
    {
        step: "Step 2",
        title: "Collect Insights",
        description:
            "Receive honest feedback and valuable insights from others.",
    },
    {
        step: "Step 3",
        title: "Refine Your Idea",
        description:
            "Use community feedback to enhance and tailor your business concept.",
    },
]
const HowItWorks = () => {
    return (
        <motion.div
            className='glassmorphism p-8'
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            <h3 className='text-2xl font-bold text-white mb-6 flex items-center'>
                <span className='inline-block w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3 text-white'>
                    <Zap className='w-5 h-5' />
                </span>
                How It Works
            </h3>
            <div className='space-y-6'>
                {items.map((item, index) => (
                    <motion.div
                        key={index}
                        className='relative pl-12 pb-6'
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                            delay: index * 0.2,
                            duration: 0.5,
                        }}
                    >
                        <div className='absolute left-[7px] top-0 w-5 h-5 rounded-full bg-blue-500' />
                        <div className='absolute left-[16px] top-0 w-[2px] h-full bg-blue-500' />
                        <span className='text-sm font-medium text-blue-300'>
                            {item.step}
                        </span>
                        <h4 className='text-lg font-semibold text-white mt-1'>
                            {item.title}
                        </h4>
                        <p className='text-white/70 mt-1'>{item.description}</p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}

export default HowItWorks
