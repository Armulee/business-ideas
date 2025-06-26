import Comment from "@/database/Comment"
import Reply from "@/database/Reply"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const { commentIds, replyIds } = await req.json()
        const comments = await Comment.find({ _id: { $in: commentIds } })
            .select("content createdAt post")
            .populate("post", "postId title slug")

        const replies = await Reply.find({ _id: { $in: replyIds } })
            .select("content createdAt post")
            .populate("post", "postId title slug")
            .populate({
                path: "comment",
                select: "author content",
                populate: {
                    path: "author",
                    select: "name avatar",
                },
            })

        // Add 'type' property to each object
        const formattedComments = comments.map((comment) => ({
            ...comment._doc,
            type: "comment",
        }))

        const formattedReplies = replies.map((reply) => ({
            ...reply._doc,
            type: "reply",
        }))

        // Merge and sort by createdAt in descending order
        const mergedData = [...formattedComments, ...formattedReplies].sort(
            (a, b) => b.createdAt - a.createdAt
        )
        return NextResponse.json(mergedData, { status: 200 })
    } catch (err) {
        console.error(err)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
