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
        const name = await Profile.findOne({ profileId: id }).select("name")

        if (!name) {
            return NextResponse.json(
                { message: "Profile not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(name, { status: 200 })
    } catch (err) {
        console.error(err)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
