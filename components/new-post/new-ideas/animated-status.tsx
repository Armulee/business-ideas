"use client"

import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, Check } from "lucide-react"
import { useEffect, useState } from "react"

interface AnimatedStatusProps {
    hasUnsavedChanges: boolean
    hasInteracted: boolean
    showSaved: boolean
}

export default function AnimatedStatus({
    hasUnsavedChanges,
    hasInteracted,
    showSaved,
}: AnimatedStatusProps) {
    const [showJustSaved, setShowJustSaved] = useState(false)

    // Track when something is just saved
    useEffect(() => {
        if (showSaved) {
            setShowJustSaved(true)
            const timer = setTimeout(() => {
                setShowJustSaved(false)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [showSaved])
    const slideVariants = {
        enter: {
            x: 100,
            opacity: 0,
        },
        center: {
            x: 0,
            opacity: 1,
        },
        exit: {
            x: 100,
            opacity: 0,
        },
    }

    const transition = {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
        duration: 0.3,
    }

    return (
        <div className='fixed top-[80px] right-0 overflow-hidden'>
            <AnimatePresence mode='wait'>
                {hasUnsavedChanges && hasInteracted ? (
                    <motion.div
                        key='unsaved'
                        variants={slideVariants}
                        initial='enter'
                        animate='center'
                        exit='exit'
                        transition={transition}
                        className='glassmorphism bg-white/10 !rounded-l-full px-3 py-2 mb-3 flex items-center gap-2'
                    >
                        <AlertCircle className='w-4 h-4 text-yellow-500' />
                        <span className='text-xs text-yellow-500'>Unsaved</span>
                    </motion.div>
                ) : showJustSaved ? (
                    <motion.div
                        key='just-saved'
                        variants={slideVariants}
                        initial='enter'
                        animate='center'
                        exit='exit'
                        transition={transition}
                        className='glassmorphism bg-white/10 !rounded-l-full pl-3 pr-6 py-2 mb-3 flex items-center gap-2'
                    >
                        <Check className='w-4 h-4 text-green-500' />
                        <span className='text-xs text-green-500 font-medium'>
                            Saved!
                        </span>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    )
}
