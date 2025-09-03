"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"

const items = [
    {
        title: "Earn Commissions",
        description:
            "Generate income by promoting businesses and earning commissions for qualified leads.",
    },
    {
        title: "Flexible Marketing",
        description:
            "Choose your preferred marketing methods and work with businesses that match your expertise.",
    },
    {
        title: "Track Performance",
        description:
            "Monitor your marketing efforts with real-time analytics and performance tracking.",
    },
]

const WhyJoinUs = () => {
    return (
        <motion.div
            className='glassmorphism p-8'
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            <h3 className='text-2xl font-bold text-white mb-6 md:mb-10 flex items-center'>
                <span className='inline-block w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3 text-white'>
                    ?
                </span>
                Why Join Us?
            </h3>
            <div className='md:space-y-10 space-y-6'>
                {items.map((item, index) => (
                    <motion.li
                        key={index}
                        className='flex items-start mb-4'
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                        <div className='flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mt-0.5 mr-3'>
                            <Check className='w-3 h-3' />
                        </div>
                        <div>
                            <h4 className='text-lg font-semibold text-white'>
                                {item.title}
                            </h4>
                            <p className='text-white/70 mt-1'>
                                {item.description}
                            </p>
                        </div>
                    </motion.li>
                ))}
            </div>
        </motion.div>
    )
}

export default WhyJoinUs
