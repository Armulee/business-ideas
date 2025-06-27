"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import CommentSection from "./comments"
import PostTitle from "./title"
import PostContent from "./content"
import RelatedPosts from "./related-posts"
import axios from "axios"
import Widgets from "./widgets"
import { EngagementMap } from "./engagements"
import { PostData } from "@/app/post/[id]/[slug]/page"
import useSWR from "swr"

type Engagements = {
    post: EngagementMap
    comments: Record<string, EngagementMap>
    replies: Record<string, EngagementMap>
} | null

const fetchEngagements = (
    url: string,
    postId: string,
    userId: string,
    commentIds: string[],
    replyIds: string[]
) =>
    axios
        .post(url, {
            postId,
            userId,
            commentIds,
            replyIds,
        })
        .then((res) => res.data)

interface IPostDataContext extends PostData {
    engagements: Engagements
    isEditing: boolean
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
    showButton: boolean
    setShowButton: React.Dispatch<React.SetStateAction<boolean>>
}

const PostDataContext = createContext<IPostDataContext | null>(null)

export const usePostData = () => useContext(PostDataContext) as IPostDataContext

const Post = ({
    data,
    error,
    correctSlug,
}: {
    data?: PostData
    error?: string
    correctSlug?: string
}) => {
    console.log(data)
    const router = useRouter()
    const { post, comments, replies, widgets, profile } = data || {}
    const { data: session, status } = useSession()

    // description editing
    const [isEditing, setIsEditing] = useState<boolean>(false)

    // Redirect if the slug is incorrect
    useEffect(() => {
        if (correctSlug) {
            router.replace(correctSlug)
        }
    }, [correctSlug, router])

    // update view count on page load
    useEffect(() => {
        if (data && !correctSlug) {
            async function updateView() {
                await axios.patch("/api/post/views", { postId: post?._id })
            }

            const delay = setTimeout(() => {
                updateView()
            }, 100)
            return () => clearTimeout(delay)
        }
    }, [data, correctSlug, post])

    // when user editing or try to commenting on new comment or reply, hide the elipsis (more) buttons
    const [showButton, setShowButton] = useState<boolean>(true)

    // Fetch engagements using SWR (only fetch once you’re authenticated and have a post)
    const commentIds = comments?.map((c) => c._id.toString()) ?? []
    const replyIds =
        comments?.flatMap(
            (c) =>
                replies?.[c._id.toString()]?.map((r) => r._id.toString()) ?? []
        ) ?? []
    const shouldFetch = status === "authenticated" && !!post
    const { data: engagements, error: engagementError } = useSWR(
        shouldFetch
            ? [
                  "/api/activities/get-post-engage",
                  post?._id.toString(),
                  session?.user.id,
                  commentIds,
                  replyIds,
              ]
            : null,
        ([url, postId, userId, commentIds, replyIds]) =>
            fetchEngagements(url, postId, userId, commentIds, replyIds),
        {
            revalidateOnFocus: false, // ← prevents refetch on tab focus
            revalidateIfStale: false, // optional, only fetch once
            dedupingInterval: 60000, // optional, skip dupes for 60s
        }
    )

    // values for the provider
    const value = {
        post,
        comments,
        replies,
        widgets,
        profile,
        engagements,
        isEditing,
        setIsEditing,
        showButton,
        setShowButton,
    }

    // handle post not found
    if (error) {
        return (
            <div className='flex flex-col items-center justify-center min-h-screen'>
                <p className='text-white text-center'>{error}</p>
            </div>
        )
    }

    if (engagementError)
        console.error("Engagements load failed", engagementError)

    return (
        <PostDataContext.Provider value={value}>
            <section className='min-h-screen pt-20 pb-32 px-4 max-w-7xl mx-auto'>
                <div className='flex flex-col md:flex-row gap-4'>
                    {/* Main content - left side on desktop, top on mobile */}
                    <main className='flex-1'>
                        <PostTitle />
                        <PostContent />

                        {/* only on mobile, above comments */}
                        <div className='my-6 md:hidden'>
                            {/* <Author /> */}
                            <Widgets />
                        </div>

                        <CommentSection />

                        <div className='mt-6 md:hidden'>
                            <RelatedPosts />
                        </div>
                    </main>

                    {/* Sidebar - right side on desktop, hidden on mobile */}
                    <aside className='hidden md:block w-72'>
                        <div className='sticky top-20'>
                            <div className='h-screen pb-28 overflow-y-scroll'>
                                {/* <Author /> */}
                                <Widgets />
                                <RelatedPosts />
                            </div>
                        </div>
                    </aside>
                    {/* <div className='hidden md:block w-72 h-[calc(100vh-80px)] relative'>
                        <div className='fixed top-20 right-4 w-72 h-[calc(100vh-80px)] pb-32 overflow-y-scroll'>
                            <Widgets />
                            <RelatedPosts />
                        </div>
                    </div> */}
                </div>
            </section>
        </PostDataContext.Provider>
    )
}

export default Post
