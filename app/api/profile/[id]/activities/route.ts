import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/database"
import { getProfileActivities } from "@/lib/get-profile"
import Profile from "@/database/Profile"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"

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
        
        // Check if current user is the profile owner
        const session = await getServerSession(authOptions)
        const isOwner = session?.user?.profile === Number(id)
        
        // Get profile activities (conditional private data for owner)
        const data = await getProfileActivities(profile._id, isOwner)
        
        return NextResponse.json(data)
    } catch (error) {
        console.error("Error fetching profile activities:", error)
        return NextResponse.json(
            { error: "Failed to fetch profile activities" },
            { status: 500 }
        )
    }
}