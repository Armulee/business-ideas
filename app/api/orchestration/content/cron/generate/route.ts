import connectDB from "@/database"
import ContentOrchestration, { MainPlatformPrompts, SocialPlatformPrompts } from "@/database/ContentOrchestration"
import { NextResponse } from "next/server"
import { generateText } from "ai"

async function generateContentWithAI(platformData: MainPlatformPrompts | SocialPlatformPrompts) {
    try {
        const { text } = await generateText({
            // ANTHROPIC STYLE
            // model: anthropic("claude-sonnet-4-20250514"),
            // AI GATEWAY STYLE
            model: "anthropic/claude-sonnet-4",
            system: platformData.systemPrompt,
            prompt: platformData.userPrompt,
        })

        return text
    } catch (err) {
        console.error(err)
        return `Error: ${err instanceof Error ? err.message : "Unknown error"}`
    }
}

async function refineWithClaude(
    originalContent: string,
    platformData: SocialPlatformPrompts
) {
    try {
        const { text } = await generateText({
            // ANTHROPIC STYLE
            // model: anthropic("claude-sonnet-4-20250514"),
            // AI GATEWAY STYLE
            model: "anthropic/claude-sonnet-4",
            system: platformData.systemPrompt,
            prompt: `${platformData.userPrompt}

${originalContent}`,
        })

        return text
    } catch (err) {
        console.error(err)
        return `Error: ${err instanceof Error ? err.message : "Unknown error"}`
    }
}


async function generateImageWithLeonardo(prompt: string) {
    if (!process.env.LEONARDO_API) {
        throw new Error("Leonardo API key not configured")
    }

    try {
        // Generate image using Leonardo AI
        const response = await fetch(
            "https://cloud.leonardo.ai/api/rest/v1/generations",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.LEONARDO_API}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: prompt,
                    modelId: "b24e16ff-06e3-43eb-8d33-4416c2d75876", // Leonardo Lucid Origin
                    width: 1024,
                    height: 1024,
                    num_images: 1,
                    guidance_scale: 7,
                }),
            }
        )

        if (!response.ok) {
            throw new Error(`Leonardo API failed: ${response.status}`)
        }

        const data = await response.json()
        const generationId = data.sdGenerationJob.generationId

        // Poll for completion
        let imageUrl = null
        let attempts = 0
        const maxAttempts = 30 // 30 seconds timeout

        while (!imageUrl && attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait 1 second

            const statusResponse = await fetch(
                `https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.LEONARDO_API}`,
                    },
                }
            )

            if (statusResponse.ok) {
                const statusData = await statusResponse.json()
                if (
                    statusData.generations_by_pk?.generated_images?.length > 0
                ) {
                    imageUrl =
                        statusData.generations_by_pk.generated_images[0].url
                    break
                }
            }
            attempts++
        }

        if (!imageUrl) {
            throw new Error("Image generation timeout")
        }

        return imageUrl
    } catch (err) {
        console.error("Leonardo AI error:", err)
        return null
    }
}

export async function POST() {
    try {
        await connectDB()

        // Fetch ContentOrchestration collection that has type: 'prompts' from db
        const data = await ContentOrchestration.findOne({ type: "prompts" })

        if (!data) {
            return NextResponse.json(
                { error: "No orchestration configuration found" },
                { status: 404 }
            )
        }

        // Generate content for main platform
        const mainContent = await generateContentWithAI(data.main)

        // Refine the main content for LinkedIn
        const linkedinContent = await refineWithClaude(
            mainContent,
            data.linkedin
        )

        // Generate LinkedIn image using imagePrompt from settings
        let linkedinImage = null
        if (data.linkedin.imagePrompt && data.linkedin.imagePrompt.trim()) {
            linkedinImage = await generateImageWithLeonardo(data.linkedin.imagePrompt)
        }

        // Refine the main content for X (Twitter)
        const xContent = await refineWithClaude(
            mainContent,
            data.x
        )

        // Generate X image using imagePrompt from settings
        let xImage = null
        if (data.x.imagePrompt && data.x.imagePrompt.trim()) {
            xImage = await generateImageWithLeonardo(data.x.imagePrompt)
        }

        // Refine the main content for Meta (Facebook/Instagram)
        const metaContent = await refineWithClaude(
            mainContent,
            data.meta
        )

        // Generate Meta image using imagePrompt from settings
        let metaImage = null
        if (data.meta.imagePrompt && data.meta.imagePrompt.trim()) {
            metaImage = await generateImageWithLeonardo(data.meta.imagePrompt)
        }

        const responseData: Record<string, unknown> = {
            main: mainContent,
            linkedin: linkedinContent,
            x: xContent,
            meta: metaContent,
        }

        if (linkedinImage) {
            responseData.linkedinImage = linkedinImage
        }

        if (xImage) {
            responseData.xImage = xImage
        }

        if (metaImage) {
            responseData.metaImage = metaImage
        }

        // Save to database for persistence and preview functionality
        try {
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
                generatedMain: mainContent,
                generatedLinkedin: linkedinContent,
                generatedLinkedinImage: linkedinImage,
                generatedX: xContent,
                generatedXImage: xImage,
                generatedMeta: metaContent,
                generatedMetaImage: metaImage,
                generatedAt: new Date(),
                contentExpiresAt
            })

            await content.save()
            console.log("Generated content saved to database successfully")
        } catch (dbError) {
            console.error("Failed to save to database:", dbError)
            // Don't fail the entire request if database save fails
        }

        return NextResponse.json({
            success: true,
            message: "Content generation completed successfully",
            data: responseData,
        })
    } catch (error) {
        console.error("Error in cron content generation:", error)
        return NextResponse.json(
            { error: "Failed to generate content" },
            { status: 500 }
        )
    }
}
