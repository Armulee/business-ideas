import { NextResponse } from "next/server"
import { auth } from "@/auth"
import connectDB from "@/database"
import Profile from "@/database/Profile"

export async function GET() {
    try {
        const session = await auth()
        
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        await connectDB()

        // session.user.id contains the MongoDB Profile _id
        const profile = await Profile.findById(session.user.id)
        
        if (!profile) {
            return NextResponse.json(
                { error: "Profile not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            hasSeenWelcome: profile.hasSeenWelcome || false
        })

    } catch (error) {
        console.error("Welcome status check error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}