import { motion } from "framer-motion"

interface CTAMiniPreviewProps {
    isHovered: boolean
}

export function CTAMiniPreview({ isHovered }: CTAMiniPreviewProps) {
    return (
        <div className='space-y-1'>
            <div className='text-xs text-white/80'>Take action:</div>
            <motion.div 
                className='bg-blue-500 rounded px-2 py-1 text-xs text-center text-white cursor-pointer'
                animate={{ 
                    scale: isHovered ? 1.15 : 1,
                    backgroundColor: isHovered ? "rgb(37, 99, 235)" : "rgb(59, 130, 246)"
                }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
            >
                Click Here
            </motion.div>
        </div>
    )
}