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

        // Toggle repost
        const index = profile.reposts.indexOf(postId)
        if (index !== -1) {
            profile.reposts.splice(index, 1) // Remove repost
            post.reposts -= 1
        } else {
            profile.reposts.push(postId) // Add repost
            post.reposts += 1
        }

        await profile.save()

        return NextResponse.json({ message: "Repost updated" }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }
}
