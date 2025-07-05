import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams
        const email = searchParams.get("email")

        if (!email) {
            return NextResponse.json(
                { message: "Email required" },
                { status: 400 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                provider: true,
                password: true,
                authenticators: true,
            },
        })
        if (!user) {
            return NextResponse.json({
                exists: false,
                authMethod: null,
            })
        }

        // Check if user has passkey (authenticators)
        const hasPasskey = user.authenticators && user.authenticators.length > 0

        // Determine auth method based on provider and available methods
        let authMethod = null
        if (hasPasskey) {
            authMethod = "passkey"
        } else if (user.provider === "credentials" && user.password) {
            authMethod = "password"
        } else if (user.provider === "google") {
            authMethod = "google"
        } else if (user.provider === "twitter") {
            authMethod = "twitter"
        } else {
            authMethod = "unknown"
        }

        return NextResponse.json({
            exists: true,
            authMethod,
            provider: user.provider,
            hasPasskey,
            hasPassword: !!user.password,
        })
    } catch (error) {
        console.error("Check auth method error:", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}
