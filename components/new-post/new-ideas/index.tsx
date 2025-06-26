"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Loading from "../../loading"
import PostTitle from "./post-titile"
import PostDescription from "./post-content"
import { zodResolver } from "@hookform/resolvers/zod"
import { formSchema, NewPostSchema, PostData } from "./types"
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import Widgets from "./widgets"
import { useWidgetForm } from "./provider"
import { Button } from "@/components/ui/button"
import axios from "axios"
import AdvancedSettings from "./advanced-settings"

export default function NewIdea() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    const { data: session, status } = useSession()

    // Initialize form with react-hook-form and zod validation
    const form = useForm<NewPostSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            category: "",
            content: "",
            tags: [],
            advancedSettings: {
                privacy: "public",
                allowComments: true,
                hideViewCount: false,
                hideVoteCount: false,
            },
        },
    })

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin?callbackUrl=/new-post/new-ideas")
        } else if (status === "authenticated") {
            setLoading(false)
        }
    }, [status, router])

    const [tags, setTags] = useState<string[]>([])
    const { widgets, summaries, pollData, callToComment } = useWidgetForm()
    const onSubmit = async (values: NewPostSchema) => {
        // setLoading(true)

        // Here you would typically send the data to your backend
        const postData: PostData = {
            author: session?.user.id,
            title: values.title,
            category: values.category,
            content: values.content,
            tags: tags,
            community: "new-ideas",
            advancedSettings: values.advancedSettings,
        }

        const widgetData = widgets
            .map((widget) => {
                if (widget.type === "summary") {
                    return { ...widget, data: summaries }
                }
                if (widget.type === "callToComment") {
                    return { ...widget, data: callToComment }
                }
                if (widget.type === "quickPoll") {
                    return { ...widget, data: pollData }
                }
                return widget
            })
            .filter(Boolean)

        if (widgetData.length > 0) {
            console.log(widgetData)
            postData.widgets = widgetData
        }

        try {
            const { data } = await axios.post("/api/post", postData)
            // After successful submission, redirect to the main page
            const { id, slug } = data
            router.push(`/post/${id}/${slug}`)
        } catch (err) {
            console.error((err as Error).message)
            setLoading(false)
        }
    }

    if (loading) {
        return <Loading />
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='relative'>
                <div className='flex flex-col md:flex-row gap-4'>
                    {/* Main content - left side on desktop, top on mobile */}
                    <div className='flex-1'>
                        <PostTitle control={form.control} />
                        <PostDescription
                            control={form.control}
                            tags={tags}
                            setTags={setTags}
                        />

                        {/* Widget and Related posts */}
                        <div className='md:hidden space-y-4'>
                            <Widgets />
                            <AdvancedSettings control={form.control} />
                        </div>
                        <div className='w-full flex justify-center items-center mt-4'>
                            <Button
                                type='submit'
                                className='w-52 text-white glassmorphism bg-transparent hover:bg-white hover:text-blue-800 mb-8'
                            >
                                Submit
                            </Button>
                        </div>
                    </div>

                    {/* Sidebar - right side on desktop, hidden on mobile */}
                    <div className='hidden md:block w-72'>
                        <div className='sticky'>
                            <div className='h-screen pb-28 overflow-y-scroll space-y-4'>
                                <Widgets />
                                <AdvancedSettings control={form.control} />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    )
}
