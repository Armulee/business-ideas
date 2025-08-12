import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import connectToDB from "@/database"
import Feedback from "@/database/Feedback"

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()
        
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: "Unauthorized - Admin access required" },
                { status: 401 }
            )
        }

        await connectToDB()

        const { id } = params

        // Get specific feedback with user profile populated (if exists)
        const feedback = await Feedback.findById(id).populate({
            path: 'user',
            select: 'name avatar profileId'
        })

        if (!feedback) {
            return NextResponse.json(
                { error: "Feedback not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(feedback)
    } catch (error) {
        console.error("Error fetching feedback details:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()
        
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: "Unauthorized - Admin access required" },
                { status: 401 }
            )
        }

        await connectToDB()

        const { id } = params

        // Delete the feedback
        const deletedFeedback = await Feedback.findByIdAndDelete(id)

        if (!deletedFeedback) {
            return NextResponse.json(
                { error: "Feedback not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { message: "Feedback deleted successfully" },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error deleting feedback:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}