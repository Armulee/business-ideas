import { NextResponse } from "next/server"
import connectDB from "@/database"
import Profile from "@/database/Profile"
import { Follow } from "@/database/Follow"

export async function PATCH(req: Request) {
    try {
        await connectDB()

        // Example Usage:
        // const follower = aliceProfileId // Alice is the one taking the action
        // const followee = bobProfileId // Bob is the one being followed
        const { followerId, followeeId } = await req.json()
        if (!followerId || !followeeId) {
            return NextResponse.json(
                { message: "Error: Missing required parameters" },
                { status: 400 }
            )
        }

        // check existing relationship
        const existing = await Follow.findOne({
            follower: followerId,
            followee: followeeId,
        })

        let isNowFollowing: boolean

        if (existing) {
            // Unfollow: remove the document and decrement both counters
            await Follow.deleteOne({ _id: existing._id })
            await Promise.all([
                Profile.findByIdAndUpdate(followerId, {
                    $inc: { followingCount: -1 },
                }),
                Profile.findByIdAndUpdate(followeeId, {
                    $inc: { followerCount: -1 },
                }),
            ])
            isNowFollowing = false
        } else {
            // Follow: create and increment both counters
            await Follow.create({
                follower: followerId,
                followee: followeeId,
            })
            await Promise.all([
                Profile.findByIdAndUpdate(followerId, {
                    $inc: { followingCount: 1 },
                }),
                Profile.findByIdAndUpdate(followeeId, {
                    $inc: { followerCount: 1 },
                }),
            ])
            isNowFollowing = true
        }

        return NextResponse.json(
            {
                message: `Successfully ${
                    isNowFollowing ? "followed" : "unfollowed"
                }`,
            },
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
