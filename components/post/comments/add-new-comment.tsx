import { useAlert } from "@/components/provider/alert"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { usePostData } from ".."
import { MessageCircle, Plus } from "lucide-react"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { useEffect } from "react"
import axios from "axios"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { clearParams } from "../../../hooks/helper-function"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import AutoHeightTextarea from "@/components/ui/auto-height-textarea"
import SubmitCancelButton from "../submit-cancel-button"

interface AddNewCommentProps {
    isComment: boolean
    setIsComment: React.Dispatch<React.SetStateAction<boolean>>
}

export default function AddNewComment({
    isComment,
    setIsComment,
}: AddNewCommentProps) {
    const router = useRouter()
    const { post, setShowButton, showButton, comments } = usePostData()
    const { data: session } = useSession()

    // Handle new comment
    const formSchema = z.object({
        comment: z.string(),
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            comment: "",
        },
    })
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!values.comment.trim()) return // Prevent empty comments

        try {
            const comment = {
                author: session?.user.id, // In a real app, this would be the logged-in user
                postId: post!._id,
                content: values.comment.trim(),
                commentId: `comment-${comments?.length ?? 0}`,
            }
            const response = await axios.post("/api/comment", comment)

            if (response.status === 201) {
                setIsComment(false)
                clearParams("commenting")
                setTimeout(() => {
                    location.reload()
                }, 500)
            }
        } catch (error) {
            console.error("Failed to submit comment", error)
        }
    }

    // Handle cancel (remove the params as well)
    const handleCancel = () => {
        setIsComment(false)
        clearParams("commenting")
    }

    // detecting the url contains params ?commenting that used in callbackUrl to return to comment when user are unauthenticated initially
    const searchParams = useSearchParams()
    const commenting = searchParams.get("commenting")

    // if reroute after login show commenting and scroll to it
    useEffect(() => {
        if (commenting !== null && session?.user) {
            setIsComment(true)
        }
    }, [commenting, session, setIsComment])

    // Handle showing editor for comment if the user unauthenticated open dialog to login
    const alert = useAlert()
    const handleNewComment = () => {
        if (!session?.user) {
            alert.show({
                title: "Authentication Required",
                description: "Please log in to create a new comment.",
                cancel: "Cancel",
                action: "Log in",
                onAction: () => {
                    router.push(
                        `/auth/signin?callbackUrl=/post/${post?.postId}/${post?.slug}?commenting`
                    )
                },
            })
        } else {
            setIsComment(true)
        }
    }

    // hide elipsis button (more button) when adding new comment
    useEffect(() => {
        if (isComment) {
            setShowButton(false)
        } else {
            setShowButton(true)
        }
    }, [isComment, setShowButton])
    return (
        <>
            {isComment ? (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className={`relative glassmorphism bg-blue-700/50 p-4 mb-6`}
                    >
                        <div className='text-sm flex items-center gap-2 mb-3 min-w-0'>
                            <Avatar className='w-8 h-8'>
                                <AvatarImage
                                    src={session?.user.image ?? undefined}
                                />
                                <AvatarFallback className='bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium'>
                                    {session?.user.name
                                        ?.charAt(0)
                                        .toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col flex-1 min-w-0'>
                                <span className='text-white/80 text-xs'>
                                    Commenting as
                                </span>
                                <span className='truncate font-semibold text-white leading-relaxed'>
                                    {session?.user.name}
                                </span>
                            </div>
                        </div>
                        <FormField
                            control={form.control}
                            name='comment'
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
            ) : (
                <>
                    {showButton ? (
                        <div
                            onClick={handleNewComment}
                            className='w-full text-white glassmorphism bg-white/20 !rounded-full shadow py-3 mb-4 flex justify-center items-center gap-2 rounded-full border border-transparent cursor-pointer hover:bg-blue-600 hover:text-white hover:border-white/50 transition-colors duration-500'
                        >
                            {session?.user ? (
                                <>
                                    <Plus className='w-5 h-5' />
                                    Add a new comment
                                </>
                            ) : (
                                <>
                                    <MessageCircle className='w-5 h-5' />
                                    Join the conversation
                                </>
                            )}
                        </div>
                    ) : null}
                </>
            )}
        </>
    )
}
