import connectDB from "@/database"
import Post from "@/database/Post"
import { NextResponse } from "next/server"

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB()

        // Get the postId from query params
        const { id: postId } = await params

        if (!postId) {
            return NextResponse.json(
                { message: "Post ID is required" },
                { status: 400 }
            )
        }

        // Find the post by ID
        const post = await Post.findById(postId)
        if (!post) {
            return NextResponse.json(
                { message: "Post not found" },
                { status: 404 }
            )
        }

        let relatedPosts = []

        // 1️⃣ Try finding posts with matching tags
        if (post.tags && post.tags.length > 0) {
            relatedPosts = await Post.find({
                _id: { $ne: postId },
                tags: { $in: post.tags },
            })
                .populate("author", "name avatar")
                .sort({ upvotes: -1, createdAt: -1 })
                .limit(5)
        }

        // 2️⃣ If no related posts found by tags, try finding by category
        if (relatedPosts.length === 0 && post.category) {
            relatedPosts = await Post.find({
                _id: { $ne: postId },
                category: post.category,
            })
                .populate("author", "name avatar")
                .sort({ upvotes: -1, createdAt: -1 })
                .limit(5)
        }

        // 3️⃣ If still no related posts, fetch random posts as fallback
        if (relatedPosts.length === 0) {
            relatedPosts = await Post.aggregate([
                { $match: { _id: { $ne: post._id } } }, // Exclude current post
                { $sample: { size: 5 } }, // Get random 5 posts
                // Join author details
                {
                    $lookup: {
                        from: "profiles",
                        localField: "author",
                        foreignField: "_id",
                        as: "author",
                    },
                },
                { $unwind: "$author" },
                // Project only needed fields
                {
                    $project: {
                        title: 1,
                        content: 1,
                        upvoteCount: 1,
                        createdAt: 1,
                        downvoteCount: 1,
                        category: 1,
                        viewCount: 1,
                        commentCount: 1,
                        postLink: 1,
                        "author.name": 1,
                        "author.avatar": 1,
                        "author.profileId": 1,
                        advancedSettings: 1,
                    },
                },
            ])
        }

        return NextResponse.json(relatedPosts, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }
}
