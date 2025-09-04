import Profile from "@/database/Profile"
import { Schema } from "mongoose"
import { NextResponse } from "next/server"

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const profile = await Profile.findById(new Schema.Types.ObjectId(id))

        if (!profile) {
            return NextResponse.json(
                { message: "Profile not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(profile.bookmarks, { status: 200 })
    } catch (err) {
        console.error(err)
    }
}
