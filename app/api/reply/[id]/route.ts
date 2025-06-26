import connectDB from "@/database"
import Post from "@/database/Post"
import Profile from "@/database/Profile"
import Reply from "@/database/Reply"
import { NextRequest, NextResponse } from "next/server"

// Get the individual reply by comment id
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: postId } = await params

        if (!postId) {
            return NextResponse.json(
                {
                    error: "Comment Id params is required in order to fetch reply",
                },
                { status: 400 }
            )
        }

        await connectDB()
        const replies = await Reply.find({ post: postId }).populate({
            path: "author",
            select: "_id name image",
            model: "User",
        })

        if (replies.length) {
            return NextResponse.json(replies, { status: 200 })
        }

        return new NextResponse(null, { status: 204 })
    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }
}

// Delete reply
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        if (!id) {
            return NextResponse.json(
                {
                    error: "Id params is required in order to fetch the comment",
                },
                { status: 400 }
            )
        }

        const deletedReply = await Reply.findByIdAndDelete(id)
        if (!deletedReply) {
            return NextResponse.json(
                { message: "Reply not found" },
                { status: 404 }
            )
        }

        const authorId = deletedReply.author.toString()

        // Update post commentCount
        await Post.findByIdAndUpdate(deletedReply.post, {
            $inc: { comments: -1 },
        })

        // Decrement the profile.repliesCount for the reply author
        await Profile.findByIdAndUpdate(authorId, {
            $inc: { replyCount: -1 },
        })

        return NextResponse.json(
            { message: "Reply has been deleted" },
            { status: 200 }
        )
    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}
