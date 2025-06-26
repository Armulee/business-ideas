"use client"

import PostCard from "../post-card"
import { usePostData } from "."
import { IPostPopulated } from "@/database/Post"
import axios from "axios"
import useSWR from "swr"

const fetcher = (url: string) => axios.get(url).then((res) => res.data)

export default function RelatedPosts() {
    const { post, showButton } = usePostData()

    const { data: relatedPosts }: { data: IPostPopulated[] | null } = useSWR(
        `/api/posts/related/${post?._id}`,
        fetcher,
        { revalidateOnFocus: false, revalidateIfStale: false }
    )
    return (
        <div className='space-y-4 mt-4'>
            <h3 className='text-xl font-semibold text-white'>Related Posts</h3>
            {relatedPosts?.length
                ? relatedPosts.map((post, index) => (
                      <PostCard
                          key={`related-post-${index + 1}`}
                          post={post}
                          showMoreButton={showButton}
                      />
                  ))
                : null}
        </div>
    )
}
