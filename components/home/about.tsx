import { Lightbulb, MessageCircle, StickyNote, TrendingUp } from "lucide-react"

const About = () => {
    return (
        <div className='text-center pt-6'>
            <h3 className='text-2xl font-bold mb-2'>
                Welcome To Business Ideas
            </h3>
            <p className='text-sm mb-8'>
                A platform where entrepreneurs and dreamers <br />
                <b>find, share, and refine</b> business ideas
            </p>
            <div className='w-[80%] mx-auto grid grid-cols-2 gap-y-2'>
                <div className='flex flex-col items-center'>
                    <div className='p-4 rounded-full border border-white'>
                        <Lightbulb size={35} />
                    </div>
                    <span className='mt-2 mb-4 text-sm'>Idea Discovery</span>
                </div>
                <div className='flex flex-col justify-center items-center'>
                    <div className='p-4 rounded-full border border-white'>
                        <MessageCircle size={35} />
                    </div>
                    <span className='mt-2 mb-4 text-sm'>
                        Community Feedback
                    </span>
                </div>
                <div className='flex flex-col justify-center items-center'>
                    <div className='p-4 rounded-full border border-white'>
                        <TrendingUp size={35} />
                    </div>
                    <span className='mt-2 mb-4 text-sm'>Trends & Insights</span>
                </div>
                <div className='flex flex-col justify-center items-center'>
                    <div className='p-4 rounded-full border border-white'>
                        <StickyNote size={35} />
                    </div>
                    <span className='mt-2 mb-4 text-sm'>
                        Business Resources
                    </span>
                </div>
            </div>
        </div>
    )
}

export default About
