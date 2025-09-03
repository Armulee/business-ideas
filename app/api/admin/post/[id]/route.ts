import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import Post from "@/database/Post"
import connectDB from "@/database"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params
        const postId = parseInt(id)

        if (isNaN(postId)) {
            return NextResponse.json(
                { error: "Invalid post ID" },
                { status: 400 }
            )
        }

        const post = await Post.findOne({ postId })
            .populate("author", "profileId name email avatar")
            .lean()

        if (!post) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ post })
    } catch (error) {
        console.error("Error fetching admin post:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params
        const postId = parseInt(id)

        if (isNaN(postId)) {
            return NextResponse.json(
                { error: "Invalid post ID" },
                { status: 400 }
            )
        }

        const deletedPost = await Post.findOneAndDelete({ postId })

        if (!deletedPost) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ message: "Post deleted successfully" })
    } catch (error) {
        console.error("Error deleting admin post:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
