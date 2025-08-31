import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface PollMiniPreviewProps {
    isHovered: boolean
}

export function PollMiniPreview({ isHovered }: PollMiniPreviewProps) {
    const [activeOption, setActiveOption] = useState<1 | 2>(1)

    useEffect(() => {
        if (!isHovered) return

        const interval = setInterval(() => {
            setActiveOption(prev => prev === 1 ? 2 : 1)
        }, 2000)

        return () => clearInterval(interval)
    }, [isHovered])

    return (
        <div className='space-y-1'>
            <div className='text-xs text-white/80'>Which option do you prefer?</div>
            <div className='space-y-1'>
                <motion.div 
                    className='bg-white/20 rounded px-2 py-1 text-xs'
                    animate={{
                        scale: isHovered && activeOption === 1 ? 1.1 : 1,
                        backgroundColor: isHovered && activeOption === 1 ? "rgba(59, 130, 246, 0.3)" : "rgba(255, 255, 255, 0.2)"
                    }}
                    transition={{ duration: 0.3 }}
                >
                    Option A
                </motion.div>
                <motion.div 
                    className='bg-white/20 rounded px-2 py-1 text-xs'
                    animate={{
                        scale: isHovered && activeOption === 2 ? 1.1 : 1,
                        backgroundColor: isHovered && activeOption === 2 ? "rgba(59, 130, 246, 0.3)" : "rgba(255, 255, 255, 0.2)"
                    }}
                    transition={{ duration: 0.3 }}
                >
                    Option B
                </motion.div>
            </div>
        </div>
    )
}