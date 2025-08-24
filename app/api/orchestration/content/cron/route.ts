import connectDB from "@/database"
import Orchestration, { PlatformPrompts } from "@/database/Orchestration"
import { NextResponse } from "next/server"
import { generateText } from "ai"

async function generateContentWithAI(platformData: PlatformPrompts) {
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
    platformData: PlatformPrompts
) {
    try {
        const { text } = await generateText({
            // ANTHROPIC STYLE
            // model: anthropic("claude-sonnet-4-20250514"),
            // AI GATEWAY STYLE
            model: "anthropic/claude-sonnet-4",
            system: platformData.systemPrompt,
            prompt: `${platformData.userPrompt}

Original Content to Refine:
${originalContent}`,
        })

        return text
    } catch (err) {
        console.error(err)
        return `Error: ${err instanceof Error ? err.message : "Unknown error"}`
    }
}

function parseJSONContentFromClaude(rawContent: string) {
    // Remove markdown code blocks and clean up the JSON
    let jsonString = rawContent.trim()
    if (jsonString.startsWith("```json")) {
        jsonString = jsonString
            .replace(/^```json\s*/, "")
            .replace(/\s*```$/, "")
    } else if (jsonString.startsWith("```")) {
        jsonString = jsonString.replace(/^```\s*/, "").replace(/\s*```$/, "")
    }

    try {
        return JSON.parse(jsonString)
    } catch (parseError) {
        console.error("JSON parsing error:", parseError)
        return null
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

        // Fetch Orchestration collection that has type: 'content' from db
        const data = await Orchestration.findOne({ type: "content" })

        if (!data) {
            return NextResponse.json(
                { error: "No orchestration configuration found" },
                { status: 404 }
            )
        }

        // Generate content for main platform
        const mainContent = await generateContentWithAI(data.main)

        // Refine the main content for LinkedIn
        const linkedinRawContent = await refineWithClaude(
            mainContent,
            data.linkedin
        )

        // Parse LinkedIn JSON response
        let linkedinContent = linkedinRawContent
        let linkedinImage = null

        const parsedContent = parseJSONContentFromClaude(linkedinRawContent)

        if (parsedContent) {
            // Generate image if required
            if (parsedContent.image_required && parsedContent.image_brief) {
                console.log("Generating image with Leonardo AI...")
                linkedinImage = await generateImageWithLeonardo(
                    parsedContent.image_brief
                )
            }

            // Return the parsed JSON object directly
            linkedinContent = parsedContent
        }

        const responseData: Record<string, unknown> = {
            main: mainContent,
            linkedin: linkedinContent,
        }

        if (linkedinImage) {
            responseData.linkedinImage = linkedinImage
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
