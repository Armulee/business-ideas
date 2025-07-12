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

        const oldUsername = targetUser.name
        
        // Generate random username
        const newUsername = generateRandomUsername()

        // Update username
        await Profile.findByIdAndUpdate(targetUser._id, {
            name: newUsername,
            updatedAt: new Date(),
        })

        // Send email notification
        await sendUsernameResetEmail(targetUser.email, oldUsername, newUsername, reason)

        // Log admin action
        await logAdminAction({
            adminId: adminProfile.profileId.toString(),
            adminEmail: adminProfile.email,
            action: 'reset_username',
            targetUserId: targetUser.profileId.toString(),
            targetUserEmail: targetUser.email,
            reason,
            details: {
                oldUsername,
                newUsername
            }
        })

        return NextResponse.json({
            success: true,
            message: `Username reset for user. New username: "${newUsername}"`,
            newUsername,
        })

    } catch (error) {
        console.error("Error resetting username:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

function generateRandomUsername(): string {
    const adjectives = [
        "Happy", "Clever", "Bright", "Swift", "Kind", "Bold", "Calm", "Wise",
        "Quick", "Smart", "Cool", "Nice", "Fast", "Strong", "Gentle", "Brave"
    ]
    
    const nouns = [
        "User", "Explorer", "Creator", "Builder", "Thinker", "Dreamer", "Maker",
        "Helper", "Friend", "Guide", "Artist", "Writer", "Designer", "Coder"
    ]
    
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
    const noun = nouns[Math.floor(Math.random() * nouns.length)]
    const number = Math.floor(Math.random() * 9999) + 1
    
    return `${adjective}${noun}${number}`
}

async function sendUsernameResetEmail(email: string, oldUsername: string, newUsername: string, reason: string) {
    try {
        const emailBody = `
Dear ${oldUsername},

Your username has been reset by our administration team.

Reason: ${reason}

Your new username is: ${newUsername}

You can change your username again by visiting your profile settings. Please ensure your new username complies with our community guidelines.

Best regards,
BlueBizHub Administration Team
        `.trim()

        // Here you would integrate with your email service (SendGrid, AWS SES, etc.)
        console.log("Username reset email would be sent to:", email)
        console.log("Email body:", emailBody)
        
    } catch (error) {
        console.error("Error sending username reset email:", error)
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