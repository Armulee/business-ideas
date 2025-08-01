"use client"

import { motion } from "framer-motion"
import { PropagateLoader } from "react-spinners"

export default function Loading() {
    return (
        <div className='flex items-center justify-center pb-20 w-screen min-h-screen fixed top-0 left-0 moving-gradient z-[100]'>
            <motion.div
                className='flex flex-col items-center'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.p
                    className='mb-8 text-white font-bold text-2xl'
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <span className='text-blue-400'>Blue</span>BizHub
                </motion.p>
                <PropagateLoader color='#ffffff' size={25} className='pr-6' />
            </motion.div>
        </div>
    )
}
