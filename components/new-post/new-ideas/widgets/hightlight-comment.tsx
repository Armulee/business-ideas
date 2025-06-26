"use client"
import { Star, ThumbsUp } from "lucide-react"
import type React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import WidgetBase from "./base"

interface HighlightCommentWidgetProps {
    id: string
    onRemove: () => void
    dragAttributes?: React.HTMLAttributes<HTMLDivElement>
    isDragging?: boolean
}

export default function HighlightCommentWidget({
    id,
    onRemove,
    dragAttributes,
    isDragging,
}: HighlightCommentWidgetProps) {
    // Mock comment data - in a real app, this would come from your API
    const commentData = {
        author: {
            name: "Alex Johnson",
            avatar: "/placeholder.svg?height=50&width=50",
        },
        content:
            "This is a fantastic idea! I've been looking for something like this. Have you considered integrating with online retailers for direct purchases?",
        postTitle: "AI-Powered Personal Stylist",
        upvotes: 24,
        date: "2 days ago",
    }

    return (
        <WidgetBase
            id={id}
            title='Highlighted Comment'
            onRemove={onRemove}
            allowEdit={true}
            dragAttributes={dragAttributes}
            isDragging={isDragging}
        >
            <div className='bg-white/5 rounded-lg p-4 border border-white/10'>
                <div className='flex items-start space-x-3'>
                    <Avatar className='h-10 w-10'>
                        <AvatarImage
                            src={commentData.author.avatar}
                            alt={commentData.author.name}
                        />
                        <AvatarFallback>
                            {commentData.author.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>

                    <div className='flex-1 min-w-0'>
                        <div className='flex items-center mb-1'>
                            <span className='font-medium text-white'>
                                {commentData.author.name}
                            </span>
                            <div className='ml-2 px-1.5 py-0.5 bg-blue-500/20 rounded text-xs text-blue-300 flex items-center'>
                                <Star className='h-3 w-3 mr-1' />
                                Featured
                            </div>
                        </div>

                        <p className='text-white/80 text-sm'>
                            {commentData.content}
                        </p>

                        <div className='mt-2 flex items-center justify-between text-xs'>
                            <span className='text-white/50'>
                                On: {commentData.postTitle}
                            </span>
                            <div className='flex items-center space-x-3'>
                                <span className='text-white/50'>
                                    {commentData.date}
                                </span>
                                <div className='flex items-center text-white/70'>
                                    <ThumbsUp className='h-3 w-3 mr-1' />
                                    <span>{commentData.upvotes}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </WidgetBase>
    )
}
