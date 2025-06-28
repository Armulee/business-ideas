import connectDB from "@/database"
import Post from "@/database/Post"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        await connectDB()
        const [popularTags, topContributors] = await Promise.all([
            getPopularTags(8),
            getTopContributors(5),
        ])

        return NextResponse.json({
            popularTags,
            topContributors,
        })
    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { error: "Failed to get stats" },
            { status: 500 }
        )
    }
}

/**
 * Returns the top N tags by usage count.
 */
async function getPopularTags(limit: number) {
    const results = await Post.aggregate([
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit },
        {
            $project: {
                _id: 0,
                tag: "$_id",
                count: 1,
            },
        },
    ])
    return results as Array<{ tag: string; count: number }>
}

/**
 * Returns the top N contributors (users with most posts).
 */
async function getTopContributors(limit: number) {
    const results = await Post.aggregate([
        // Group posts by author (profile _id)
        { $group: { _id: "$author", count: { $sum: 1 } } },
        // Sort descending by post count
        { $sort: { count: -1 } },
        { $limit: limit },
        // Lookup profile details
        {
            $lookup: {
                from: "profiles", // your MongoDB collection name
                localField: "_id", // author ObjectId
                foreignField: "_id",
                as: "profile",
            },
        },
        { $unwind: "$profile" },
        {
            $project: {
                _id: 0,
                count: 1,
                profile: {
                    _id: "$profile._id",
                    profileId: "$profile.profileId",
                    name: "$profile.name",
                    avatar: "$profile.avatar",
                    // add any other fields you need
                },
            },
        },
    ])

    return results as Array<{
        profile: {
            _id: mongoose.Types.ObjectId
            name: string
            email: string
            profileId: number
            avatar?: string
        }
        count: number
    }>
}
