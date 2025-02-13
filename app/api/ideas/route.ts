import connectDB from "@/database"
import AI_Ideas from "@/database/Category"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        await connectDB()

        // Limit to 5 suggestions
        const ideas = await AI_Ideas.find()

        return new NextResponse(JSON.stringify(ideas), { status: 200 })
    } catch (err) {
        console.error(err)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
