import connectDB from "@/database"
import Comment from "@/database/Comment"
import Post from "@/database/Post"
import Profile, { IProfile } from "@/database/Profile"
import Reply from "@/database/Reply"
import Widget, { IWidgets } from "@/database/Widget"
import { NextResponse } from "next/server"

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string; slug: string }> }
) {
    const { id } = await params

    try {
        await connectDB()

        // Get the post by ID and populate the author field
        const post = await Post.findOne({ postId: id }).populate<{
            author: IProfile
        }>({
            path: "author",
            select: "_id avatar name profileId posts",
        })

        // Get the comments for the post
        const comments = await Comment.find({ post: post._id })
            .populate({
                path: "author",
                select: "avatar name profileId",
            })
            .sort({ created_at: 1 })

        // Get the replies and organize them by comment
        const rawReplies = await Reply.find({ post: post._id })
            .populate({
                path: "author",
                select: "avatar name profileId",
            })
            .populate("comment", "_id") // Ensure reply is populated with the comment ID
            .exec()
        // Group replies by comment ID
        const replies = comments.reduce((acc, comment) => {
            acc[comment._id] = rawReplies.filter(
                (reply) =>
                    reply.comment._id.toString() === comment._id.toString()
            )
            return acc
        }, {})

        // Get widgets
        const widgets: IWidgets | null = await Widget.findOne({
            post: post._id,
        })
        // Get profile for widget profile
        let profile: IProfile | null = null
        const profileWidget = widgets?.widgets.some(
            (widget) => widget.type === "profile"
        )
        if (profileWidget) {
            profile = await Profile.findById(post.author._id)
        }

        const data = {
            post,
            comments,
            replies,
            widgets: widgets ? widgets.widgets : null,
            ...(profile && { profile }),
        }

        return NextResponse.json(data, { status: 200 })
    } catch (err) {
        const error = (err as Error).message
        return NextResponse.json({ error }, { status: 400 })
    }
}
