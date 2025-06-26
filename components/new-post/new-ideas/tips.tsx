import { Sparkles } from "lucide-react"
import { motion } from "framer-motion"

const Tips = () => {
    return (
        /* Tips section */
        <motion.div
            className='bg-gradient-to-br from-blue-900/30 to-blue-800/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20 shadow-lg'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
        >
            <h3 className='text-xl font-semibold text-white mb-4 flex items-center'>
                <Sparkles className='mr-2 h-5 w-5 text-blue-400' />
                Tips for a Great Idea Submission
            </h3>
            <ul className='space-y-3 text-gray-300'>
                <li className='flex items-start'>
                    <div className='flex-shrink-0 h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5 mr-3'>
                        <span className='text-blue-400 text-xs'>1</span>
                    </div>
                    <p>Be specific about the problem your idea solves</p>
                </li>
                <li className='flex items-start'>
                    <div className='flex-shrink-0 h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5 mr-3'>
                        <span className='text-blue-400 text-xs'>2</span>
                    </div>
                    <p>Explain what makes your idea unique or innovative</p>
                </li>
                <li className='flex items-start'>
                    <div className='flex-shrink-0 h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5 mr-3'>
                        <span className='text-blue-400 text-xs'>3</span>
                    </div>
                    <p>
                        Consider including potential revenue models or
                        monetization strategies
                    </p>
                </li>
            </ul>
        </motion.div>
    )
}

export default Tips
