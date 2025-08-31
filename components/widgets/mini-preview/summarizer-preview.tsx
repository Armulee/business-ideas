import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface SummarizerMiniPreviewProps {
    isHovered: boolean
}

export function SummarizerMiniPreview({ isHovered }: SummarizerMiniPreviewProps) {
    const [activeBullet, setActiveBullet] = useState(0)

    useEffect(() => {
        if (!isHovered) {
            setActiveBullet(0)
            return
        }

        const interval = setInterval(() => {
            setActiveBullet(prev => prev === 0 ? 1 : 0)
        }, 1500)

        return () => clearInterval(interval)
    }, [isHovered])

    const bulletPoints = ["Key Point 1", "Key Point 2"]

    return (
        <div className='space-y-1'>
            <div className='text-xs text-white/80'>Key points:</div>
            <div className='space-y-1'>
                {bulletPoints.map((point, index) => (
                    <motion.div 
                        key={index}
                        className='text-xs flex items-center gap-1'
                        animate={{ 
                            scale: isHovered && activeBullet === index ? 1.1 : 1,
                            color: isHovered && activeBullet === index ? "rgb(59, 130, 246)" : "rgba(255, 255, 255, 0.7)"
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.span
                            animate={{ 
                                color: isHovered && activeBullet === index ? "rgb(59, 130, 246)" : "rgba(255, 255, 255, 0.7)",
                                scale: isHovered && activeBullet === index ? 1.2 : 1
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            •
                        </motion.span>
                        {point}
                    </motion.div>
                ))}
            </div>
        </div>
    )
}