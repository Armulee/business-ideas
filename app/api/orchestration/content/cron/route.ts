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

        const parsedLinkedinContent = parseJSONContentFromClaude(linkedinRawContent)

        if (parsedLinkedinContent) {
            // Generate image if required
            if (parsedLinkedinContent.image_required && parsedLinkedinContent.image_brief) {
                linkedinImage = await generateImageWithLeonardo(
                    parsedLinkedinContent.image_brief
                )
            }

            // Return the parsed JSON object directly
            linkedinContent = parsedLinkedinContent
        }

        // Refine the main content for X (Twitter)
        const xRawContent = await refineWithClaude(
            mainContent,
            data.x
        )

        // Parse X JSON response
        let xContent = xRawContent
        let xImage = null

        const parsedXContent = parseJSONContentFromClaude(xRawContent)

        if (parsedXContent) {
            // Generate image if required
            if (parsedXContent.image_required && parsedXContent.image_brief) {
                xImage = await generateImageWithLeonardo(
                    parsedXContent.image_brief
                )
            }

            // Return the parsed JSON object directly
            xContent = parsedXContent
        }

        // Refine the main content for Meta (Facebook/Instagram)
        const metaRawContent = await refineWithClaude(
            mainContent,
            data.meta
        )

        // Parse Meta JSON response
        let metaContent = metaRawContent
        let metaImage = null

        const parsedMetaContent = parseJSONContentFromClaude(metaRawContent)

        if (parsedMetaContent) {
            // Generate image if required
            if (parsedMetaContent.image_required && parsedMetaContent.image_brief) {
                metaImage = await generateImageWithLeonardo(
                    parsedMetaContent.image_brief
                )
            }

            // Return the parsed JSON object directly
            metaContent = parsedMetaContent
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
