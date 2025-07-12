import { NextResponse } from "next/server"
import { auth } from "@/auth"
import connectDB from "@/database"
import Profile from "@/database/Profile"

export async function POST(request: Request) {
    try {
        const session = await auth()

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        // Check if user is admin
        const adminProfile = await Profile.findOne({
            email: session.user.email,
        })
        if (!adminProfile || adminProfile.role !== "admin") {
            return NextResponse.json(
                { error: "Admin access required" },
                { status: 403 }
            )
        }

        const { userId, reason } = await request.json()

        if (!userId || !reason) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        // Find target user
        const targetUser = await Profile.findOne({ profileId: userId })
        if (!targetUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        const oldAvatar = targetUser.avatar

        // Reset avatar (remove it)
        await Profile.findByIdAndUpdate(targetUser._id, {
            $unset: { avatar: 1 },
            updatedAt: new Date(),
        })

        // Send email notification
        await sendAvatarResetEmail(targetUser.email, targetUser.name, reason)

        // Log admin action
        await logAdminAction({
            adminId: adminProfile.profileId.toString(),
            adminEmail: adminProfile.email,
            action: 'reset_avatar',
            targetUserId: targetUser.profileId.toString(),
            targetUserEmail: targetUser.email,
            reason,
            details: {
                oldAvatar: oldAvatar || "No avatar"
            }
        })

        return NextResponse.json({
            success: true,
            message: `Avatar reset for user "${targetUser.name}"`,
        })

    } catch (error) {
        console.error("Error resetting avatar:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

async function sendAvatarResetEmail(email: string, name: string, reason: string) {
    try {
        const emailBody = `
Dear ${name},

Your profile avatar has been reset by our administration team.

Reason: ${reason}

You can upload a new avatar by visiting your profile settings. Please ensure your new avatar complies with our community guidelines.

Best regards,
BlueBizHub Administration Team
        `.trim()

        // Here you would integrate with your email service (SendGrid, AWS SES, etc.)
        console.log("Avatar reset email would be sent to:", email)
        console.log("Email body:", emailBody)
        
    } catch (error) {
        console.error("Error sending avatar reset email:", error)
    }
}

async function logAdminAction(actionData: {
    adminId: string
    adminEmail: string
    action: string
    targetUserId: string
    targetUserEmail: string
    reason: string
    details?: Record<string, unknown>
}) {
    try {
        // In a real application, you would save this to an AdminAction collection
        console.log("Admin action logged:", actionData)
        
    } catch (error) {
        console.error("Error logging admin action:", error)
    }
}