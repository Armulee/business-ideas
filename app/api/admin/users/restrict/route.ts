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

        const { userId, duration, reason } = await request.json()

        if (!userId || !duration || !reason) {
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

        // Calculate restriction end date
        const now = new Date()
        const restrictionEnd = new Date(now)

        const durationDays = parseInt(duration)

        if (isNaN(durationDays) || durationDays < 1 || durationDays > 30) {
            return NextResponse.json(
                { error: "Invalid duration. Must be between 1 and 30 days." },
                { status: 400 }
            )
        }

        restrictionEnd.setDate(now.getDate() + durationDays)

        // Update user with restriction
        await Profile.findByIdAndUpdate(targetUser._id, {
            restrictedUntil: restrictionEnd,
            restrictionReason: reason,
            updatedAt: new Date(),
        })

        // Send email notification
        await sendRestrictionEmail(
            targetUser.email,
            targetUser.name,
            duration,
            reason,
            restrictionEnd
        )

        // Log admin action
        await logAdminAction({
            adminId: adminProfile.profileId.toString(),
            adminEmail: adminProfile.email,
            action: "restrict",
            targetUserId: targetUser.profileId.toString(),
            targetUserEmail: targetUser.email,
            reason,
            details: {
                restrictionEnd,
                duration,
            },
        })

        return NextResponse.json({
            success: true,
            message: `User restricted until ${restrictionEnd.toISOString()}`,
            restrictionEnd,
        })
    } catch (error) {
        console.error("Error restricting user:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

async function sendRestrictionEmail(
    email: string,
    name: string,
    duration: string,
    reason: string,
    endDate: Date
) {
    try {
        const durationDays = parseInt(duration)
        const durationText =
            durationDays === 1 ? "1 day" : `${durationDays} days`

        const emailBody = `
Dear ${name},

Your account has been temporarily restricted for ${durationText}.

Reason: ${reason}

Your restriction will be lifted on: ${endDate.toLocaleDateString()} at ${endDate.toLocaleTimeString()}

During this time, you will have limited access to platform features. If you believe this restriction was applied in error, please contact our support team.

Best regards,
BlueBizHub Administration Team
        `.trim()

        // Here you would integrate with your email service (SendGrid, AWS SES, etc.)
        console.log("Restriction email would be sent to:", email)
        console.log("Email body:", emailBody)

        // Example with a fetch to email service:
        // await fetch('/api/send-email', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         to: email,
        //         subject: 'Account Restriction Notice',
        //         body: emailBody
        //     })
        // })
    } catch (error) {
        console.error("Error sending restriction email:", error)
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
