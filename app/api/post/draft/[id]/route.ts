import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import connectDB from "@/database"
import DraftPost from "@/database/DraftPost"
import Profile from "@/database/Profile"
import mongoose from "mongoose"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        // Find the user's profile
        const profile = await Profile.findById(session.user.id)
        if (!profile) {
            return NextResponse.json(
                { error: "Profile not found" },
                { status: 404 }
            )
        }

        // Get specific draft for this user
        const { id: draftId } = await params
        
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(draftId)) {
            return NextResponse.json(
                { error: "Invalid draft ID format" },
                { status: 400 }
            )
        }

        const draft = await DraftPost.findOne({
            _id: draftId,
            author: profile._id,
        })

        if (!draft) {
            return NextResponse.json(
                { error: "Draft not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ draft })
    } catch (error) {
        console.error("Error fetching draft:", error)
        return NextResponse.json(
            { error: "Failed to fetch draft" },
            { status: 500 }
        )
    }
}
