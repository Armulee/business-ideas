import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { PiArrowFatDown, PiArrowFatUp } from "react-icons/pi"

interface SwiperMiniPreviewProps {
    isHovered: boolean
}

export function SwiperMiniPreview({ isHovered }: SwiperMiniPreviewProps) {
    const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)

    useEffect(() => {
        if (!isHovered) {
            setSwipeDirection(null)
            return
        }

        const interval = setInterval(() => {
            setSwipeDirection(prev => {
                if (prev === 'left') return 'right'
                if (prev === 'right') return null
                return 'left'
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [isHovered])

    return (
        <div className='space-y-1'>
            <div className='text-xs text-white/80'>Swipe your choice:</div>
            <div className='bg-white/20 rounded px-2 py-1 text-xs flex items-center justify-between relative overflow-hidden'>
                <motion.div
                    className='flex items-center gap-1'
                    animate={{ 
                        scale: isHovered && swipeDirection === 'left' ? 1.2 : 1,
                        color: swipeDirection === 'left' ? "rgb(239, 68, 68)" : "rgba(255, 255, 255, 0.7)"
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <PiArrowFatDown className='w-3 h-3' />
                    <span>No</span>
                </motion.div>
                
                <motion.div 
                    className='absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent'
                    animate={{ 
                        x: swipeDirection === 'left' ? 0 : swipeDirection === 'right' ? '100%' : '100%',
                        opacity: swipeDirection ? 0.5 : 0
                    }}
                    transition={{ duration: 0.5 }}
                />
                
                <motion.div
                    className='flex items-center gap-1 z-10'
                    animate={{ 
                        scale: isHovered && swipeDirection === 'right' ? 1.2 : 1,
                        color: swipeDirection === 'right' ? "rgb(34, 197, 94)" : "rgba(255, 255, 255, 0.7)"
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <span>Yes</span>
                    <PiArrowFatUp className='w-3 h-3' />
                </motion.div>
                
                <motion.div 
                    className='absolute inset-0 bg-gradient-to-l from-green-500/20 to-transparent'
                    animate={{ 
                        x: swipeDirection === 'right' ? 0 : swipeDirection === 'left' ? '-100%' : '-100%',
                        opacity: swipeDirection ? 0.5 : 0
                    }}
                    transition={{ duration: 0.5 }}
                />
            </div>
        </div>
    )
}