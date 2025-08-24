import { NextRequest, NextResponse } from "next/server"
import connectToDB from "@/database"
import Orchestration from "@/database/Orchestration"

export async function GET() {
    try {
        await connectToDB()

        let orchestration = await Orchestration.findOne({ type: "content" })

        if (!orchestration) {
            orchestration = await Orchestration.create({
                type: "content",
            })
        }

        return NextResponse.json({
            main: orchestration.main,
            linkedin: orchestration.linkedin,
            x: orchestration.x,
            meta: orchestration.meta,
        })
    } catch (error) {
        console.error("Error fetching orchestration settings:", error)
        return NextResponse.json(
            { error: "Failed to fetch orchestration settings" },
            { status: 500 }
        )
    }
}

export async function PATCH(request: NextRequest) {
    try {
        await connectToDB()

        const updateData = await request.json()

        let orchestration = await Orchestration.findOne({ type: "content" })

        if (!orchestration) {
            orchestration = await Orchestration.create({
                type: "content",
                main: updateData.main || { systemPrompt: "", userPrompt: "" },
                linkedin: updateData.linkedin || { systemPrompt: "", userPrompt: "" },
                x: updateData.x || { systemPrompt: "", userPrompt: "" },
                meta: updateData.meta || { systemPrompt: "", userPrompt: "" },
            })
        } else {
            // Update platforms - merge with existing data
            if (updateData.main) orchestration.main = updateData.main
            if (updateData.linkedin) orchestration.linkedin = updateData.linkedin
            if (updateData.x) orchestration.x = updateData.x
            if (updateData.meta) orchestration.meta = updateData.meta

            await orchestration.save()
        }

        return NextResponse.json({
            main: orchestration.main,
            linkedin: orchestration.linkedin,
            x: orchestration.x,
            meta: orchestration.meta,
        })
    } catch (error) {
        console.error("Error updating orchestration settings:", error)
        return NextResponse.json(
            { error: "Failed to update orchestration settings" },
            { status: 500 }
        )
    }
}
