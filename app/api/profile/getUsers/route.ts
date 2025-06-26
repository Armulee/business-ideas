import connectDB from "@/database"
import Profile from "@/database/Profile"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const { ids } = await req.json()

        if (!ids || !Array.isArray(ids)) {
            return NextResponse.json(
                { message: "Invalid or missing ids" },
                { status: 400 }
            )
        }

        await connectDB()

        const profiles = await Profile.find({ _id: { $in: ids } }).select(
            "name avatar _id profileId followers following"
        )
        return NextResponse.json(profiles)
    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }
}
