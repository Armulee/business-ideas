import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import connectDB from "@/database"
import Policy from "@/database/Policy"

// GET - Fetch all policies
export async function GET() {
    try {
        await connectDB()

        const policies = await Policy.find().sort({ type: 1 }).lean()

        return NextResponse.json({
            success: true,
            policies,
        })
    } catch (error) {
        console.error("Error fetching policies:", error)
        return NextResponse.json(
            { success: false, message: "Failed to fetch policies" },
            { status: 500 }
        )
    }
}

interface PolicySection {
    title: string
    content: string
    list?: string[]
}

// POST - Create or update policy
export async function PATCH(req: NextRequest) {
    let type: string | undefined
    let sections: PolicySection[] | undefined
    
    try {
        const session = await auth()
        if (!session?.user?.email || session.user.role !== "admin") {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            )
        }

        const body = await req.json()
        type = body.type
        sections = body.sections

        // Validate required fields
        if (!type || !sections) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            )
        }

        // Validate type
        if (!["privacy-policy", "terms-conditions"].includes(type)) {
            return NextResponse.json(
                { success: false, message: "Invalid policy type" },
                { status: 400 }
            )
        }

        // Validate sections
        for (const section of sections) {
            if (!section.content) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Each section must have content",
                    },
                    { status: 400 }
                )
            }
        }

        await connectDB()

        // Update existing policy or create new one
        const policy = await Policy.findOneAndUpdate(
            { type },
            {
                type,
                sections,
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
            }
        )

        return NextResponse.json({
            success: true,
            message: "Policy updated successfully",
            policy,
        })
    } catch (error) {
        console.error("Error updating policy:", error)
        console.error("Error details:", {
            message: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : undefined,
            type,
            sectionsCount: sections?.length,
        })
        return NextResponse.json(
            { success: false, message: "Failed to update policy", error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        )
    }
}
