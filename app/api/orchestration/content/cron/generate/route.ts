import connectDB from "@/database"
import ContentOrchestration, {
    MainPlatformPrompts,
    SocialPlatformPrompts,
} from "@/database/ContentOrchestration"
import { NextResponse } from "next/server"
import { generateText } from "ai"

// Accurate Vercel AI Gateway Pricing (per million tokens)
const getModelPricing = (modelName: string) => {
    switch (modelName) {
        case "openai/gpt-5":
            return {
                input: 1.25 / 1000000, // $1.25 per million tokens
                output: 10.0 / 1000000, // $10.00 per million tokens
                displayName: "OpenAI GPT-5",
            }
        case "anthropic/claude-sonnet-4":
            return {
                input: 3.0 / 1000000, // $3.00 per million tokens
                output: 15.0 / 1000000, // $15.00 per million tokens
                displayName: "Anthropic Claude Sonnet 4",
            }
        case "xai/grok-4":
            return {
                input: 3.0 / 1000000, // Estimated pricing (not listed in Vercel)
                output: 15.0 / 1000000, // Estimated pricing
                displayName: "XAI Grok-4",
            }
        case "meta/llama-4-scout":
            return {
                input: 0.08 / 1000000, // Estimated pricing (not listed in Vercel)
                output: 0.3 / 1000000, // Estimated pricing
                displayName: "Meta Llama 4 Scout",
            }
        default:
            return {
                input: 1.0 / 1000000, // Default fallback
                output: 3.0 / 1000000, // Default fallback
                displayName: "Unknown Model",
            }
    }
}

async function generateContent(
    platformData: MainPlatformPrompts | SocialPlatformPrompts
) {
    try {
        const startTime = Date.now()
        const result = await generateText({
            // Using GPT-5 (most powerful OpenAI model)
            model: "openai/gpt-5",
            system: platformData.systemPrompt,
            prompt: platformData.userPrompt,
        })
        const endTime = Date.now()

        // Calculate accurate costs using Vercel AI Gateway pricing
        const modelPricing = getModelPricing("openai/gpt-5")
        const inputCost = (result.usage?.inputTokens || 0) * modelPricing.input
        const outputCost =
            (result.usage?.outputTokens || 0) * modelPricing.output
        const totalCost = inputCost + outputCost

        // Log AI usage and cost information
        console.log("🤖 AI Generation Cost - Main Content:")
        console.log("   Model:", modelPricing.displayName)
        console.log("   Duration:", endTime - startTime, "ms")
        console.log("   Usage:", result.usage)
        console.log(
            "   Tokens - Input:",
            result.usage?.inputTokens || 0,
            `($${modelPricing.input * 1000000}/M)`
        )
        console.log(
            "   Tokens - Output:",
            result.usage?.outputTokens || 0,
            `($${modelPricing.output * 1000000}/M)`
        )
        console.log("   Tokens - Total:", result.usage?.totalTokens || 0)
        console.log("   Estimated Cost: $", totalCost.toFixed(6))
        console.log("---")

        return result.text
    } catch (err) {
        console.error("❌ AI Generation Error:", err)
        return `Error: ${err instanceof Error ? err.message : "Unknown error"}`
    }
}

async function refineWithPlatformModel(
    originalContent: string,
    platformData: SocialPlatformPrompts,
    platform: "linkedin" | "x" | "meta"
) {
    try {
        let model: string

        switch (platform) {
            case "x":
                // Using Grok-4
                model = "xai/grok-4"
                break
            case "meta":
                // Using Llama 4 Scout
                model = "meta/llama-4-scout"
                break
            case "linkedin":
            default:
                // Using GPT-5
                model = "openai/gpt-5"
                break
        }

        const startTime = Date.now()
        const result = await generateText({
            model,
            system: platformData.systemPrompt,
            prompt: `${platformData.userPrompt}

${originalContent}`,
        })
        const endTime = Date.now()

        // Calculate accurate costs using Vercel AI Gateway pricing
        const modelPricing = getModelPricing(model)
        const inputCost = (result.usage?.inputTokens || 0) * modelPricing.input
        const outputCost =
            (result.usage?.outputTokens || 0) * modelPricing.output
        const totalCost = inputCost + outputCost

        // Log AI usage and cost information
        console.log(`🤖 AI Refinement Cost - ${platform.toUpperCase()}:`)
        console.log("   Model:", modelPricing.displayName)
        console.log("   Duration:", endTime - startTime, "ms")
        console.log(
            "   Tokens - Input:",
            result.usage?.inputTokens || 0,
            `($${modelPricing.input * 1000000}/M)`
        )
        console.log(
            "   Tokens - Output:",
            result.usage?.outputTokens || 0,
            `($${modelPricing.output * 1000000}/M)`
        )
        console.log("   Tokens - Total:", result.usage?.totalTokens || 0)
        console.log("   Estimated Cost: $", totalCost.toFixed(6))
        console.log("---")

        return result.text
    } catch (err) {
        console.error(err)
        return `Error: ${err instanceof Error ? err.message : "Unknown error"}`
    }
}

