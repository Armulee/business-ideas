import connectDB from "@/database"
import Post from "@/database/Post"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB()
        const { id } = await params

        // First, get the current post to extract its categories and tags
        const currentPost = await Post.findById(id)
        if (!currentPost) {
            return NextResponse.json(
                { message: "Post not found" },
                { status: 404 }
            )
        }

        // Build query to find related posts
        const relatedQuery: Record<string, unknown> = {
            _id: { $ne: id }, // Exclude current post
        }

        // Create match conditions for categories and tags
        const matchConditions = []

        if (currentPost.categories && currentPost.categories.length > 0) {
            matchConditions.push({
                categories: { $in: currentPost.categories },
            })
        }

        if (currentPost.tags && currentPost.tags.length > 0) {
            matchConditions.push({
                tags: { $in: currentPost.tags },
            })
        }

        // If we have categories or tags, use $or to match either
        if (matchConditions.length > 0) {
            relatedQuery.$or = matchConditions
        } else {
            // If no categories or tags, just get posts from same community
            relatedQuery.community = currentPost.community
        }

        // Find related posts
        let relatedPosts = await Post.find(relatedQuery)
            .populate("author", "name avatar profileId")
            .sort({ createdAt: -1 })
            .limit(5)

        // If no related posts found, fall back to just getting recent posts from same community
        if (relatedPosts.length === 0) {
            relatedPosts = await Post.find({
                _id: { $ne: id },
                community: currentPost.community,
            })
                .populate("author", "name avatar profileId")
                .sort({ createdAt: -1 })
                .limit(5)
        }

        // If still no posts, get any recent posts
        if (relatedPosts.length === 0) {
            relatedPosts = await Post.find({
                _id: { $ne: id },
            })
                .populate("author", "name avatar profileId")
                .sort({ createdAt: -1 })
                .limit(5)
        }

        return NextResponse.json(relatedPosts, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { error: "Failed to fetch related posts" },
            { status: 500 }
        )
    }
}
