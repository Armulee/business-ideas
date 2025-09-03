import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import Post from "@/database/Post"
import Profile from "@/database/Profile"
import connectDB from "@/database"

export async function GET(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Check if user is admin
        if (session.user.role !== "admin") {
            return NextResponse.json(
                { error: "Admin access required" },
                { status: 403 }
            )
        }

        await connectDB()

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "20")
        const search = searchParams.get("search") || ""

        const skip = (page - 1) * limit

        // Build search query - only get published posts for admin review
        let query: Record<string, unknown> = { status: "published" }

        if (search) {
            const searchConditions: Array<
                | { title: { $regex: string; $options: string } }
                | { postId: number }
                | { author: { $in: unknown[] } }
            > = [{ title: { $regex: search, $options: "i" } }]

            // Add postId search if search term is a number
            if (!isNaN(parseInt(search))) {
                searchConditions.push({ postId: parseInt(search) })
            }

            // Search by author name
            const authorProfiles = await Profile.find({
                name: { $regex: search, $options: "i" },
            }).select("_id")

            if (authorProfiles.length > 0) {
                searchConditions.push({
                    author: { $in: authorProfiles.map((p) => p._id) },
                })
            }

            query = { ...query, $or: searchConditions }
        }

        // Get posts with populated author
        const posts = await Post.find(query)
            .populate("author", "profileId name email avatar")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()

        // Check if there are more posts
        const totalPosts = await Post.countDocuments(query)
        const hasMore = skip + posts.length < totalPosts

        return NextResponse.json({
            posts,
            hasMore,
            totalPosts,
            currentPage: page,
        })
    } catch (error) {
        console.error("Error fetching admin posts:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
