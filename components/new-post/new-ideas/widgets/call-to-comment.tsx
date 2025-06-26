"use client"

import type React from "react"
import { MessageCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import WidgetBase from "./base"
import { Input } from "@/components/ui/input"
import WidgetTab from "./tab"
import { useWidgetForm } from "../provider"

interface CallToCommentWidgetProps {
    id: string
    onRemove: () => void
    dragAttributes?: React.HTMLAttributes<HTMLDivElement>
    isDragging?: boolean
}

export default function CallToCommentWidget({
    id,
    onRemove,
    dragAttributes,
    isDragging,
}: CallToCommentWidgetProps) {
    const { callToComment, setCallToComment } = useWidgetForm()
    return (
        <WidgetBase
            id={id}
            title='Join the Conversation'
            onRemove={onRemove}
            dragAttributes={dragAttributes}
            isDragging={isDragging}
        >
            <WidgetTab>Quick Comment</WidgetTab>
            <div className='space-y-3'>
                <div className='bg-gradient-to-r from-blue-600/20 to-blue-400/20 rounded-lg p-3 flex items-start'>
                    <MessageCircle className='h-5 w-5 mt-1 text-blue-400 mr-3 flex-shrink-0' />
                    <div className='w-full'>
                        <Input
                            required
                            name='callToComment'
                            className='w-full text-sm glassmorphism placeholder:text-white/50'
                            placeholder='Enter your call to comment'
                            value={callToComment}
                            onChange={(e) => setCallToComment(e.target.value)}
                        />
                        <span className='text-xs'>
                            Example: Share your thoughts on this idea!
                        </span>
                    </div>
                </div>

                <Textarea
                    disabled
                    placeholder='Write your comment...'
                    className='bg-white/5 border-white/20 text-white focus:border-blue-500 min-h-[80px] resize-none placeholder:text-white/50'
                />

                <div className='flex justify-end'>
                    <Button
                        disabled
                        className='bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white'
                    >
                        <Send className='h-4 w-4 mr-2' />
                        Post Comment
                    </Button>
                </div>
            </div>
        </WidgetBase>
    )
}
