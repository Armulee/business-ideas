import connectDB from "@/database"
import Post, { IPost } from "@/database/Post"
import { PipelineStage, RootFilterQuery } from "mongoose"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    try {
        await connectDB()

        const searchParams = req.nextUrl.searchParams
        const query = searchParams.get("query") || ""
        const category = searchParams.get("category") || "All"
        const sortBy = searchParams.get("sortBy") || "recent"
        const page = parseInt(searchParams.get("page") ?? "1", 10)
        const limit = 10
        const skip = (page - 1) * limit

        // if (!query) return new NextResponse(JSON.stringify([]), { status: 200 })

        // 1) Build the match filter
        const filter: RootFilterQuery<IPost> = {}
        const escapeRegExp = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

        // \b ensures we only match at the start of a word
        filter.title = { $regex: new RegExp(`\\b${escapeRegExp}`, "i") }

        if (category !== "All") {
            filter.categories = { $in: [category] }
        }

        // 2) Start aggregation pipeline
        const pipeline: PipelineStage[] = []
        // – apply matching
        if (Object.keys(filter).length) {
            pipeline.push({ $match: filter })
        }
        // – compute our “virtual” fields
        pipeline.push({
            $addFields: {
                upvoteScore: {
                    $subtract: ["$upvoteCount", "$downvoteCount"],
                },
            },
        })

        // 3) Sort stage based on sortBy
        const sortStage: Record<string, 1 | -1> = {}
        switch (sortBy) {
            case "mostViewed":
                sortStage.viewCount = -1
                break
            case "mostUpvote":
                sortStage.upvoteScore = -1
                break
            case "mostDiscussed":
                sortStage.commentCount = -1
                break
            default:
                sortStage.createdAt = -1
                break
        }
        pipeline.push({ $sort: sortStage })

        // 4) Pagination
        pipeline.push({ $skip: skip })
        pipeline.push({ $limit: limit })

        // 5) Project only the fields we need
        // pipeline.push({
        //     $project: {
        //         title: 1,
        //         slug: 1,
        //         postId: 1,
        //         contentn: 1,
        //         category: 1,
        //         views: 1,
        //         upvotes: 1,
        //         downvotes: 1,
        //         comments: 1,
        //         createdAt: 1,
        //         author: {
        //             _id: "$author._id",
        //             name: "$author.name",
        //             avatar: "$author.avatar",
        //         },
        //     },
        // })

        // 5) Execute aggregation and populate author
        const searchResults = await Post.aggregate(pipeline)
            .lookup({
                from: "profiles",
                localField: "author",
                foreignField: "_id",
                as: "author",
            })
            .unwind("$author")
            .project({
                title: 1,
                content: 1,
                categories: 1,
                viewCount: 1,
                upvoteCount: 1,
                downvoteCount: 1,
                commentCount: 1,
                createdAt: 1,
                postLink: 1,
                author: {
                    _id: "$author._id",
                    name: "$author.name",
                    avatar: "$author.avatar",
                    profileId: "$author.profileId",
                },
            })
        return new NextResponse(JSON.stringify(searchResults), { status: 200 })
    } catch (err) {
        console.error(err)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

// function escapeRegExp(str: string) {
//     return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
// }
