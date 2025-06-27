import { Bookmark, BookmarkCheck, Check, Repeat2, Share } from "lucide-react"
import {
    PiArrowFatDown,
    PiArrowFatDownFill,
    PiArrowFatUp,
    PiArrowFatUpFill,
} from "react-icons/pi"
import { usePostData } from "."
import axios from "axios"
import { useSession } from "next-auth/react"
import { useAlert } from "../provider/alert"
import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { Schema } from "mongoose"
import { EngagementMap } from "./types"

type Interaction = "upvote" | "downvote" | "bookmark" | "repost"

interface EngagementsProps {
    target: Schema.Types.ObjectId | undefined
    votes: number
    recipient: Schema.Types.ObjectId | undefined
    engagements?: EngagementMap
    hideBookmark?: boolean
    hideRepost?: boolean
    hideShare?: boolean
    targetType: "Post" | "Comment" | "Reply"
}

export default function Engagements({
    target,
    recipient,
    votes,
    engagements,
    targetType,
}: EngagementsProps) {
    const router = useRouter()
    const { data: session } = useSession()
    const { post } = usePostData()
    const alert = useAlert()

    // make a vote can be upvote or downvote
    const handleInteraction = useCallback(
        async (type: Interaction) => {
            if (session?.user) {
                try {
                    await axios.post("/api/activities/post-new-engage", {
                        actor: session.user.id,
                        recipient,
                        target,
                        targetType,
                        type,
                    })

                    window.location.reload()
                } catch (err) {
                    console.error(err)
                }
            } else {
                alert.show({
                    title: "Authentication Required",
                    description:
                        "Please log in before engaging any engagement.",
                    cancel: "Cancel",
                    action: "Log in",
                    onAction: () => {
                        router.push(
                            `/auth/signin?callbackUrl=/post/${post?.postId}/${post?.slug}?${type}=Post`
                        )
                    },
                })
            }
        },
        [alert, post, router, session, targetType, target, recipient]
    )

    // // detect whether user has upvoted, downvoted, bookmarked or reposted to this post before
    // useEffect(() => {
    //     if (status === "authenticated") {
    //         const fetchActivitiesStatus = async () => {
    //             try {
    //                 const { data } = await axios.get(
    //                     `/api/activities/post/get-engage?targetId=${post?._id}&userId=${session.user.id}`
    //                 )

    //                 setUpvoted(Boolean(data.upvote))
    //                 setDownvoted(Boolean(data.downvote))
    //                 setBookmarked(Boolean(data.bookmark))
    //                 setReposted(Boolean(data.repost))

    //                 // Automatically vote if URL has ?upvote=Post or ?downvote=Post
    //                 const urlUpvote = searchParams.get("upvote")
    //                 const urlDownvote = searchParams.get("downvote")
    //                 const urlBookmark = searchParams.get("bookmark")
    //                 const urlRepost = searchParams.get("repost")

    //                 if (urlUpvote === "Post" && !data.upvote) {
    //                     await handleInteraction("upvote")
    //                     clearParams("upvote")
    //                 } else if (urlDownvote === "Post" && !data.downvote) {
    //                     await handleInteraction("downvote")
    //                     clearParams("downvote")
    //                 } else if (urlBookmark === "Post" && !data.bookmark) {
    //                     await handleInteraction("bookmark")
    //                     clearParams("bookmark")
    //                 } else if (urlRepost === "Post" && !data.repost) {
    //                     await handleInteraction("repost")
    //                     clearParams("repost")
    //                 }
    //             } catch {
    //                 toast("Cannot get the activities history from this user", {
    //                     description:
    //                         "Unexpected Error in fetching user's engagements history on this post",
    //                 })
    //             }
    //         }

    //         fetchActivitiesStatus()
    //     }
    // }, [status, post, session, searchParams, handleInteraction])

    return (
        <div className='flex items-center gap-6 text-xs mb-2'>
            <div className={`flex items-center ${votes ? "gap-3" : "gap-6"}`}>
                {engagements?.upvote ? (
                    <PiArrowFatUpFill
                        onClick={() => handleInteraction("upvote")}
                        className='w-5 h-5 text-blue-400 hover:text-white transition-colors duration-300 ease cursor-pointer'
                    />
                ) : (
                    <PiArrowFatUp
                        onClick={() => handleInteraction("upvote")}
                        className='w-5 h-5 text-white hover:text-blue-400 transition-colors duration-300 ease cursor-pointer'
                    />
                )}
                {votes && !post?.advancedSettings?.hideVoteCount ? votes : ""}
                {engagements?.downvote ? (
                    <PiArrowFatDownFill
                        onClick={() => handleInteraction("downvote")}
                        className='w-5 h-5 text-red-400 hover:text-white transition-colors duration-300 ease cursor-pointer'
                    />
                ) : (
                    <PiArrowFatDown
                        onClick={() => handleInteraction("downvote")}
                        className='w-5 h-5 text-white hover:text-red-400 transition-colors duration-300 ease cursor-pointer'
                    />
                )}
            </div>

            {targetType === "Post" && (
                <div className='flex items-center gap-3'>
                    {engagements?.bookmark ? (
                        <BookmarkCheck
                            size={18}
                            onClick={() => handleInteraction("bookmark")}
                            className='text-yellow-400 hover:text-white transition duration-300 cursor-pointer'
                        />
                    ) : (
                        <Bookmark
                            size={18}
                            onClick={() => handleInteraction("bookmark")}
                            className='text-white hover:text-yellow-400 transition duration-300 cursor-pointer'
                        />
                    )}
                    {post?.bookmarkCount ? post.bookmarkCount : ""}
                </div>
            )}

            {targetType === "Post" && (
                <div className='flex items-center gap-3'>
                    {engagements?.repost ? (
                        <div className='relative'>
                            <Check
                                size={8}
                                className='text-green-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                            />
                            <Repeat2
                                size={20}
                                onClick={() => handleInteraction("repost")}
                                className='text-green-400 hover:text-white transition duration-300 cursor-pointer'
                            />
                        </div>
                    ) : (
                        <Repeat2
                            size={20}
                            onClick={() => handleInteraction("repost")}
                            className='text-white hover:text-green-400 transition duration-300 cursor-pointer'
                        />
                    )}
                    {post?.repostCount ? post.repostCount : ""}
                </div>
            )}

            {targetType === "Post" && (
                <Share
                    size={20}
                    className='h-4 w-4 hover:text-purple-400 transition duration-300 cursor-pointer'
                />
            )}
        </div>
    )
}
