import { NextResponse } from "next/server"
import Post from "@/database/Post"
import connectDB from "@/database"
import "@/database/Profile"

export async function GET() {
    try {
        await connectDB()

        // Fetch the latest 6 posts of type 'new-ideas'
        const latestPosts = await Post.find({ community: "new-ideas" })
            .populate("author", "name avatar profileId")
            .sort({ createdAt: -1 }) // Sort by newest
            .limit(6)

        // Fetch the top 6 posts sorted by upvotes - downvotes
        const topVotedPosts = await Post.find({ community: "new-ideas" })
            .populate("author", "name avatar profileId")
            .lean() // Convert Mongoose document to plain JS object
            .then(
                (posts) =>
                    posts
                        .map((post) => ({
                            ...post,
                            score: post.upvoteCount - post.downvoteCount,
                        }))
                        .sort((a, b) => b.score - a.score) // Sort in JS instead
                        .slice(0, 6) // Get top 6
            )

        return NextResponse.json(
            { latestPosts, topVotedPosts },
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
