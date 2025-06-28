import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/database"
import { getCommentsAndReplies } from "@/lib/get-post"
import { default as PostModel } from "@/database/Post"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        
        await connectDB()
        
        // First get the post to get its ObjectId
        const post = await PostModel.findOne({ postId: id })
        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 })
        }
        
        // Get comments and replies
        const data = await getCommentsAndReplies(post._id)
        
        return NextResponse.json(data)
    } catch (error) {
        console.error("Error fetching comments:", error)
        return NextResponse.json(
            { error: "Failed to fetch comments" },
            { status: 500 }
        )
    }
}