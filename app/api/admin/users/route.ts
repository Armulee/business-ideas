import { NextResponse } from "next/server"
import { auth } from "@/auth"
import connectDB from "@/database"
import Profile from "@/database/Profile"

export async function GET(request: Request) {
    try {
        const session = await auth()

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        // Check if user is admin
        const adminProfile = await Profile.findOne({
            email: session.user.email,
        })
        if (!adminProfile || adminProfile.role !== "admin") {
            return NextResponse.json(
                { error: "Admin access required" },
                { status: 403 }
            )
        }

        const url = new URL(request.url)
        const page = parseInt(url.searchParams.get("page") || "1")
        const limit = parseInt(url.searchParams.get("limit") || "20")
        const search = url.searchParams.get("search") || ""
        const startDate = url.searchParams.get("startDate")
        const endDate = url.searchParams.get("endDate")

        const skip = (page - 1) * limit

        // Build query
        interface QueryFilter {
            $or?: Array<
                | { name: { $regex: string; $options: string } }
                | { email: { $regex: string; $options: string } }
            >
            createdAt?: {
                $gte?: Date
                $lte?: Date
            }
        }

        const query: QueryFilter = {}

        if (search) {
            // Use word boundary regex for exact word matching
            const searchRegex = `\\b${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`
            query.$or = [
                { name: { $regex: searchRegex, $options: "i" } },
                { email: { $regex: searchRegex, $options: "i" } },
            ]
        }

        if (startDate || endDate) {
            query.createdAt = {}
            if (startDate) query.createdAt.$gte = new Date(startDate)
            if (endDate) query.createdAt.$lte = new Date(endDate)
        }

        const [users, totalCount] = await Promise.all([
            Profile.find(query)
                .select("profileId name email avatar role createdAt updatedAt")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Profile.countDocuments(query),
        ])

        return NextResponse.json({
            users,
            pagination: {
                page,
                limit,
                total: totalCount,
                pages: Math.ceil(totalCount / limit),
                hasNext: page * limit < totalCount,
                hasPrev: page > 1,
            },
        })
    } catch (error) {
        console.error("Error fetching users:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
