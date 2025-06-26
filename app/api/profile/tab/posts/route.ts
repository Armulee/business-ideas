import Post from "@/database/Post"
import { IProfile } from "@/database/Profile"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const ids = await req.json()

        if (!ids.length) {
            return NextResponse.json({ message: "No posts" }, { status: 200 })
        }

        const posts = await Post.find({ _id: { $in: ids } }).populate<{
            author: IProfile
        }>("author", "_id name avatar profileId")

        return NextResponse.json(posts, { status: 200 })
    } catch (err) {
        console.error(err)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
