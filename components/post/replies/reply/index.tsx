"use client"
import { formatDate } from "@/utils/format-date"
import { Button } from "@/components/ui/button"
import ReplyOptions from "./options"
import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { IReplyPopulated } from "@/database/Reply"
import { useRouter, useSearchParams } from "next/navigation"
import { usePostData } from "../.."
import { TbMessageCircle } from "react-icons/tb"
import { useAlert } from "@/components/provider/alert"

import Author from "./author"
import Editor from "./editor"
// import Engagements from "./engagement"
import { ReplyTo } from "../../comments/comment"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Engagements from "../../engagements"
import clearParams from "@/lib/clear-params"

interface ReplyProps {
    replyId: string
    index: number
    length: number
    reply: IReplyPopulated
    setIsReply: React.Dispatch<React.SetStateAction<boolean>>
    isReply: boolean
    replyTo: ReplyTo
    setReplyTo: React.Dispatch<React.SetStateAction<ReplyTo>>
    setShowReplies: React.Dispatch<React.SetStateAction<boolean>>
}

const Reply = ({
    replyId,
    index,
    length,
    reply,
    setIsReply,
    isReply,
    replyTo,
    setReplyTo,
    setShowReplies,
}: ReplyProps) => {
    const router = useRouter()
    const { post, engagements, showButton, setShowButton } = usePostData()
    const { data: session } = useSession()

    const [isEditing, setIsEditing] = useState<boolean>(false)

    // handle replying someone
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
                        `/auth/signin?callbackUrl=/post/${post?.postId}/${post?.slug}?reply=${replyId}`
                    )
                },
            })
        } else {
            setIsReply(true)
            setReplyTo({
                name: reply.author.name || "",
                avatar: reply.author.avatar || "",
                id: replyId,
            })
        }
    }

    // hide add new comment button, reply button and elipsis button (more button) when editing reply
    useEffect(() => {
        if (isEditing || isReply) {
            setShowButton(false)
        } else {
            setShowButton(true)
        }
    }, [isEditing, isReply, setShowButton])

    // scroll the replied target when user click the Replied to on the reply box
    const scrollToReplyingTarget = (id: string) => {
        const target = document.getElementById(id)
        if (!target) return
        target.scrollIntoView({ behavior: "smooth", block: "start" })

        target.classList.add("!bg-blue-700")

        setTimeout(() => {
            target.classList.remove("!bg-blue-700")
            clearParams("reply")
        }, 2000)
    }

    // (FOR CASE REPLY COMMENT) if detect the params ?reply=id from url slide that replied if detecting ?replying=id show a reply box to those replied
    const searchParams = useSearchParams()
    const replyParam = searchParams.get("reply")
    const replyingParam = searchParams.get("replying")
    useEffect(() => {
        if (replyParam === replyId) {
            scrollToReplyingTarget(replyId)
        } else if (replyingParam === replyId) {
            setIsReply(true)
            setReplyTo({
                name: reply.author.name || "",
                avatar: reply.author.avatar || "",
                id: replyId,
            })
        }
    }, [
        replyParam,
        setIsReply,
        setShowReplies,
        replyId,
        setReplyTo,
        reply,
        replyingParam,
    ])
    return (
        <div
            id={replyId}
            style={{ scrollMarginTop: "80px" }}
            className={`ml-6 mb-4 glassmorphism ${
                isEditing || replyTo?.id === replyId
                    ? "bg-blue-700/50 p-4"
                    : "bg-black/10 p-6"
            } relative transition duration-500 ease-in`}
        >
            {/* VERTICAL LINE */}
            <div
                style={{
                    // Add the lost height due to border of the reply box
                    height:
                        index === length && !isReply
                            ? "50%"
                            : "calc(100% + 1rem + 2px)",
                }}
                className={`absolute -left-4 top-0 w-[1px] bg-white/50`}
            />

            {/* HORIZONTAL LINE */}
            <div
                style={{
                    // Reduce by the border of the reply box for the better looking line
                    width:
                        index === length && !isReply
                            ? "calc(1rem - 1px)"
                            : "calc(1rem - 2px)",
                }}
                className='absolute -left-[1px] top-1/2 h-[1px] transform -translate-x-full bg-white/50'
            />

            {/* OPTIONS */}
            {!showButton ? null : (
                <ReplyOptions reply={reply} setIsEditing={setIsEditing} />
            )}

            {/* REPLY TO */}
            {reply.replyTo ? (
                <div
                    className='w-fit glassmorphism bg-blue-700/50 px-3 py-1 rounded flex items-center gap-2 mb-3 cursor-pointer group hover:bg-blue-700 transition duration-300'
                    onClick={() => scrollToReplyingTarget(reply.replyTo.id)}
                >
                    <Avatar className='h-6 w-6'>
                        <AvatarImage
                            src={reply.replyTo.avatar}
                            alt={reply.replyTo.name}
                        />
                        <AvatarFallback>
                            {reply.replyTo.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col flex-1 min-w-0'>
                        <span className='truncate text-[10px] text-white/80 group-hover:text-white transition duration-300'>
                            Replied to:
                        </span>
                        <span className='truncate text-white/80 text-xs font-semibold group-hover:text-white transition duration-300'>
                            {reply.replyTo.name}
                        </span>
                    </div>
                </div>
            ) : null}

            {/* AUTHOR NAME AND DATE */}
            <Author author={reply.author} createdAt={reply.createdAt} />

            {isEditing ? (
                <Editor
                    replyId={reply._id}
                    defaultValue={reply.content}
                    setIsEditing={setIsEditing}
                />
            ) : (
                <>
                    {/* REPLY CONTENT */}
                    <div className='text-sm'>{reply.content}</div>
                    {reply.updatedAt ? (
                        <span className='text-[12px] text-white/70'>
                            (Modified {formatDate(reply.updatedAt)})
                        </span>
                    ) : null}

                    <div className='flex items-center gap-3 mt-3'>
                        {/* REPLY BUTTONS */}
                        {!showButton ? null : (
                            <Button
                                type='button'
                                onClick={handleReply}
                                className={`${
                                    isReply
                                        ? "bg-white text-black"
                                        : "bg-white/10 text-white"
                                } glassmorphism !rounded-full hover:bg-white hover:text-black text-xs rounded-full`}
                            >
                                Reply <TbMessageCircle className='opacity-80' />
                            </Button>
                        )}
                        {/* ENGAGEMENTS */}
                        <Engagements
                            target={reply._id}
                            targetType='Reply'
                            recipient={reply.author._id}
                            votes={
                                (reply.upvoteCount ?? 0) -
                                (reply.downvoteCount ?? 0)
                            }
                            engagements={
                                engagements?.replies[reply._id.toString()]
                            }
                        />
                    </div>
                </>
            )}
        </div>
    )
}

export default Reply
