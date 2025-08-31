import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { 
    FaFacebook, 
    FaInstagram, 
    FaTwitter, 
    FaLinkedin, 
    FaGithub, 
    FaReddit 
} from "react-icons/fa"

interface SocialMediasMiniPreviewProps {
    isHovered: boolean
}

export function SocialMediasMiniPreview({ isHovered }: SocialMediasMiniPreviewProps) {
    const [activeIcon, setActiveIcon] = useState(0)

    const socialIcons = [
        { icon: FaFacebook, color: "rgb(24, 119, 242)" },
        { icon: FaInstagram, color: "rgb(225, 48, 108)" },
        { icon: FaTwitter, color: "rgb(29, 155, 240)" },
        { icon: FaLinkedin, color: "rgb(10, 102, 194)" },
        { icon: FaGithub, color: "rgb(51, 51, 51)" },
        { icon: FaReddit, color: "rgb(255, 69, 0)" }
    ]

    useEffect(() => {
        if (!isHovered) {
            setActiveIcon(0)
            return
        }

        const interval = setInterval(() => {
            setActiveIcon(prev => (prev + 1) % socialIcons.length)
        }, 400)

        return () => clearInterval(interval)
    }, [isHovered, socialIcons.length])

    return (
        <div className='space-y-1'>
            <div className='text-xs text-white/80'>Follow me:</div>
            <div className='flex gap-1 justify-center'>
                {socialIcons.map((social, index) => (
                    <motion.div
                        key={index}
                        className='w-4 h-4 rounded flex items-center justify-center'
                        animate={{ 
                            scale: isHovered && activeIcon === index ? 1.3 : 1,
                            backgroundColor: isHovered && activeIcon === index ? social.color : "rgba(255, 255, 255, 0.2)"
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <social.icon 
                            className='w-2.5 h-2.5' 
                            color={isHovered && activeIcon === index ? "white" : "rgba(255, 255, 255, 0.7)"}
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    )
}