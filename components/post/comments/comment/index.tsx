"use client"

import { formatDate } from "@/utils/format-date"
import CommentOptions from "./options"
import { useEffect, useState } from "react"
import ReplySection from "../../replies"
import { usePostData } from "../.."
import { ICommentPopulated } from "@/database/Comment"
import Author from "./author"
// import Engagements from "./engagements"
import Editor from "./editor"
import ShowReplies from "./show-replies"
import { useAlert } from "@/components/provider/alert"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TbMessageCircle } from "react-icons/tb"
import Engagements from "../../engagements"
import { clearParams } from "@/hooks/helper-function"

interface CommentProps {
    commentId: string
    comment: ICommentPopulated
}

export type ReplyTo = {
    name: string
    avatar: string
    id: string
} | null

const Comment = ({ commentId, comment }: CommentProps) => {
    const router = useRouter()
    const { data: session } = useSession()
    const {
        post,
        replies: allReplies,
        engagements,
        showButton,
        setShowButton,
    } = usePostData()
    const replies = allReplies?.[comment._id.toString()]

    // show editor for reply
    const [isReply, setIsReply] = useState<boolean>(false)

    // Show editing editor
    const [isEditing, setIsEditing] = useState<boolean>(false)

    // Show all replies in this comment
    const [showReplies, setShowReplies] = useState<boolean>(false)

    // Show who the user is replying to
    const [isReplyingComment, setIsReplyingComment] = useState<boolean>(false)
    const [replyTo, setReplyTo] = useState<ReplyTo>(null)

    // handle reply
    const alert = useAlert()
    const handleReply = () => {
        if (!session?.user) {
            alert.show({
                title: "Authentication Required",
                description: "Please log in before replying any comment.",
                cancel: "Cancel",
                action: "Log in",
                onAction: () => {
                    router.push(
                        `/auth/signin?callbackUrl=/post/${post?.postId}/${post?.slug}?reply=${commentId}`
                    )
                },
            })
        } else {
            setIsReply((prev) => !prev)
            setIsReplyingComment(true)

            if (replies?.length) {
                setShowReplies(true)
            }
        }
    }

    // if replying or editing comment, hide add new comment button and elipsis button (more button) when editing comment
    useEffect(() => {
        if (isEditing || isReply) {
            setShowButton(false)
        } else {
            setShowButton(true)
        }
    }, [isEditing, isReply, setShowButton])

    // scroll the replied target when user click the Replied to on the reply box
    const scrollToCommentId = (id: string) => {
        const target = document.getElementById(id)
        if (!target) return
        target.scrollIntoView({ behavior: "smooth", block: "start" })

        target.classList.add("!bg-blue-700")

        setTimeout(() => {
            target.classList.remove("!bg-blue-700")
            clearParams("comment")
        }, 2000)
    }

    // (FOR CASE COMMENT) if detect the params ?comment=id from url slide that comment
    const searchParams = useSearchParams()
    const commentParam = searchParams.get("comment")
    useEffect(() => {
        if (commentParam === commentId) {
            scrollToCommentId(commentId)
        }
    }, [commentId, commentParam])
    return (
        <>
            <div
                id={commentId}
                style={{ scrollMarginTop: "80px" }}
                className={`glassmorphism ${
                    isEditing || isReplyingComment
                        ? "bg-blue-700/50 p-4"
                        : "bg-transparent p-6"
                } mb-4 transition duration-500 ease-in`}
            >
                {isEditing ? null : (
                    <CommentOptions
                        comment={comment}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                    />
                )}

                <Author comment={comment} />

                {isEditing ? (
                    <Editor
                        commentId={comment._id}
                        setIsEditing={setIsEditing}
                        defaultValue={comment.content}
                    />
                ) : (
                    <div className='description max-w-[90%]'>
                        {/* CONTENT OF COMMENT */}
                        <div className='text-gray-200'>{comment.content}</div>
                        {/* DATE OF COMMENT */}
                        {comment.updatedAt ? (
                            <span className='text-[12px] text-white/50'>
                                (Modified {formatDate(comment.updatedAt)})
                            </span>
                        ) : null}

                        {/* REPLY BUTTON */}
                        <div className='w-full mt-3 flex items-center gap-3'>
                            {!showButton ? null : (
                                <Button
                                    onClick={handleReply}
                                    className={`${
                                        isReply
                                            ? "bg-white text-black"
                                            : "bg-white/10 text-white"
                                    } glassmorphism !rounded-full hover:bg-white hover:text-black`}
                                >
                                    Reply
                                    <TbMessageCircle className='opacity-80' />
                                </Button>
                            )}

                            {/* ENGAGEMENTS */}
                            <Engagements
                                target={comment._id}
                                targetType='Comment'
                                recipient={comment.author._id}
                                engagements={
                                    engagements?.comments[
                                        comment._id.toString()
                                    ]
                                }
                                votes={
                                    (comment?.upvoteCount ?? 0) -
                                    (comment?.downvoteCount ?? 0)
                                }
                            />
                            {/* <Engagements commentId={comment._id} /> */}
                        </div>
                        {/* SHOW/HIDE REPLIED */}
                        {replies?.length ? (
                            <ShowReplies
                                repliesLength={replies.length}
                                showReplies={showReplies}
                                setShowReplies={setShowReplies}
                            />
                        ) : null}
                    </div>
                )}
            </div>

            <ReplySection
                commentId={commentId}
                comment={comment}
                showReplies={showReplies}
                setShowReplies={setShowReplies}
                setIsReply={setIsReply}
                isReply={isReply}
                replyTo={replyTo}
                setReplyTo={setReplyTo}
                setIsReplyingComment={setIsReplyingComment}
            />
        </>
    )
}

export default Comment
