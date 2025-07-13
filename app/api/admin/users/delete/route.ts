import { NextResponse } from "next/server"
import { auth } from "@/auth"
import connectDB from "@/database"
import Profile from "@/database/Profile"
import Administration from "@/database/Administration"
import { prisma } from "@/lib/prisma"

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

        // Delete from both PostgreSQL and MongoDB
        // First find the PostgreSQL user by email
        const pgUser = await prisma.user.findFirst({
            where: { email: targetUser.email }
        })
        
        if (pgUser) {
            // Delete all related data in PostgreSQL
            await prisma.account.deleteMany({
                where: { userId: pgUser.id }
            })
            await prisma.session.deleteMany({
                where: { userId: pgUser.id }
            })
            await prisma.authenticator.deleteMany({
                where: { userId: pgUser.id }
            })
            await prisma.user.delete({
                where: { id: pgUser.id }
            })
        }

        // Create administration record
        const administrationRecord = new Administration({
            user: {
                userId: targetUser._id.toString(),
                profileId: targetUser.profileId
            },
            action: 'delete',
            reason: reason,
            adminId: session.user.id || '',
            adminProfileId: adminProfile.profileId,
            result: 'permanent_ban'
        })

        await administrationRecord.save()

        // Delete user profile from MongoDB
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

