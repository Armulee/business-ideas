import { Idea } from "@/components/home/Ideas"
import connectDB from "@/database"
import Category from "@/database/Category"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        await connectDB()

        const request: Idea[] = await req.json()
        request.forEach(async (req) => {
            const newAIIdea = await new Category({ ...req })
            await newAIIdea.save()
        })

        return new NextResponse("ok", { status: 200 })
    } catch (err) {
        console.error(err)
    }
}
