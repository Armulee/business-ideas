import { NextResponse } from "next/server"
import { auth } from "@/auth"
import connectDB from "@/database"
import Profile from "@/database/Profile"

export async function PATCH() {
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
        const profile = await Profile.findByIdAndUpdate(
            session.user.id,
            { hasSeenWelcome: true },
            { new: true }
        )
        
        if (!profile) {
            return NextResponse.json(
                { error: "Profile not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            hasSeenWelcome: true
        })

    } catch (error) {
        console.error("Mark welcome seen error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}