import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import connectDB from "@/database"
import Joinlist from "@/database/Joinlist"
import Profile from "@/database/Profile"

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const { profileId, type, marketing } = await request.json()

        if (!profileId || !type) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        // Connect to MongoDB
        await connectDB()

        // Find the profile by user ID
        const profile = await Profile.findOne({ user: profileId })
        
        if (!profile) {
            return NextResponse.json(
                { error: "Profile not found" },
                { status: 404 }
            )
        }

        // Check if user already exists in joinlist
        const existingJoinlist = await Joinlist.findOne({ profile: profile._id })
        
        if (existingJoinlist) {
            // Update existing entry
            existingJoinlist.marketing = marketing
            existingJoinlist.updatedAt = new Date()
            await existingJoinlist.save()
        } else {
            // Create new joinlist entry
            const joinlistEntry = new Joinlist({
                profile: profile._id,
                type,
                marketing: marketing || false,
            })
            await joinlistEntry.save()
        }

        return NextResponse.json(
            { message: "Successfully saved to joinlist" },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error saving joinlist data:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        const session = await auth()
        
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        // Check if user is admin
        await connectDB()
        const profile = await Profile.findOne({ user: session.user.id })
        
        if (!profile || profile.role !== 'admin') {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            )
        }

        // Get all joinlist entries with populated profile data
        const joinlistEntries = await Joinlist.find()
            .populate('profile', 'name email avatar role createdAt')
            .sort({ createdAt: -1 })

        return NextResponse.json(joinlistEntries, { status: 200 })
    } catch (error) {
        console.error("Error fetching joinlist data:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}