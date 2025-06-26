import connectDB from "@/database"
import Post from "@/database/Post"
import { NextResponse } from "next/server"

export async function PATCH(req: Request) {
    const { postId } = await req.json()

    try {
        await connectDB()

        // Increment view count
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $inc: { viewCount: 1 } },
            { new: true }
        )

        if (!updatedPost) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 400 }
            )
        }

        return NextResponse.json(
            {
                message: "View counted",
                views: updatedPost.views,
            },
            { status: 200 }
        )
    } catch {
        return NextResponse.json(
            { error: "Error updating views" },
            { status: 500 }
        )
    }
}
