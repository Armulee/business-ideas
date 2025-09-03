"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "../ui/button"
import { motion } from "framer-motion"
import Link from "next/link"

const CTA = () => {
    return (
        <>
            <div className='absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent z-0'></div>
            <motion.div
                className='relative z-10 max-w-4xl mx-auto px-4 text-center'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <h2 className='text-3xl sm:text-4xl font-bold text-white mb-6'>
                    Ready to Amplify Your Business or Start Earning?
                </h2>
                <p className='text-lg text-white/80 mb-8 max-w-2xl mx-auto'>
                    Join our community of business owners and marketing partners. Submit your business or start earning commissions today.
                </p>
                <Link href='/post'>
                    <Button size='lg' className='cta-button text-lg'>
                        Get Started Now
                        <ArrowRight className='ml-2 h-5 w-5' />
                    </Button>
                </Link>
            </motion.div>
        </>
    )
}

export default CTA
