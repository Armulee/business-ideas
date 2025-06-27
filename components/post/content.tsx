import { usePostData } from "."
import parse from "html-react-parser"
import axios from "axios"
import { formatDate } from "@/utils/format-date"
import { RichTextEditor } from "../rich-text-editor"
import { Form, FormControl, FormField, FormItem } from "../ui/form"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

import Engagements, { EngagementMap } from "./engagements"
import SubmitCancelButton from "./submit-cancel-button"
import clearParams from "@/lib/clear-params"

const PostContent = () => {
    const { post, engagements, isEditing, setIsEditing } = usePostData()
    const content = parse(post?.content ?? "")

    const { data: session, status } = useSession()
    const permission = session?.user.id === post?.author?._id.toString()
    // if url contains editing params, turn on editing mode automatically
    const router = useRouter()
    const searchParams = useSearchParams()
    const editing = searchParams.get("editing")
    const toastFired = useRef(false)
    useEffect(() => {
        // 1) Nothing to do if no ?editing
        if (editing === null) return
        // 2) Wait until NextAuth finishes loading
        if (status === "loading") return

        // === NOT LOGGED IN ===
        if (!session && status === "unauthenticated") {
            if (!toastFired.current) {
                toast("Invalid parameters", {
                    description:
                        "You must be logged in to use this access. Please log in first.",
                    action: {
                        label: "Login",
                        onClick: () =>
                            router.push(
                                `/auth/signin?callbackUrl=${encodeURIComponent(
                                    `/post/${post?.postId}/${post?.slug}?editing`
                                )}`
                            ),
                    },
                })
                toastFired.current = true
                clearParams("editing")
            }
            return
        }

        // === LOGGED IN BUT NO PERMISSION ===
        if (session && !permission) {
            if (!toastFired.current) {
                toast("Access denied", {
                    description:
                        "You don’t have permission to edit this post. Please don’t try to modify others’ content.",
                })
                toastFired.current = true
                clearParams("editing")
            }
            return
        }

        // === AUTHORIZED: turn on edit mode ===
        setIsEditing(true)
    }, [
        editing,
        status,
        session,
        permission,
        post,
        router,
        searchParams,
        setIsEditing,
    ])

    // Handle Editing
    const formSchema = z.object({
        content: z
            .string()
            .min(20, {
                message: "Description must be at least 20 characters.",
            })
            .max(5000, {
                message: "Description must not exceed 5000 characters.",
            }),
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: "",
        },
    })
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!values.content.trim()) return // Prevent empty comment update

        try {
            const response = await axios.patch("/api/post", {
                id: post!._id,
                content: values.content.trim(),
            })

            if (response.status === 200) {
                setTimeout(() => {
                    setIsEditing(false) // Exit edit mode
                    location.reload()
                }, 400)
            } else {
                console.error("Failed to update comment")
            }
        } catch (error) {
            console.error("Error updating comment:", error)
        }
    }
    const handleCancel = () => {
        setIsEditing(false)
        clearParams("editing")
    }

    return (
        <div
            className={`glassmorphism ${
                isEditing ? "p-4 bg-blue-700/50" : " bg-transparent p-6"
            } mb-6`}
        >
            {isEditing ? (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='relative'
                    >
                        <FormField
                            control={form.control}
                            name='content'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <RichTextEditor
                                            defaultValue={post?.content}
                                            onChange={field.onChange}
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
                    <div className='w-full tiptap flex justify-start items-start gap-4 mb-4'>
                        <div className='max-w-full'>{content}</div>
                    </div>

                    {post?.tags?.length ? (
                        <ul className='flex flex-wrap gap-3 mt-2 mb-4'>
                            {post.tags.map((tag, index) => (
                                <li
                                    key={`tag-${index}`}
                                    className='glassmorphism bg-transparent text-white px-4 py-2 rounded-full text-xs cursor-pointer whitespace-nowrap inline-block'
                                >
                                    {tag}
                                </li>
                            ))}
                        </ul>
                    ) : null}

                    <Engagements
                        target={post?._id}
                        targetType='Post'
                        recipient={post?.author?._id}
                        engagements={engagements?.post as EngagementMap}
                        votes={
                            (post?.upvoteCount ?? 0) -
                            (post?.downvoteCount ?? 0)
                        }
                    />

                    {post?.updatedAt ? (
                        <span className='text-xs text-gray-300/50'>
                            (Modified {formatDate(post?.updatedAt)})
                        </span>
                    ) : null}
                </>
            )}
        </div>
    )
}

export default PostContent
