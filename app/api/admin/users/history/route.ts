import connectDB from "@/database"
import Administration from "@/database/Administration"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    try {
        await connectDB()

        const url = new URL(request.url)
        const page = parseInt(url.searchParams.get("page") || "1")
        const limit = parseInt(url.searchParams.get("limit") || "20")
        const skip = (page - 1) * limit

        const total = await Administration.countDocuments()
        const actions = await Administration.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()

        const pagination = {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1,
        }

        return NextResponse.json({ actions, pagination }, { status: 200 })
    } catch (error) {
        console.error("Error fetching admin actions:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
