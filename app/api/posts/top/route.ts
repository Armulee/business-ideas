import { NextResponse } from "next/server"
import Post from "@/database/Post"
import connectDB from "@/database"

export async function GET() {
    try {
        await connectDB()

        // Get top 5 most upvoted posts
        const topPosts = await Post.find()
            .populate("author", "name avatar profileId")
            .sort({ upvotes: -1 })
            .limit(5)

        return NextResponse.json(topPosts, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}
