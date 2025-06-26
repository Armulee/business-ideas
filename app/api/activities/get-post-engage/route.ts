import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/database"
import Activity, { IActivity } from "@/database/Activity"

export async function POST(req: NextRequest) {
    try {
        await connectDB()

        const {
            postId,
            userId,
            commentIds = [],
            replyIds = [],
        } = await req.json()

        if (!postId || !userId) {
            return NextResponse.json(
                { error: "Missing postId or userId" },
                { status: 400 }
            )
        }

        const allTargetIds = [postId, ...commentIds, ...replyIds]

        const activities: IActivity[] = await Activity.find({
            actor: userId,
            target: { $in: allTargetIds },
        })

        const result = {
            post: {
                upvote: false,
                downvote: false,
                bookmark: false,
                repost: false,
            },
            comments: {} as Record<
                string,
                { upvote: boolean; downvote: boolean }
            >,
            replies: {} as Record<
                string,
                { upvote: boolean; downvote: boolean }
            >,
        }

        for (const activity of activities) {
            const id = activity.target.toString()
            const type = activity.type as
                | "upvote"
                | "downvote"
                | "bookmark"
                | "repost"

            if (id === postId) {
                result.post[type] = true
            } else if (commentIds.includes(id)) {
                if (!result.comments[id]) {
                    result.comments[id] = { upvote: false, downvote: false }
                }
                if (type === "upvote" || type === "downvote") {
                    result.comments[id][type] = true
                }
            } else if (replyIds.includes(id)) {
                if (!result.replies[id]) {
                    result.replies[id] = { upvote: false, downvote: false }
                }
                if (type === "upvote" || type === "downvote") {
                    result.replies[id][type] = true
                }
            }
        }

        return NextResponse.json(result)
    } catch (err) {
        console.error("[POST /api/activities/post/get-engage]", err)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}
