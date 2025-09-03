import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
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

async function generateAIContent(
    platform: string,
    prompt: string,
    mainContent: string,
    currentContent: string
): Promise<string> {
    try {
        let model: string
        let systemPrompt: string

        // Select appropriate model and system prompt for each platform
        switch (platform) {
            case "x":
                model = "xai/grok-4"
                systemPrompt = `You are a social media content specialist for X (Twitter). Generate optimized content that is:
                - Concise and engaging (under 280 characters)
                - Hashtag-friendly and trending
                - Optimized for Twitter's fast-paced environment
                - Maintains the core message while being platform-specific
                
                Always maintain the core message while adapting to X's best practices.`
                break
            case "meta":
                model = "meta/llama-4-scout"
                systemPrompt = `You are a social media content specialist for Meta (Facebook/Instagram). Generate optimized content that is:
                - Casual, friendly, and engaging
                - Optimized for social media audience engagement
                - Visual-friendly and shareable
                - Maintains the core message while being platform-specific
                
                Always maintain the core message while adapting to Meta's best practices.`
                break
            case "linkedin":
            default:
                model = "openai/gpt-5"
                systemPrompt = `You are a social media content specialist for LinkedIn. Generate optimized content that is:
                - Professional and business-focused
                - Engaging for professionals and industry leaders
                - Thought-provoking and value-driven
                - Maintains the core message while being platform-specific
                
                Always maintain the core message while adapting to LinkedIn's best practices.`
                break
        }

        const startTime = Date.now()
        const result = await generateText({
            model,
            system: systemPrompt,
            prompt: `Prompt: ${prompt}
            
            Main Content: ${mainContent}
            
            Current ${platform} Content: ${currentContent}
            
            Please generate new, improved content for ${platform}.`,
        })
        const endTime = Date.now()

        // Calculate accurate costs using Vercel AI Gateway pricing
        const modelPricing = getModelPricing(model)
        const inputCost = (result.usage?.inputTokens || 0) * modelPricing.input
        const outputCost =
            (result.usage?.outputTokens || 0) * modelPricing.output
        const totalCost = inputCost + outputCost

        // Log AI usage and cost information
        console.log(`🤖 AI Regeneration Cost - ${platform.toUpperCase()}:`)
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
        console.error(`❌ AI Regeneration Error for ${platform}:`, err)
        return `Error: ${err instanceof Error ? err.message : "Unknown error"}`
    }
}

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            )
        }

        // Check if user is admin
        if (session.user.role !== "admin") {
            return NextResponse.json(
                { success: false, message: "Forbidden" },
                { status: 403 }
            )
        }

        const { platform, prompt, mainContent, currentContent } =
            await request.json()

        if (!platform || !prompt) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            )
        }

        // Generate AI content using Vercel AI Gateway
        const aiResponse = await generateAIContent(
            platform,
            prompt,
            mainContent || "",
            currentContent || ""
        )

        return NextResponse.json({
            success: true,
            content: aiResponse,
            message: "Content regenerated successfully",
        })
    } catch (error) {
        console.error("Content regeneration error:", error)
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        )
    }
}
