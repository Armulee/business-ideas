import { useEffect, useRef } from "react"
import Reply from "./reply"
import { usePostData } from ".."
import { ICommentPopulated } from "@/database/Comment"
import ReplyingBox from "./replying-box"
import { ReplyTo } from "../comments/comment"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { clearParams } from "../../../hooks/helper-function"

interface ReplySectionProps {
    commentId: string
    setIsReply: React.Dispatch<React.SetStateAction<boolean>>
    showReplies: boolean
    setShowReplies: React.Dispatch<React.SetStateAction<boolean>>
    comment: ICommentPopulated
    isReply: boolean
    replyTo: ReplyTo
    setReplyTo: React.Dispatch<React.SetStateAction<ReplyTo>>
    setIsReplyingComment: React.Dispatch<React.SetStateAction<boolean>>
}

const ReplySection = ({
    commentId,
    showReplies,
    setShowReplies,
    comment,
    setIsReply,
    isReply,
    replyTo,
    setReplyTo,
    setIsReplyingComment,
}: ReplySectionProps) => {
    const { post, replies: allReplies, setShowButton } = usePostData()
    const replies = allReplies?.[comment._id.toString()]

    // if not showing the reply anymore close the editor
    useEffect(() => {
        if (!showReplies) {
            setIsReply(false)
        }
    }, [showReplies, setIsReply])

    // hide elipsis button (more button) when adding new reply
    useEffect(() => {
        if (isReply) {
            setShowButton(false)
        } else {
            setShowButton(true)
        }
    }, [isReply, setShowButton])

    // (FOR CASE REPLY COMMENT) if detect the params ?reply= from url show a reply box to those comment
    const router = useRouter()
    const searchParams = useSearchParams()
    const replyParam = searchParams.get("reply")
    const { data: session, status } = useSession()
    const toastFired = useRef(false)
    useEffect(() => {
        // 1) we only care if there *is* a ?reply=… param
        if (!replyParam) return
        // 2) wait until session status is settled
        if (status === "loading") return

        // === UNAUTHENTICATED CASE ===
        if (!session && status === "unauthenticated") {
            if (!toastFired.current) {
                toast("Invalid parameters", {
                    description:
                        "You have no permission to this param. Please login first.",
                    action: {
                        label: "Login",
                        onClick: () =>
                            router.push(
                                `/auth/signin?callbackUrl=/post/${post?.postId}/${post?.slug}?reply=${commentId}`
                            ),
                    },
                })
                // mark that we’ve already shown it
                toastFired.current = true
                clearParams("reply")
            }
            return
        }

        // === AUTHENTICATED CASE ===
        if (session?.user) {
            if (replies?.length) {
                setShowReplies(true)
            }
            if (replyParam === commentId) {
                setIsReplyingComment(true)
                setIsReply(true)
            }
        }
    }, [
        replyParam,
        status,
        session,
        replies,
        commentId,
        post,
        setShowReplies,
        setIsReply,
        setIsReplyingComment,
        searchParams,
        router,
    ])
    return (
        <>
            <div className='relative'>
                {/* REPLIED */}
                {showReplies ? (
                    <>
                        {replies?.length
                            ? replies.map((reply, index) => (
                                  <Reply
                                      index={index}
                                      replyId={`${commentId}-reply-${index}`}
                                      key={`reply-${index}`}
                                      length={replies.length - 1}
                                      reply={reply}
                                      isReply={isReply}
                                      setIsReply={setIsReply}
                                      replyTo={replyTo}
                                      setReplyTo={setReplyTo}
                                      setShowReplies={setShowReplies}
                                  />
                              ))
                            : null}
                    </>
                ) : null}

                {/* REPLYING */}
                {isReply ? (
                    <ReplyingBox
                        isReply={isReply}
                        setIsReply={setIsReply}
                        comment={comment._id}
                        replyId={`${commentId}-reply-${replies?.length ?? 0}`}
                        postId={comment.post}
                        replyTo={replyTo}
                        setReplyTo={setReplyTo}
                        setIsReplyingComment={setIsReplyingComment}
                    />
                ) : null}
            </div>
        </>
    )
}

export default ReplySection
