import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface RatingMiniPreviewProps {
    isHovered: boolean
}

export function RatingMiniPreview({ isHovered }: RatingMiniPreviewProps) {
    const [rating, setRating] = useState(3)

    useEffect(() => {
        if (!isHovered) {
            setRating(3)
            return
        }

        let currentRating = 3
        const ascendingInterval = setInterval(() => {
            if (currentRating < 5) {
                currentRating += 1
                setRating(currentRating)
            } else {
                clearInterval(ascendingInterval)
                
                // Wait 2 seconds at 5 stars, then descend
                setTimeout(() => {
                    const descendingInterval = setInterval(() => {
                        if (currentRating > 3) {
                            currentRating -= 1
                            setRating(currentRating)
                        } else {
                            clearInterval(descendingInterval)
                        }
                    }, 300)
                }, 2000)
            }
        }, 300)

        return () => {
            clearInterval(ascendingInterval)
        }
    }, [isHovered])

    return (
        <div className='space-y-1'>
            <div className='text-xs text-white/80'>Rate this:</div>
            <div className='flex gap-1'>
                {[...Array(5)].map((_, i) => (
                    <motion.div 
                        key={i} 
                        className={`w-3 h-3 ${i < rating ? 'text-yellow-400' : 'text-white/30'}`}
                        animate={{ 
                            scale: isHovered && i < rating ? 1.2 : 1,
                            rotateZ: isHovered && i < rating ? [0, 15, -15, 0] : 0
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        ⭐
                    </motion.div>
                ))}
            </div>
        </div>
    )
}