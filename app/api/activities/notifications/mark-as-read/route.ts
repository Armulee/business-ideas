import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/database"
import Activity from "@/database/Activity"

export async function PATCH(req: NextRequest) {
    try {
        const { recipientId, ids }: { recipientId: string; ids: string[] } =
            await req.json()

        if (!recipientId || !Array.isArray(ids)) {
            return NextResponse.json(
                { error: "Invalid payload" },
                { status: 400 }
            )
        }

        await connectDB()

        await Activity.updateMany(
            { recipient: recipientId, _id: { $in: ids } },
            { isRead: true }
        )

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }
}
