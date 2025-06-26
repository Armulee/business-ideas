"use client"

import Link from "next/link"
import { Clock, CornerLeftUp, MessageSquare } from "lucide-react"
import { formatDate } from "@/utils/format-date"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useProfile } from "./provider"

export default function CommentList() {
    const { activities } = useProfile()
    const { comments, replies } = activities.discusses

    // Merge comments + replies with a type tag
    const items = [
        ...comments.map((c) => ({ ...c, type: "comment" as const })),
        ...replies.map((r) => ({ ...r, type: "reply" as const })),
    ]

    // Sort newest-first
    items.sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    if (items.length === 0) {
        return (
            <div className='text-center py-12 text-gray-300'>
                <p className='text-xl'>No comments to display</p>
            </div>
        )
    }

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            {items.map((item) => {
                const isComment = item.type === "comment"
                const iconBg = isComment ? "bg-blue-500/20" : "bg-green-500/20"
                const labelColor = isComment
                    ? "text-blue-300"
                    : "text-green-300"
                const labelText = isComment ? "Comment" : "Reply to"

                return (
                    <Link
                        key={item._id.toString()}
                        href={item.postLink}
                        className='group no-underline'
                    >
                        <div className='h-full relative overflow-hidden glassmorphism p-3 transition-all duration-300 group-hover:shadow-lg group-hover:border-white/20'>
                            <div className='flex items-center gap-3'>
                                <div
                                    className={`flex items-center justify-center w-8 h-8 rounded-full ${iconBg} flex-shrink-0`}
                                >
                                    {isComment ? (
                                        <MessageSquare className='h-4 w-4 text-blue-300' />
                                    ) : (
                                        <CornerLeftUp className='h-4 w-4 text-green-300' />
                                    )}
                                </div>

                                <div className='flex-1 min-w-0'>
                                    <div className='flex items-center gap-1 mb-2'>
                                        <span
                                            className={`text-xs font-medium ${labelColor}`}
                                        >
                                            {labelText}
                                        </span>
                                        {!isComment && (
                                            <div className='flex items-center gap-1 text-xs glassmorphism bg-blue-700/50 px-2 py-1'>
                                                <Avatar className='h-4 w-4'>
                                                    <AvatarImage
                                                        src={item.author.avatar}
                                                    />
                                                    <AvatarFallback>
                                                        {item.author.name.charAt(
                                                            0
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className='text-white truncate'>
                                                    {item.author.name}
                                                </span>
                                            </div>
                                        )}
                                        <span className='text-xs text-white/60 flex items-center'>
                                            <Clock className='h-3 w-3 mr-1' />
                                            {formatDate(item.createdAt)}
                                        </span>
                                    </div>

                                    <div className='truncate text-sm text-white/90 flex flex-1 glassmorphism bg-blue-900/40 px-3 py-1'>
                                        {item.content}
                                    </div>

                                    <p className='text-xs mt-2 flex flex-1 gap-1'>
                                        on{" "}
                                        <span className='truncate text-blue-300 group-hover:underline transition-all'>
                                            {item.post.title}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}
