import connectDB from "@/database"
import Administration from "@/database/Administration"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ actionId: string }> }
) {
    try {
        await connectDB()

        const { actionId } = await params

        if (!actionId) {
            return NextResponse.json(
                { error: "Action ID is required" },
                { status: 400 }
            )
        }

        const deletedAction = await Administration.findByIdAndDelete(actionId)

        if (!deletedAction) {
            return NextResponse.json(
                { error: "Administration action not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { message: "Administration action deleted successfully" },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error deleting administration action:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
