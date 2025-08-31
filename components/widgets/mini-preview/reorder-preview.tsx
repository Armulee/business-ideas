import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface ReorderMiniPreviewProps {
    isHovered: boolean
}

export function ReorderMiniPreview({ isHovered }: ReorderMiniPreviewProps) {
    const [isReordering, setIsReordering] = useState(false)

    useEffect(() => {
        if (!isHovered) {
            setIsReordering(false)
            return
        }

        const timer = setTimeout(() => {
            setIsReordering(true)
            
            // Reset after animation
            setTimeout(() => {
                setIsReordering(false)
            }, 2000)
        }, 500)

        return () => clearTimeout(timer)
    }, [isHovered])

    return (
        <div className='space-y-1'>
            <div className='text-xs text-white/80'>Drag to reorder:</div>
            <div className='space-y-1 relative'>
                <motion.div 
                    className='bg-white/20 rounded px-2 py-1 text-xs flex items-center gap-1 relative z-10'
                    animate={{ 
                        y: isReordering ? 20 : 0,
                        opacity: isReordering ? 0.7 : 1
                    }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                    <span className='text-white/50'>⋮⋮</span> Item 1
                </motion.div>
                <motion.div 
                    className='bg-white/20 rounded px-2 py-1 text-xs flex items-center gap-1 relative z-20'
                    animate={{ 
                        y: isReordering ? -20 : 0,
                        scale: isReordering ? 1.05 : 1,
                        backgroundColor: isReordering ? "rgba(59, 130, 246, 0.3)" : "rgba(255, 255, 255, 0.2)",
                        boxShadow: isReordering ? "0 4px 8px rgba(0,0,0,0.2)" : "none"
                    }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                    <span className='text-white/50'>⋮⋮</span> Item 2
                </motion.div>
            </div>
        </div>
    )
}