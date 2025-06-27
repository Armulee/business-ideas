import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { IPost } from "@/database/Post"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Schema } from "mongoose"
import { useSession } from "next-auth/react"
import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ReplyTo } from "../comments/comment"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import AutoHeightTextarea from "@/components/ui/auto-height-textarea"
import SubmitCancelButton from "../submit-cancel-button"
import clearParams from "@/lib/clear-params"

interface ReplyBoxProps {
    isReply: boolean
    setIsReply: React.Dispatch<React.SetStateAction<boolean>>
    comment: Schema.Types.ObjectId
    replyId: string
    postId: IPost
    replyTo: ReplyTo
    setReplyTo: React.Dispatch<React.SetStateAction<ReplyTo>>
    setIsReplyingComment: React.Dispatch<React.SetStateAction<boolean>>
}
export default function ReplyBox({
    isReply,
    setIsReply,
    comment,
    replyId,
    postId,
    replyTo,
    setReplyTo,
    setIsReplyingComment,
}: ReplyBoxProps) {
    const { data: session } = useSession()

    // Handle new reply
    const formSchema = z.object({
        reply: z.string(),
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            reply: "",
        },
    })
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!values.reply.trim()) return // Prevent empty comment update

        try {
            const response = await axios.post("/api/reply", {
                content: values.reply.trim(),
                authorId: session?.user.id,
                comment,
                postId,
                replyTo,
                replyId,
            })

            if (response.status === 201) {
                setIsReply(false) // Exit edit mode
                clearParams("reply")
                setTimeout(() => location.reload(), 400)
            } else {
                console.error("Failed to update comment")
            }
        } catch (error) {
            console.error("Error updating comment:", error)
        }
    }

    // handle cancel
    const handleCancel = () => {
        setIsReply(false)
        setReplyTo(null)
        setIsReplyingComment(false)
        clearParams("reply")
    }

    // scroll to editor when user focusing to reply and the reply is shown
    const replyEditor = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (isReply) {
            setTimeout(() => {
                replyEditor.current?.scrollIntoView({
                    behavior: "smooth",
                })
            }, 100)
        }
    }, [isReply])

    // when click on the reply to section, scroll to replying target
    const scrollToReplyingTarget = () => {
        const element = document.getElementById(replyTo?.id ?? "")
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" })
        }
    }

    return (
        <div
            className={`ml-6 mb-8 text-white glassmorphism bg-blue-700/50 p-3 rounded-md my-3 relative`}
        >
            {/* VERTICAL LINE */}
            <div
                style={{ height: `50%` }}
                className={`absolute -left-4 top-0 bottom-0 w-[1px] bg-white/50`}
            />

            {/* HORIZONTAL LINE */}
            <div className='absolute -left-[1px] top-1/2 w-[calc(1rem-1px)] h-[1px] transform -translate-x-full bg-white/50' />

            {/* REPLYING TO  */}
            <div className='flex justify-between items-center gap-3'>
                <div
                    className='flex items-center gap-2 mb-3 cursor-pointer group min-w-0'
                    onClick={scrollToReplyingTarget}
                >
                    <Avatar className='h-8 w-8'>
                        <AvatarImage
                            src={session?.user.image ?? undefined}
                            alt={session?.user.name ?? undefined}
                        />
                        <AvatarFallback>
                            {session?.user.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col flex-1 min-w-0'>
                        <span className='truncate text-xs text-white/80 group-hover:text-white transition duration-300'>
                            Commenting as
                        </span>
                        <span className='truncate text-white text-sm font-semibold group-hover:text-white transition duration-300'>
                            {session?.user.name}
                        </span>
                    </div>
                </div>
                {replyTo ? (
                    <div
                        className='flex items-center gap-2 mb-3 cursor-pointer group min-w-0'
                        onClick={scrollToReplyingTarget}
                    >
                        <Avatar className='h-8 w-8'>
                            <AvatarImage
                                src={replyTo.avatar}
                                alt={replyTo.name}
                            />
                            <AvatarFallback>
                                {replyTo.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col flex-1 min-w-0'>
                            <span className='truncate text-xs text-white/80 group-hover:text-white transition duration-300'>
                                Replying to
                            </span>
                            <span className='truncate text-white text-sm font-semibold group-hover:text-white transition duration-300'>
                                {replyTo.name}
                            </span>
                        </div>
                    </div>
                ) : null}
            </div>

            {/* EDITOR */}
            <div ref={replyEditor} style={{ scrollMarginTop: "280px" }}>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='relative'
                    >
                        <FormField
                            control={form.control}
                            name='reply'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <AutoHeightTextarea
                                            {...field}
                                            placeholder='Write a comment...'
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <SubmitCancelButton handleCancel={handleCancel} />
                    </form>
                </Form>
            </div>
        </div>
    )
}
