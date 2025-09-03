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
            contentExpiresAt: { $gt: new Date() },
        }).sort({ createdAt: -1 })

        if (!content) {
            return NextResponse.json({
                exists: false,
                content: null,
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
                // Include generated image prompts
                mainImagePrompt: content.generatedMainImagePrompt,
                linkedinImagePrompt: content.generatedLinkedinImagePrompt,
                xImagePrompt: content.generatedXImagePrompt,
                metaImagePrompt: content.generatedMetaImagePrompt,
                generatedAt: content.generatedAt,
            },
        })
    } catch (error) {
        console.error("Error fetching generated content:", error)
        return NextResponse.json(
            { error: "Failed to fetch generated content" },
            { status: 500 }
        )
    }
}

// PUT - Update generated content in database
export async function PUT(request: Request) {
    try {
        await connectDB()

        const {
            main,
            linkedin,
            linkedinImage,
            x,
            xImage,
            meta,
            metaImage,
            mainImagePrompt,
            linkedinImagePrompt,
            xImagePrompt,
            metaImagePrompt,
        } = await request.json()

        // Find existing content and update it
        const existingContent = await ContentOrchestration.findOne({
            type: "content",
        })

        if (!existingContent) {
            return NextResponse.json(
                { error: "No content found to update" },
                { status: 404 }
            )
        }

        // Update the existing content
        existingContent.generatedMain = main
        existingContent.generatedLinkedin = linkedin
        existingContent.generatedLinkedinImage = linkedinImage
        existingContent.generatedX = x
        existingContent.generatedXImage = xImage
        existingContent.generatedMeta = meta
        existingContent.generatedMetaImage = metaImage
        existingContent.generatedMainImagePrompt = mainImagePrompt
        existingContent.generatedLinkedinImagePrompt = linkedinImagePrompt
        existingContent.generatedXImagePrompt = xImagePrompt
        existingContent.generatedMetaImagePrompt = metaImagePrompt

        await existingContent.save()

        return NextResponse.json({
            success: true,
            message: "Content updated successfully",
        })
    } catch (error) {
        console.error("Error updating generated content:", error)
        return NextResponse.json(
            { error: "Failed to update generated content" },
            { status: 500 }
        )
    }
}

// DELETE - Delete generated content from database
export async function DELETE() {
    try {
        await connectDB()

        // Delete all generated content
        await ContentOrchestration.deleteMany({ type: "content" })

        return NextResponse.json({
            success: true,
            message: "Content deleted successfully",
        })
    } catch (error) {
        console.error("Error deleting generated content:", error)
        return NextResponse.json(
            { error: "Failed to delete generated content" },
            { status: 500 }
        )
    }
}
