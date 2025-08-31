import { motion } from "framer-motion"

interface FollowMiniPreviewProps {
    isHovered: boolean
}

export function FollowMiniPreview({ isHovered }: FollowMiniPreviewProps) {
    return (
        <div className='space-y-1'>
            <motion.div 
                className='text-xs text-white/80 text-center'
                animate={{ 
                    scale: isHovered ? 1.05 : 1
                }}
                transition={{ duration: 0.3 }}
            >
                <div className='font-semibold'>@johndoe</div>
                <div className='text-xs text-white/60 space-x-2'>
                    <span>42 posts</span>
                    <span>1.2k followers</span>
                    <span>234 following</span>
                </div>
            </motion.div>
            <motion.div 
                className='bg-blue-500 rounded px-2 py-1 text-xs text-center text-white cursor-pointer'
                animate={{ 
                    scale: isHovered ? 1.2 : 1,
                    backgroundColor: isHovered ? "rgb(37, 99, 235)" : "rgb(59, 130, 246)"
                }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.25 }}
                whileTap={{ scale: 0.95 }}
            >
                Follow
            </motion.div>
        </div>
    )
}