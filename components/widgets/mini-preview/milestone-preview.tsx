import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface MilestoneMiniPreviewProps {
    isHovered: boolean
}

export function MilestoneMiniPreview({ isHovered }: MilestoneMiniPreviewProps) {
    const [progress, setProgress] = useState(60)

    useEffect(() => {
        if (!isHovered) {
            setProgress(60)
            return
        }

        // Animate to 100, then back to 60
        let currentProgress = 60
        const interval = setInterval(() => {
            if (currentProgress < 100) {
                currentProgress += 5
                setProgress(currentProgress)
            } else {
                clearInterval(interval)
                
                // Wait and then go back
                setTimeout(() => {
                    const reverseInterval = setInterval(() => {
                        if (currentProgress > 60) {
                            currentProgress -= 5
                            setProgress(currentProgress)
                        } else {
                            clearInterval(reverseInterval)
                        }
                    }, 50)
                }, 1000)
            }
        }, 50)

        return () => {
            clearInterval(interval)
        }
    }, [isHovered])

    return (
        <div className='space-y-1'>
            <motion.div 
                className='text-xs text-white/80'
                animate={{ 
                    color: progress === 100 ? "rgb(34, 197, 94)" : "rgba(255, 255, 255, 0.8)"
                }}
                transition={{ duration: 0.3 }}
            >
                Progress: {progress}%
                {progress === 100 && (
                    <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className='ml-1'
                    >
                        🎉
                    </motion.span>
                )}
            </motion.div>
            <div className='bg-white/20 rounded h-2 overflow-hidden'>
                <motion.div 
                    className='rounded h-full'
                    animate={{ 
                        width: `${progress}%`,
                        backgroundColor: progress === 100 ? "rgb(34, 197, 94)" : "rgb(59, 130, 246)"
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                />
            </div>
        </div>
    )
}