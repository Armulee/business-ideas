import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/database"
import Activity, { IActivityPopulated } from "@/database/Activity"
import Profile from "@/database/Profile"

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ recipientId: string }> }
) {
    try {
        const { recipientId } = await params
        await connectDB()

        const activities: IActivityPopulated[] = await Activity.find({
            recipient: recipientId,
            actor: { $ne: recipientId },
        })
            .populate({ path: "actor", select: "name avatar profileId" })
            .populate({ path: "target", select: "title content postLink" })
            .select("type isRead createdAt actor target targetType")
            .sort({ createdAt: -1 })
            .limit(20) // paginate as you like

        const { hasSeenWelcome } =
            await Profile.findById(recipientId).select("hasSeenWelcome")

        return NextResponse.json(
            { hasSeenWelcome, activities },
            { status: 200 }
        )
    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }
}
