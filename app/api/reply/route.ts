import { NextRequest, NextResponse } from "next/server"
import Comment from "@/database/Comment"
import connectDB from "@/database"
import Reply from "@/database/Reply"
import Profile from "@/database/Profile"
import Post from "@/database/Post"
import Activity from "@/database/Activity"

// create new reply
export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const { content, authorId, comment, postId, replyTo, replyId } =
            await req.json()

        // Validate required fields
        if (!content.trim() || !authorId || !postId || !comment) {
            return NextResponse.json(
                { error: "All fields are required." },
                { status: 400 }
            )
        }

        // Ensure the post exists before replying in the comment that exist in post
        const postExists = await Post.findById(postId)
        if (!postExists) {
            return NextResponse.json(
                { error: "Post not found." },
                { status: 404 }
            )
        }

        // Ensure the comment exists before replying
        const commentExists = await Comment.findById(comment)
        if (!commentExists) {
            return NextResponse.json(
                { error: "Comment not found." },
                { status: 404 }
            )
        }

        // Create and save the new reply
        const newReply = await Reply.create({
            content: content.trim(),
            author: authorId,
            comment,
            post: postId,
            ...(replyTo && { replyTo }),
            postLink: `/post/${postExists.postId}/${postExists.slug}?reply=${replyId}`,
        })

        await newReply.save()

        // Update post comments
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            {
                $inc: { commentCount: 1 },
            },
            { new: true }
        )
        await updatedPost.save()

        // create new activity for the comment (exclude owner of the comment)
        if (commentExists.author._id.toString() !== authorId.toString()) {
            await Activity.create({
                targetType: "Reply",
                type: "reply",
                actor: authorId,
                target: newReply._id,
                recipient: commentExists.author._id,
            })
        }

        // Update user profile to add the comment count
        await Profile.findByIdAndUpdate(authorId, {
            $inc: { commentCount: 1 },
        })

        return NextResponse.json({ reply: newReply }, { status: 201 })
    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}

// Edit reply
export async function PATCH(req: Request) {
    try {
        const { content, id } = await req.json()
        if (!content) {
            return NextResponse.json(
                { error: "Text is required" },
                { status: 400 }
            )
        }

        await connectDB()

        const thisReply = await Reply.findByIdAndUpdate(
            id,
            { content, updatedAt: Date.now() },
            { new: true }
        )

        await thisReply.save()

        return NextResponse.json(
            { message: "Reply updated successfully" },
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
