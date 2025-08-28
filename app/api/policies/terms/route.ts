import { NextResponse } from "next/server"
import connectDB from "@/database"
import Policy from "@/database/Policy"

// GET - Fetch active policies for frontend
export async function GET() {
    try {
        await connectDB()

        const termsConditions = await Policy.find({ type: "terms-conditions" })

        return NextResponse.json(termsConditions)
    } catch (error) {
        console.error("Error fetching policies:", error)
        return NextResponse.json(
            { success: false, message: "Failed to fetch policies" },
            { status: 500 }
        )
    }
}
