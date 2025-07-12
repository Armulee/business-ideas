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

        // Prevent deletion of other admins
        if (targetUser.role === 'admin') {
            return NextResponse.json(
                { error: "Cannot delete admin users" },
                { status: 403 }
            )
        }

        // Send email notification before deletion
        await sendDeletionEmail(targetUser.email, targetUser.name, reason)

        // Log admin action
        await logAdminAction({
            adminId: adminProfile.profileId.toString(),
            adminEmail: adminProfile.email,
            action: 'delete',
            targetUserId: targetUser.profileId.toString(),
            targetUserEmail: targetUser.email,
            reason,
        })

        // Delete user profile
        await Profile.findByIdAndDelete(targetUser._id)

        return NextResponse.json({
            success: true,
            message: `User "${targetUser.name}" has been deleted successfully`,
        })

    } catch (error) {
        console.error("Error deleting user:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

async function sendDeletionEmail(email: string, name: string, reason: string) {
    try {
        const emailBody = `
Dear ${name},

Your account has been permanently deleted from BlueBizHub.

Reason: ${reason}

This action is irreversible. If you believe this deletion was made in error, please contact our support team immediately.

We're sorry to see you go.

Best regards,
BlueBizHub Administration Team
        `.trim()

        // Here you would integrate with your email service (SendGrid, AWS SES, etc.)
        console.log("Deletion email would be sent to:", email)
        console.log("Email body:", emailBody)
        
    } catch (error) {
        console.error("Error sending deletion email:", error)
    }
}

async function logAdminAction(actionData: {
    adminId: string
    adminEmail: string
    action: string
    targetUserId: string
    targetUserEmail: string
    reason: string
}) {
    try {
        // In a real application, you would save this to an AdminAction collection
        console.log("Admin action logged:", actionData)
        
        // Example: Save to database
        // await AdminAction.create({
        //     ...actionData,
        //     createdAt: new Date()
        // })
        
    } catch (error) {
        console.error("Error logging admin action:", error)
    }
}