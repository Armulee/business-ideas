import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/database"
import Activity from "@/database/Activity"
import Post from "@/database/Post"
import Comment from "@/database/Comment"
import Reply from "@/database/Reply"
import Profile from "@/database/Profile"

export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const { actor, target, recipient, targetType, type } = await req.json()

        if (!actor || !target || !recipient || !targetType || !type) {
            return NextResponse.json(
                { error: "Missing fields" },
                { status: 400 }
            )
        }

        const isVote = type === "upvote" || type === "downvote"
        const isToggle = type === "bookmark" || type === "repost"

        // Non-owner: use Activity for toggles and notifications
        const update: Record<string, number> = {}

        if (isVote) {
            const oppositeType = type === "upvote" ? "downvote" : "upvote"
            const existingSame = await Activity.findOne({
                actor,
                target,
                recipient,
                targetType,
                type,
            })
            const existingOpposite = await Activity.findOne({
                actor,
                target,
                recipient,
                targetType,
                type: oppositeType,
            })

            if (existingSame) {
                // toggle off current vote
                await Activity.deleteOne({ _id: existingSame._id })
                update[`${type}Count`] = -1
            } else {
                // remove opposite and add current vote
                if (existingOpposite) {
                    await Activity.deleteOne({ _id: existingOpposite._id })
                    update[`${oppositeType}Count`] = -1
                }
                await Activity.create({
                    actor,
                    target,
                    recipient,
                    targetType,
                    type,
                })
                update[`${type}Count`] = 1
            }
        } else if (isToggle) {
            const existing = await Activity.findOne({
                actor,
                target,
                recipient,
                targetType,
                type,
            })
            if (existing) {
                await Activity.deleteOne({ _id: existing._id })
                update[`${type}Count`] = -1
            } else {
                await Activity.create({
                    actor,
                    target,
                    recipient,
                    targetType,
                    type,
                })
                update[`${type}Count`] = 1
            }
        } else {
            return NextResponse.json(
                { error: "Invalid interaction type" },
                { status: 400 }
            )
        }

        // add count to post or comment or reply
        if (targetType === "Post") {
            await Post.findByIdAndUpdate(target, { $inc: update })
        }
        if (targetType === "Comment") {
            await Comment.findByIdAndUpdate(target, { $inc: update })
        }
        if (targetType === "Reply") {
            await Reply.findByIdAndUpdate(target, { $inc: update })
        }

        // add over upvote count to profile for upvote only
        if (type === "upvote") {
            await Profile.findByIdAndUpdate(recipient, {
                $inc: { upvoteCount: update.upvoteCount },
            })
        }

        return NextResponse.json({ success: true, type }, { status: 200 })
    } catch (err) {
        console.error("[POST /api/activities/engage]", err)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}
