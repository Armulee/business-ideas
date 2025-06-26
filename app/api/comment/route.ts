import { NextRequest, NextResponse } from "next/server"
import Comment from "@/database/Comment"
import Post from "@/database/Post"
import connectDB from "@/database"
import Profile from "@/database/Profile"
import Activity from "@/database/Activity"

export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const { content, author, postId, commentId } = await req.json()

        // Validate required fields
        if (!content.trim() || !author || !postId) {
            return NextResponse.json(
                { error: "All fields are required." },
                { status: 400 }
            )
        }

        // Ensure the post exists before commenting
        const postExists = await Post.findById(postId)
        if (!postExists) {
            return NextResponse.json(
                { error: "Post not found." },
                { status: 404 }
            )
        }

        // Create and save the new comment
        const newComment = await Comment.create({
            content: content.trim(),
            author,
            post: postId,
            postLink: `/post/${postExists.postId}/${postExists.slug}?comment=${commentId}`,
        })
        await newComment.save()

        // Update post interactions
        await Post.findByIdAndUpdate(postId, {
            $inc: { commentCount: 1 },
        })

        // create new activity for the comment (exclude the owner of the post)
        if (postExists.author._id.toString() !== author.toString()) {
            await Activity.create({
                targetType: "Comment",
                type: "comment",
                actor: author,
                target: newComment._id,
                recipient: postExists.author._id,
            })
        }

        // Update user profile to add the comment reference
        await Profile.findByIdAndUpdate(author, {
            $inc: { commentCount: 1 },
        })

        return NextResponse.json({ comment: newComment }, { status: 201 })
    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}

// Edit comment
export async function PATCH(req: NextRequest) {
    try {
        const { content, id } = await req.json()

        if (!content) {
            return NextResponse.json(
                { error: "Text is required" },
                { status: 400 }
            )
        }

        await connectDB()

        // Update edited content to comment
        const thisComment = await Comment.findByIdAndUpdate(
            id,
            { content, updatedAt: Date.now() },
            { new: true }
        )

        await thisComment.save()

        return NextResponse.json(
            { message: "Comment updated successfully" },
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
