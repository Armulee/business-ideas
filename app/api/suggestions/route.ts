import connectDB from "@/database"
import AI_Ideas from "@/database/Category"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    try {
        await connectDB()
        const searchParams = req.nextUrl.searchParams
        const query = searchParams.get("value")

        if (!query) return new NextResponse(JSON.stringify([]), { status: 200 })

        // MongoDB search filter: match words that start with the query
        const filter = {
            $or: [
                { title: { $regex: query, $options: "i" } }, // Match words starting with query
                { category: { $regex: query, $options: "i" } },
                // { description: { $regex: `${query}`, $options: "i" } },
            ],
        }

        // Limit to 5 suggestions
        const suggestions = await AI_Ideas.find(filter).select("title") // Only return titles

        return new NextResponse(JSON.stringify(suggestions), { status: 200 })
    } catch (err) {
        console.error(err)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
