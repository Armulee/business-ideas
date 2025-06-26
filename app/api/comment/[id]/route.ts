import connectDB from "@/database"
import Comment from "@/database/Comment"
import Post from "@/database/Post"
import Profile, { IProfile } from "@/database/Profile"
import Reply from "@/database/Reply"
import { NextRequest, NextResponse } from "next/server"

// Get the individual comment by post id
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: postId } = await params
        if (!postId) {
            return NextResponse.json(
                { error: "Post Id params is required in order to fetch" },
                { status: 400 }
            )
        }

        await connectDB()
        const comments = await Comment.find({ post: postId }).populate<{
            author: IProfile
        }>({
            path: "author",
            select: "_id name avatar",
        })

        if (comments.length) {
            return NextResponse.json(comments, { status: 200 })
        }

        return new NextResponse(null, { status: 204 })
    } catch (err) {
        console.error(err)
    }
}

// Delete comment
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

        // Delete the comment
        const deletedComment = await Comment.findByIdAndDelete(id)
        if (!deletedComment) {
            return NextResponse.json(
                { message: "Comment not found" },
                { status: 404 }
            )
        }

        // Find and delete all replies to that comment
        const replies = await Reply.find({ comment: id }).select("author")
        const replyCount = replies.length
        await Reply.deleteMany({ comment: id })

        // Decrement the Post.commentCount by (1 + replyCount)
        await Post.findByIdAndUpdate(deletedComment.post, {
            $inc: { commentCount: -(1 + replyCount) },
        })

        // 4. Decrement the Profile.commentCount for the comment’s author
        await Profile.findByIdAndUpdate(deletedComment.author, {
            $inc: { commentCount: -1 },
        })

        // 5. Decrement the Profile.repliesCount for each reply’s author
        //    (grouping by author in case someone replied multiple times)
        const replyAuthorCounts: Record<string, number> = replies.reduce(
            (acc, { author }) => {
                const key = author.toString()
                acc[key] = (acc[key] || 0) + 1
                return acc
            },
            {} as Record<string, number>
        )
        await Promise.all(
            Object.entries(replyAuthorCounts).map(([authorId, cnt]) =>
                Profile.findByIdAndUpdate(authorId, {
                    $inc: { repliesCount: -cnt },
                })
            )
        )

        return NextResponse.json(
            { message: "Comment has been deleted" },
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
