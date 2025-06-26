import connectDB from "@/database"
import Post from "@/database/Post"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    try {
        await connectDB()

        const searchParams = req.nextUrl.searchParams
        const page = parseInt(searchParams.get("page") || "1", 10) // Default to page 1
        const limit = 10 // Load 20 posts per request
        const skip = (page - 1) * limit

        const posts = await Post.find()
            .populate("author", "name avatar profileId")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        return NextResponse.json(posts, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { error: "Failed to fetch posts" },
            { status: 500 }
        )
    }
}
