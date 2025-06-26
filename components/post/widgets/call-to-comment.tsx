import { useState } from "react"
import WidgetBase from "./base"
import { MessageCircle, Send } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function CallToCommentWidget({ data }: { data: string }) {
    const [comment, setComment] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // In a real app, you would submit the comment to your API
        console.log("Comment submitted:", comment)
        setComment("")
    }

    return (
        <WidgetBase>
            <div className='flex items-center gap-2 mb-3 bg-white/20 absolute top-0 left-0 w-full px-4 py-2'>
                <MessageCircle className='w-4 h-4' />
                <span className='text-sm font-bold'>Quick Comment</span>
            </div>

            <div className='space-y-3'>
                <div className='bg-gradient-to-r from-blue-600/20 to-blue-400/20 rounded-lg p-3 flex items-center'>
                    <MessageCircle className='h-5 w-5 text-blue-400 mr-3 flex-shrink-0' />
                    <p className='text-white/80 text-sm'>{data}</p>
                </div>

                <form onSubmit={handleSubmit} className='space-y-3'>
                    <Textarea
                        placeholder='Write your comment...'
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className='bg-white/5 border-white/20 text-white focus:border-blue-500 min-h-[80px] resize-none placeholder:text-white/50'
                    />

                    <div className='flex justify-end'>
                        <Button
                            type='submit'
                            disabled={!comment.trim()}
                            className='bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white'
                        >
                            <Send className='h-4 w-4 mr-2' />
                            Post Comment
                        </Button>
                    </div>
                </form>
            </div>
        </WidgetBase>
    )
}