async function generateImagePrompt(mainContent: string): Promise<string> {
    try {
        const startTime = Date.now()
        const result = await generateText({
            model: "openai/gpt-5",
            system: "You are an expert visual content creator. Generate detailed, creative image prompts that will be used to create engaging visuals for social media posts. The prompts should be descriptive, specific, and optimized for AI image generation.",
            prompt: `Based on this main content, create a detailed image prompt that would generate a visually appealing image for social media:

${mainContent}

Generate a single, detailed image prompt (no explanations, just the prompt):`,
        })
        const endTime = Date.now()

        // Calculate accurate costs using Vercel AI Gateway pricing
        const modelPricing = getModelPricing("openai/gpt-5")
        const inputCost = (result.usage?.inputTokens || 0) * modelPricing.input
        const outputCost =
            (result.usage?.outputTokens || 0) * modelPricing.output
        const totalCost = inputCost + outputCost

        // Log AI usage and cost information
        console.log("🎨 AI Image Prompt Generation Cost:")
        console.log("   Model:", modelPricing.displayName)
        console.log("   Duration:", endTime - startTime, "ms")
        console.log(
            "   Tokens - Input:",
            result.usage?.inputTokens || 0,
            `($${modelPricing.input * 1000000}/M)`
        )
        console.log(
            "   Tokens - Output:",
            result.usage?.outputTokens || 0,
            `($${modelPricing.output * 1000000}/M)`
        )
        console.log("   Tokens - Total:", result.usage?.totalTokens || 0)
        console.log("   Estimated Cost: $", totalCost.toFixed(6))
        console.log("---")

        return result.text.trim()
    } catch (err) {
        console.error("❌ Error generating image prompt:", err)
        return "Professional business concept illustration, modern design, clean aesthetic"
    }
}

async function generateImage(prompt: string) {
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
        const mainContent = await generateContent(data.main)

        console.log(mainContent)
        // Generate image prompt based on main content using GPT-5
        const imagePrompt = await generateImagePrompt(mainContent)

        // Generate image using Leonardo AI with the generated prompt
        const sharedImage = await generateImage(imagePrompt)

        // Refine the main content for LinkedIn
        const linkedinContent = await refineWithPlatformModel(
            mainContent,
            data.linkedin,
            "linkedin"
        )

        // Refine the main content for X (Twitter)
        const xContent = await refineWithPlatformModel(mainContent, data.x, "x")

        // Refine the main content for Meta (Facebook/Instagram)
        const metaContent = await refineWithPlatformModel(
            mainContent,
            data.meta,
            "meta"
        )

        // Log total cost summary with accurate pricing
        console.log("💰 TOTAL AI GENERATION COST SUMMARY:")
        console.log(
            "   ✅ Main Content Generation (OpenAI GPT-5) - $1.25/$10.00 per M tokens"
        )
        console.log(
            "   ✅ Image Prompt Generation (OpenAI GPT-5) - $1.25/$10.00 per M tokens"
        )
        console.log(
            "   ✅ LinkedIn Refinement (OpenAI GPT-5) - $1.25/$10.00 per M tokens"
        )
        console.log(
            "   ✅ X Refinement (XAI Grok-4) - ~$2.00/$10.00 per M tokens (estimated)"
        )
        console.log(
            "   ✅ Meta Refinement (Meta Llama 4 Scout) - ~$0.50/$1.50 per M tokens (estimated)"
        )
        console.log("   ✅ Leonardo AI Image Generation - Separate API costs")
        console.log("   📊 Total Text API Calls: 5 generations")
        console.log(
            "   💡 Actual costs shown above for each API call using Vercel AI Gateway pricing"
        )
        console.log("   🔗 Source: https://vercel.com/ai-gateway/models")
        console.log("==========================================")

        const responseData: Record<string, unknown> = {
            main: mainContent,
            linkedin: linkedinContent,
            x: xContent,
            meta: metaContent,
            imagePrompt: imagePrompt,
        }

        if (sharedImage) {
            responseData.linkedinImage = sharedImage
            responseData.xImage = sharedImage
            responseData.metaImage = sharedImage
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

            // // Create new content entry
            const content = new ContentOrchestration({
                type: "content",
                generatedMain: mainContent,
                generatedLinkedin: linkedinContent,
                generatedLinkedinImage: sharedImage,
                generatedX: xContent,
                generatedXImage: sharedImage,
                generatedMeta: metaContent,
                generatedMetaImage: sharedImage,
                // Save the generated image prompts for all platforms
                generatedMainImagePrompt: imagePrompt,
                generatedLinkedinImagePrompt: imagePrompt,
                generatedXImagePrompt: imagePrompt,
                generatedMetaImagePrompt: imagePrompt,
                generatedAt: new Date(),
                contentExpiresAt,
            })

            await content.save()
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
