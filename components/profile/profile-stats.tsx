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
        <div className='w-full grid grid-cols-4 md:gap-4 gap-2 mb-6'>
            {stats.map((stat, index) => (
                <div
                    key={`stat-${index}`}
                    className='w-full text-center glassmorphism p-4'
                >
                    <div className='w-full text-xs text-gray-200 flex flex-col justify-center items-center shrink-0'>
                        <stat.icon className='w-6 h-6 sm:mb-0 mb-2' />
                        <div className='text-[10px] sm:mt-0'>{stat.title}</div>
                    </div>

                    <span className='text-sm font-bold text-white'>
                        {stat.content}
                    </span>
                </div>
            ))}
        </div>
    )
}
