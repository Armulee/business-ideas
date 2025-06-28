import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/database"
import { getProfileStats } from "@/lib/get-profile"
import Profile from "@/database/Profile"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        
        await connectDB()
        
        // First get the profile to get its ObjectId
        const profile = await Profile.findOne({ profileId: Number(id) })
        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 })
        }
        
        // Get profile stats
        const data = await getProfileStats(profile._id)
        
        return NextResponse.json(data)
    } catch (error) {
        console.error("Error fetching profile stats:", error)
        return NextResponse.json(
            { error: "Failed to fetch profile stats" },
            { status: 500 }
        )
    }
}