import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface ChecklistMiniPreviewProps {
    isHovered: boolean
}

export function ChecklistMiniPreview({ isHovered }: ChecklistMiniPreviewProps) {
    const [checkedItems, setCheckedItems] = useState([true, false])

    useEffect(() => {
        if (!isHovered) {
            setCheckedItems([true, false])
            return
        }

        // Check all items in order
        const timer1 = setTimeout(() => {
            setCheckedItems([true, true])
        }, 500)

        // Revert back
        const timer2 = setTimeout(() => {
            setCheckedItems([true, false])
        }, 2500)

        return () => {
            clearTimeout(timer1)
            clearTimeout(timer2)
        }
    }, [isHovered])

    return (
        <div className='space-y-1'>
            <div className='text-xs text-white/80'>Select all that apply:</div>
            <div className='space-y-1'>
                <div className='flex items-center gap-1'>
                    <motion.div 
                        className='w-2 h-2 rounded-sm'
                        animate={{ 
                            backgroundColor: checkedItems[0] ? "rgb(59, 130, 246)" : "rgba(255, 255, 255, 0.2)",
                            scale: isHovered && checkedItems[0] ? 1.2 : 1
                        }}
                        transition={{ duration: 0.3 }}
                    />
                    <span className='text-xs'>Option 1</span>
                </div>
                <div className='flex items-center gap-1'>
                    <motion.div 
                        className='w-2 h-2 rounded-sm'
                        animate={{ 
                            backgroundColor: checkedItems[1] ? "rgb(59, 130, 246)" : "rgba(255, 255, 255, 0.2)",
                            scale: isHovered && checkedItems[1] ? 1.2 : 1
                        }}
                        transition={{ duration: 0.3, delay: checkedItems[1] ? 0.2 : 0 }}
                    />
                    <span className='text-xs'>Option 2</span>
                </div>
            </div>
        </div>
    )
}