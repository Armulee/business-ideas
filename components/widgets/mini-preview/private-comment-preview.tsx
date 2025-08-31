import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface PrivateCommentMiniPreviewProps {
    isHovered: boolean
}

export function PrivateCommentMiniPreview({ isHovered }: PrivateCommentMiniPreviewProps) {
    const [displayText, setDisplayText] = useState("Your private comment...")
    const [isTyping, setIsTyping] = useState(false)

    const fullText = "This is amazing! Love it"
    const placeholder = "Your private comment..."

    useEffect(() => {
        if (!isHovered) {
            setDisplayText(placeholder)
            setIsTyping(false)
            return
        }

        setIsTyping(true)
        
        // Type out the text
        let currentIndex = 0
        const typingInterval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setDisplayText(fullText.slice(0, currentIndex))
                currentIndex++
            } else {
                clearInterval(typingInterval)
                
                // Wait 1 second, then revert back
                setTimeout(() => {
                    setDisplayText(placeholder)
                    setIsTyping(false)
                }, 1000)
            }
        }, 100)

        return () => {
            clearInterval(typingInterval)
        }
    }, [isHovered])

    return (
        <div className='space-y-1'>
            <div className='text-xs text-white/80'>Share your thoughts:</div>
            <motion.div 
                className='bg-white/20 rounded px-2 py-1 text-xs text-white/50 relative'
                animate={{ 
                    borderColor: isTyping ? "rgba(59, 130, 246, 0.5)" : "transparent"
                }}
                transition={{ duration: 0.3 }}
            >
                {displayText}
                {isTyping && (
                    <motion.span
                        className='text-blue-400'
                        animate={{ opacity: [1, 0] }}
                        transition={{ 
                            duration: 0.5, 
                            repeat: Infinity, 
                            repeatType: "reverse" 
                        }}
                    >
                        |
                    </motion.span>
                )}
            </motion.div>
        </div>
    )
}