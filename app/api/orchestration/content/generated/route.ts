import connectDB from "@/database"
import ContentOrchestration from "@/database/ContentOrchestration"
import { NextResponse } from "next/server"

// GET - Check if generated content exists and fetch it
export async function GET() {
    try {
        await connectDB()

        // Find the most recent generated content that hasn't expired
        const content = await ContentOrchestration.findOne({
            type: "content",
            contentExpiresAt: { $gt: new Date() }
        }).sort({ createdAt: -1 })

        if (!content) {
            return NextResponse.json({
                exists: false,
                content: null
            })
        }

        return NextResponse.json({
            exists: true,
            content: {
                main: content.generatedMain,
                linkedin: content.generatedLinkedin,
                linkedinImage: content.generatedLinkedinImage,
                x: content.generatedX,
                xImage: content.generatedXImage,
                meta: content.generatedMeta,
                metaImage: content.generatedMetaImage,
                generatedAt: content.generatedAt
            }
        })
    } catch (error) {
        console.error("Error fetching generated content:", error)
        return NextResponse.json(
            { error: "Failed to fetch generated content" },
            { status: 500 }
        )
    }
}

// POST - Save generated content to database
export async function POST(request: Request) {
    try {
        await connectDB()

        const { main, linkedin, linkedinImage, x, xImage, meta, metaImage } = await request.json()

        // Delete any existing content first
        await ContentOrchestration.deleteMany({ type: "content" })

        // Set expiration time to 8pm today (20:00)
        const now = new Date()
        const contentExpiresAt = new Date()
        contentExpiresAt.setHours(20, 0, 0, 0) // Set to 8pm today
        
        // If current time is after 8pm, set expiration to 8pm tomorrow
        if (now.getHours() >= 20) {
            contentExpiresAt.setDate(contentExpiresAt.getDate() + 1)
        }

        // Create new content entry
        const content = new ContentOrchestration({
            type: "content",
            generatedMain: main,
            generatedLinkedin: linkedin,
            generatedLinkedinImage: linkedinImage,
            generatedX: x,
            generatedXImage: xImage,
            generatedMeta: meta,
            generatedMetaImage: metaImage,
            generatedAt: new Date(),
            contentExpiresAt
        })

        await content.save()

        return NextResponse.json({
            success: true,
            message: "Content saved successfully",
            expiresAt: contentExpiresAt
        })
    } catch (error) {
        console.error("Error saving generated content:", error)
        return NextResponse.json(
            { error: "Failed to save generated content" },
            { status: 500 }
        )
    }
}