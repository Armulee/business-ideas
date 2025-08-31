import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface SliderMiniPreviewProps {
    isHovered: boolean
}

export function SliderMiniPreview({ isHovered }: SliderMiniPreviewProps) {
    const [progress, setProgress] = useState(60)

    useEffect(() => {
        if (!isHovered) {
            setProgress(60)
            return
        }

        // Animate to 100, then back to 60
        const timer1 = setTimeout(() => {
            setProgress(100)
        }, 200)

        const timer2 = setTimeout(() => {
            setProgress(60)
        }, 2200)

        return () => {
            clearTimeout(timer1)
            clearTimeout(timer2)
        }
    }, [isHovered])

    return (
        <div className='space-y-1'>
            <div className='text-xs text-white/80'>Rate from 1-100:</div>
            <div className='bg-white/20 rounded h-2 relative overflow-hidden'>
                <motion.div 
                    className='bg-blue-400 rounded h-full'
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                />
            </div>
        </div>
    )
}