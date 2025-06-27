"use client"

import { MessageSquare, Eye, StickyNote, ArrowBigUp } from "lucide-react"
import { useProfile } from "."

export default function ProfileStats() {
    const { profile } = useProfile()
    const stats = [
        { title: "Views", icon: Eye, content: profile?.viewCount },
        { title: "Upvotes", icon: ArrowBigUp, content: profile?.upvoteCount },
        {
            title: "Comments",
            icon: MessageSquare,
            content: profile?.commentCount + profile?.replyCount,
        },
        { title: "Post", icon: StickyNote, content: profile?.postCount },
    ]
    return (
        <div className='w-full h-full grid grid-cols-4 md:max-w-32 md:flex md:flex-col md:gap-1.5 gap-y-4 glassmorphism p-6 mb-3.5'>
            {stats.map((stat, index) => (
                <div key={`stat-${index}`} className='w-full text-center'>
                    <div className='w-full text-xs text-gray-200 flex md:justify-start justify-center items-center shrink-0 gap-2'>
                        <stat.icon className='sm:w-4 sm:h-4 w-6 h-6 sm:mb-0 mb-2' />
                        <div className='sm:block hidden sm:mt-0'>
                            {stat.title}
                        </div>
                    </div>

                    <span className='text-lg font-bold text-white'>
                        {stat.content}
                    </span>
                </div>
            ))}
        </div>
    )
}
