"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import Comment from "./comment"
import { usePostData } from ".."
import AddNewComment from "./add-new-comment"
import { CommentsSkeleton } from "@/components/skeletons"

export default function CommentSection() {
    const { comments } = usePostData()

    // show editor for comment
    const [isComment, setIsComment] = useState<boolean>(false)

    // Handle focusing on the comment box when commenting
    const editorRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (isComment && editorRef.current) {
            editorRef.current?.scrollIntoView({
                behavior: "smooth",
            })
        }
    }, [isComment])

    return (
        <>
            {/* ADD NEW COMMENT BUTTON */}
            <div ref={editorRef} style={{ scrollMarginTop: "200px" }}>
                <AddNewComment
                    isComment={isComment}
                    setIsComment={setIsComment}
                />
            </div>

            {/* SHOW HOW MANY COMMENTS */}
            {comments?.length ? (
                <h2 className='text-2xl font-bold mb-4 text-white'>
                    {comments?.length} Comment{comments.length === 1 ? "" : "s"}
                </h2>
            ) : null}

            {/* ALL COMMENTS */}
            <div className='mb-6'>
                {comments == undefined ? (
                    <CommentsSkeleton />
                ) : (
                    comments?.map((comment, index) => (
                        <Comment
                            commentId={`comment-${index}`}
                            key={`comment-${index}`}
                            comment={comment}
                        />
                    ))
                )}
            </div>
        </>
    )
}
