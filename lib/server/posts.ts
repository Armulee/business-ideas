// Server-side data fetching utilities for posts

import connectDB from "@/database"
import Post from "@/database/Post"
import Profile from "@/database/Profile" // Import Profile model to register it
import type { IPostPopulated } from "@/database/Post"

// Get initial posts for homepage (latest and top voted)
export async function getInitialHomePosts() {
    await connectDB()

    try {
        // Get latest posts
        const latestPosts = await Post.find()
            .populate({
                path: "author",
                select: "name email avatar profileId",
                model: Profile,
            })
            .sort({ createdAt: -1 })
            .limit(6)
            .lean()

        // Get top voted posts (simple sort by upvotes count)
        const topVotedPosts = await Post.find()
            .populate({
                path: "author",
                select: "name email avatar profileId",
                model: Profile,
            })
            .sort({ upvotes: -1 })
            .limit(6)
            .lean()

        return {
            latestPosts: JSON.parse(
                JSON.stringify(latestPosts)
            ) as IPostPopulated[],
            topVotedPosts: JSON.parse(
                JSON.stringify(topVotedPosts)
            ) as IPostPopulated[],
        }
    } catch (error) {
        console.error("Error fetching initial home posts:", error)
        return {
            latestPosts: [],
            topVotedPosts: [],
        }
    }
}

// Get initial feed data for posts page
export async function getInitialFeedData() {
    await connectDB()

    try {
        const posts = await Post.find({ status: "published" })
            .populate({
                path: "author",
                select: "name email avatar profileId",
                model: "Profile",
            })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean()

        // Serialize the data to plain objects
        const serializedPosts = JSON.parse(JSON.stringify(posts))
        return serializedPosts as IPostPopulated[]
    } catch (error) {
        console.error("Error fetching initial feed data:", error)
        return []
    }
}
