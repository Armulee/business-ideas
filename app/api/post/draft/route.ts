import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import connectDB from "@/database"
import DraftPost from "@/database/DraftPost"
import Profile from "@/database/Profile"

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        const body = await request.json()
        const {
            title,
            category,
            content,
            tags,
            community,
            advancedSettings,
            widgets,
        } = body

        // Find the user's profile
        const profile = await Profile.findById(session.user.id)
        if (!profile) {
            return NextResponse.json(
                { error: "Profile not found" },
                { status: 404 }
            )
        }

        // Always create a new draft (no longer limiting to one per community)
        const draft = new DraftPost({
            title,
            author: profile._id,
            category,
            content,
            tags,
            community,
            advancedSettings,
            widgets,
        })
        await draft.save()

        return NextResponse.json({
            message: "Draft saved successfully",
            draft: {
                id: draft._id,
                lastSavedAt: draft.lastSavedAt,
            },
        })
    } catch (error) {
        console.error("Error saving draft:", error)
        return NextResponse.json(
            { error: "Failed to save draft" },
            { status: 500 }
        )
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        // Find the user's profile
        const profile = await Profile.findById(session.user.id)
        if (!profile) {
            return NextResponse.json(
                { error: "Profile not found" },
                { status: 404 }
            )
        }

        // Get all drafts for this user
        const drafts = await DraftPost.find({ author: profile._id })
            .sort({ lastSavedAt: -1 })
            .select("title community lastSavedAt createdAt")

        return NextResponse.json({ drafts })
    } catch (error) {
        console.error("Error fetching drafts:", error)
        return NextResponse.json(
            { error: "Failed to fetch drafts" },
            { status: 500 }
        )
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const draftId = searchParams.get("id")

        if (!draftId) {
            return NextResponse.json(
                { error: "Draft ID required" },
                { status: 400 }
            )
        }

        await connectDB()

        // Find the user's profile
        const profile = await Profile.findById(session.user.id)
        if (!profile) {
            return NextResponse.json(
                { error: "Profile not found" },
                { status: 404 }
            )
        }

        // Delete the draft (only if it belongs to the user)
        const deleted = await DraftPost.findOneAndDelete({
            _id: draftId,
            author: profile._id,
        })

        if (!deleted) {
            return NextResponse.json(
                { error: "Draft not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ message: "Draft deleted successfully" })
    } catch (error) {
        console.error("Error deleting draft:", error)
        return NextResponse.json(
            { error: "Failed to delete draft" },
            { status: 500 }
        )
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        const body = await request.json()
        const {
            draftId,
            title,
            category,
            content,
            tags,
            community,
            advancedSettings,
            widgets,
        } = body

        if (!draftId) {
            return NextResponse.json(
                { error: "Draft ID required" },
                { status: 400 }
            )
        }

        // Find the user's profile
        const profile = await Profile.findById(session.user.id)
        if (!profile) {
            return NextResponse.json(
                { error: "Profile not found" },
                { status: 404 }
            )
        }

        // Update the draft (only if it belongs to the user)
        const draft = await DraftPost.findOneAndUpdate(
            { _id: draftId, author: profile._id },
            {
                title,
                category,
                content,
                tags,
                community,
                advancedSettings,
                widgets,
                updatedAt: new Date(),
                lastSavedAt: new Date(),
            },
            { new: true }
        )

        if (!draft) {
            return NextResponse.json(
                { error: "Draft not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            message: "Draft updated successfully",
            draft: {
                id: draft._id,
                lastSavedAt: draft.lastSavedAt,
            },
        })
    } catch (error) {
        console.error("Error updating draft:", error)
        return NextResponse.json(
            { error: "Failed to update draft" },
            { status: 500 }
        )
    }
}
