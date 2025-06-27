"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PostsList from "./posts-list"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import CommentList from "./comment-list"
import VoteList from "./vote-list"
import { useProfile } from "."

export default function ProfileTabs() {
    const { profile } = useProfile()
    const searchParams = useSearchParams()
    const { data: session } = useSession()

    // Get current tab from URL, fallback to "posts"
    const tab = searchParams.get("tab") ?? "posts"
    const [activeTab, setActiveTab] = useState<string>(tab)

    // Update state when URL changes (e.g., back/forward navigation)
    useEffect(() => {
        setActiveTab(tab)
    }, [tab])

    // Function to update the query param on tab change
    const handleTabChange = (value: string) => {
        setActiveTab(value)

        // Update the URL bar without navigating
        const url = new URL(window.location.href)
        url.searchParams.set("tab", value)
        window.history.replaceState(null, "", url.toString())
    }

    return (
        <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className='w-full mb-6'
        >
            <TabsList className='bg-white/10 text-white grid grid-cols-3 h-full gap-y-2 mb-8'>
                <TabsTrigger value='posts'>Posts</TabsTrigger>
                <TabsTrigger value='reposts'>Repost</TabsTrigger>
                <TabsTrigger value='comments'>Comments</TabsTrigger>
                {profile._id.toString() === session?.user.id ? (
                    <>
                        <TabsTrigger value='upvotes'>Upvotes</TabsTrigger>
                        <TabsTrigger value='downvotes'>Downvotes</TabsTrigger>
                        <TabsTrigger value='saved'>Saved</TabsTrigger>
                    </>
                ) : null}
            </TabsList>

            <TabsContent value='posts'>
                <PostsList type='posts' />
            </TabsContent>

            <TabsContent value='reposts'>
                <PostsList type='reposts' />
            </TabsContent>

            <TabsContent value='comments'>
                <CommentList />
            </TabsContent>

            <TabsContent value='upvotes'>
                <VoteList type='upvotes' />
            </TabsContent>

            <TabsContent value='downvotes'>
                <VoteList type='downvotes' />
            </TabsContent>

            <TabsContent value='saved'>
                <PostsList type='bookmarks' />
            </TabsContent>
        </Tabs>
    )
}
