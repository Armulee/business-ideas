import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { ImageIcon } from "lucide-react"

interface VisualPickMiniPreviewProps {
    isHovered: boolean
}

export function VisualPickMiniPreview({ isHovered }: VisualPickMiniPreviewProps) {
    const [activeImage, setActiveImage] = useState<1 | 2>(1)

    useEffect(() => {
        if (!isHovered) return

        const interval = setInterval(() => {
            setActiveImage(prev => prev === 1 ? 2 : 1)
        }, 2000)

        return () => clearInterval(interval)
    }, [isHovered])

    return (
        <div className='space-y-1'>
            <div className='text-xs text-white/80'>Choose your favorite:</div>
            <div className='flex gap-1'>
                <motion.div 
                    className='w-8 h-6 bg-white/20 rounded flex items-center justify-center'
                    animate={{
                        scale: isHovered && activeImage === 1 ? 1.2 : 1,
                        backgroundColor: isHovered && activeImage === 1 ? "rgba(59, 130, 246, 0.3)" : "rgba(255, 255, 255, 0.2)"
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <ImageIcon className='w-3 h-3 text-white/60' />
                </motion.div>
                <motion.div 
                    className='w-8 h-6 bg-white/20 rounded flex items-center justify-center'
                    animate={{
                        scale: isHovered && activeImage === 2 ? 1.2 : 1,
                        backgroundColor: isHovered && activeImage === 2 ? "rgba(59, 130, 246, 0.3)" : "rgba(255, 255, 255, 0.2)"
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <ImageIcon className='w-3 h-3 text-white/60' />
                </motion.div>
            </div>
        </div>
    )
}