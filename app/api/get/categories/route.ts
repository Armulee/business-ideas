import connectDB from "@/database"
import Category from "@/database/Category"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        await connectDB()

        // Limit to 5 suggestions
        const categories = await Category.find()

        return new NextResponse(JSON.stringify(categories), { status: 200 })
    } catch (err) {
        console.error(err)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
