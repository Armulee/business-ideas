"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import CommentSection from "./comments"
import PostTitle from "./title"
import PostContent from "./content"
import RelatedPosts from "./related-posts"
import axios from "axios"
// import Widgets from "./widgets"
import useSWR from "swr"
import { PostData, PostDataContextType } from "./types"
import { PostSkeleton } from "../skeletons"
import { getPost, getRawComments } from "./utils"
import { notFound } from "next/navigation"

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

const PostDataContext = createContext<PostDataContextType | null>(null)
export const usePostData = () =>
    useContext(PostDataContext) as PostDataContextType

const Post = ({ id, slug }: { id?: string; slug?: string }) => {
    const [post, setPostData] = useState<PostData["post"] | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [commentsLoaded, setCommentsLoaded] = useState(false)
    const [comments, setComments] = useState<PostData["comments"]>([])
    const [replies, setReplies] = useState<PostData["replies"]>({})
    const { data: session, status } = useSession()
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [showButton, setShowButton] = useState<boolean>(true)

    // Fetch post data if id and slug are provided
    useEffect(() => {
        if (id && slug && !post) {
            getPost(id, slug)
                .then((data) => setPostData(data))
                .catch(() => setError(true))
                .finally(() => setLoading(false))
        }
    }, [id, slug, post])

    // // Use initial data if provided, otherwise use fetched data
    // const { post, comments, replies } = {
    //     post: postData,
    //     ...commentsData,
    // }

    // Load comments and replies separately if we have initial data but no comments
    useEffect(() => {
        if (post && id && !commentsLoaded && !comments) {
            getRawComments(id)
                .then(({ comments, replies }) => {
                    setComments(comments)
                    setReplies(replies)
                })
                .catch((error) => {
                    console.error("Failed to load comments:", error)
                    setCommentsLoaded(true) // Set to true even on error to prevent retry}
                })
        }
    }, [post, id, commentsLoaded, comments])

    // update view count on page load
    useEffect(() => {
        try {
            async function updateView() {
                if (post?._id) {
                    await axios.patch("/api/post/views", { postId: post._id })
                }
            }

            const delay = setTimeout(() => {
                updateView()
            }, 100)
            return () => clearTimeout(delay)
        } catch (error) {
            console.error("Failed to update view count:", error)
        }
    }, [post])

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
        post: post || undefined,
        comments,
        replies,
        engagements,
        isEditing,
        setIsEditing,
        showButton,
        setShowButton,
    }

    // handle loading state
    if (loading) {
        return <PostSkeleton />
    }

    // handle post not found
    if (error) {
        return notFound()
    }

    // handle no post data
    if (!post && !loading) {
        return (
            <div className='flex flex-col items-center justify-center min-h-screen'>
                <p className='text-white text-center'>Post not found</p>
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
                            {/* <Widgets /> */}
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
                                {/* <Widgets /> */}
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
