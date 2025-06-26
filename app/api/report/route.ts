import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/database"
import Report from "@/database/Report"

export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const { reporter, target, targetType, reason, details } =
            await req.json()

        if (!reporter || !target || !targetType || !reason) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        const report = await Report.create({
            reporter,
            target,
            targetType,
            reason,
            details,
        })

        return NextResponse.json(
            { success: true, reportId: report._id },
            { status: 201 }
        )
    } catch (err) {
        console.error("[POST /api/reports]", err)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}
