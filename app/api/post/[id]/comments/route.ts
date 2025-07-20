import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/database"
// import { getCommentsAndReplies } from "@/lib/get-post"
import { default as PostModel } from "@/database/Post"
import Comment from "@/database/Comment"
import Reply from "@/database/Reply"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        await connectDB()

        // First get the post to get its ObjectId
        const post = await PostModel.findOne({ postId: id })
        if (!post) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            )
        }

        // Get comments and replies
        const data = await getCommentsAndReplies(post._id)

        return NextResponse.json(data)
    } catch (error) {
        console.error("Error fetching comments:", error)
        return NextResponse.json(
            { error: "Failed to fetch comments" },
            { status: 500 }
        )
    }
}

const getCommentsAndReplies = async (post: string) => {
    // get comment data from post we found
    const comments =
        (await Comment.find({ post })
            .populate({
                path: "author",
                select: "avatar name profileId",
            })
            .sort({ created_at: 1 })) ?? undefined

    // get replies data from comments we found
    const rawReplies =
        (await Reply.find({ post })
            .populate({
                path: "author",
                select: "avatar name profileId",
            })
            .populate("comment", "_id") // Ensure reply is populated with the comment ID
            .exec()) ?? undefined

    // Group replies by comment ID
    const replies = comments.reduce((acc, comment) => {
        acc[comment._id] = rawReplies.filter(
            (reply) => reply.comment._id.toString() === comment._id.toString()
        )
        return acc
    }, {})

    return { comments, replies }
}
