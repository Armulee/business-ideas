import Comment from "@/database/Comment"
import Post from "@/database/Post"
import Reply from "@/database/Reply"
import { Schema } from "mongoose"
import { NextResponse } from "next/server"

const models: Record<string, typeof Post | typeof Comment | typeof Reply> = {
    post: Post,
    comment: Comment,
    reply: Reply,
}

type Ids = {
    _id: Schema.Types.ObjectId
    target: "post" | "comment" | "reply"
    createdAt: Date
}
export async function POST(req: Request) {
    try {
        const ids = await req.json()
        // Fetch data dynamically
        const results = await Promise.all(
            ids.map(async ({ _id, target, createdAt }: Ids) => {
                const Model = models[target]
                if (!Model) return null

                let data = null

                if (target === "post") {
                    data = await Model.findById(_id)
                        .select("title category postId slug author")
                        .populate("author", "name avatar")
                } else if (target === "comment") {
                    data = await Model.findById(_id)
                        .select("content author post")
                        .populate("author", "name avatar")
                        .populate("post", "title postId slug")
                } else if (target === "reply") {
                    data = await Model.findById(_id)
                        .select("content author comment post")
                        .populate("author", "name avatar")
                        .populate({
                            path: "comment",
                            select: "content author",
                            populate: {
                                path: "author",
                                select: "name avatar",
                            },
                        })
                        .populate("post", "title postId slug")
                }

                return data
                    ? { ...data.toObject(), type: target, createdAt }
                    : null
            })
        )
        return NextResponse.json(results.filter(Boolean), { status: 200 })
    } catch (err) {
        console.error(err)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
