import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface RangeMiniPreviewProps {
    isHovered: boolean
}

export function RangeMiniPreview({ isHovered }: RangeMiniPreviewProps) {
    const [currentValue, setCurrentValue] = useState(42)

    useEffect(() => {
        if (!isHovered) {
            setCurrentValue(42)
            return
        }

        let value = 0
        const interval = setInterval(() => {
            if (value <= 100) {
                setCurrentValue(value)
                value += 2
            } else {
                clearInterval(interval)
                
                // Reset back to 42 after a brief pause
                setTimeout(() => {
                    setCurrentValue(42)
                }, 1000)
            }
        }, 30)

        return () => clearInterval(interval)
    }, [isHovered])

    return (
        <div className='space-y-1'>
            <div className='text-xs text-white/80'>Enter a number:</div>
            <motion.div 
                className='bg-white/20 rounded px-2 py-1 text-xs text-center font-mono'
                animate={{ 
                    scale: isHovered && currentValue === 100 ? 1.1 : 1,
                    backgroundColor: isHovered && currentValue === 100 ? "rgba(34, 197, 94, 0.3)" : "rgba(255, 255, 255, 0.2)"
                }}
                transition={{ duration: 0.3 }}
            >
                {currentValue}
            </motion.div>
        </div>
    )
}