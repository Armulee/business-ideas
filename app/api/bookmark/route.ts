import Post from "@/database/Post"
import Profile from "@/database/Profile"
import { NextResponse } from "next/server"

export async function PATCH(req: Request) {
    try {
        const { postId, profileId } = await req.json()
        if (!postId || !profileId) {
            return NextResponse.json(
                { message: "Required postId or profileId" },
                { status: 400 }
            )
        }

        const profile = await Profile.findById(profileId)
        if (!profile) {
            return NextResponse.json(
                { message: "Profile not found" },
                { status: 404 }
            )
        }

        const post = await Post.findById(postId)
        if (!post) {
            return NextResponse.json(
                { message: "Post not found" },
                { status: 404 }
            )
        }

        // Toggle bookmark
        const index = profile.bookmarks.indexOf(postId)
        if (index !== -1) {
            profile.bookmarks.splice(index, 1) // Remove bookmark
            post.bookmarks -= 1
        } else {
            profile.bookmarks.push(postId) // Add bookmark
            post.bookmarks += 1
        }

        await profile.save()
        await post.save()

        return NextResponse.json(
            { message: "Bookmark updated" },
            { status: 200 }
        )
    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }
}
