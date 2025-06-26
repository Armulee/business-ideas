import connectDB from "@/database"
import Profile from "@/database/Profile"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        await connectDB()
        const profile = await Profile.findOne({ profileId: id }).populate(
            "user",
            "email"
        )

        if (!profile) {
            return NextResponse.json(
                { message: "Profile not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(profile, { status: 200 })
    } catch (err) {
        console.error(err)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
