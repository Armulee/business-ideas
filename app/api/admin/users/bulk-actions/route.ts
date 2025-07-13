import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import connectDB from "@/database"
import Profile from "@/database/Profile"
import Administration from "@/database/Administration"
import Post from "@/database/Post"
import Comment from "@/database/Comment"
import Reply from "@/database/Reply"
import Activity from "@/database/Activity"
import { Follow } from "@/database/Follow"
import { prisma } from "@/lib/prisma"
import generateRandomUsername from "@/lib/generate-random-name"

interface UserAction {
    userId: string
    action:
        | "restrict"
        | "delete"
        | "reset_avatar"
        | "reset_username"
        | "reset_bio"
        | "change_role"
    duration?: string
    role?: "user" | "moderator" | "admin"
    reasons: string[]
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user?.role || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { actions }: { actions: UserAction[] } = body

        if (!actions || !Array.isArray(actions) || actions.length === 0) {
            return NextResponse.json(
                { error: "No actions provided" },
                { status: 400 }
            )
        }

        await connectDB()

        const results = []
        const adminProfile = await Profile.findOne({
            email: session.user.email,
        })
        const adminProfileId = adminProfile?.profileId

        if (!adminProfileId) {
            return NextResponse.json(
                { error: "Admin profile not found" },
                { status: 400 }
            )
        }

        for (const userAction of actions) {
            try {
                // Find the target user profile
                const targetProfile = await Profile.findById(userAction.userId)
                if (!targetProfile) {
                    results.push({
                        user: userAction.userId,
                        success: false,
                        error: "User not found",
                    })
                    continue
                }

                let actionResult = "approved"
                const previousRole = targetProfile.role
                const action = userAction.action
                
                // Variables to store previous values for reset actions
                let previousAvatar: string | undefined
                let previousUsername: string | undefined
                let newUsername: string | undefined
                let previousBio: string | undefined

                switch (action) {
                    case "restrict":
                        if (!userAction.duration) {
                            results.push({
                                user: userAction.userId,
                                success: false,
                                error: "Duration required for restriction",
                            })
                            continue
                        }

                        const restrictionDays = parseInt(userAction.duration)
                        const restrictionDate = new Date()
                        restrictionDate.setDate(
                            restrictionDate.getDate() + restrictionDays
                        )

                        await Profile.findByIdAndUpdate(userAction.userId, {
                            restrictedUntil: restrictionDate,
                            restrictionReason: userAction.reasons.join(", "),
                        })

                        actionResult = "temporary_ban"
                        break

                    case "delete":
                        // First find the PostgreSQL user by email
                        const pgUser = await prisma.user.findFirst({
                            where: { email: targetProfile.email },
                        })

                        if (pgUser) {
                            // Delete all related data in PostgreSQL
                            await prisma.account.deleteMany({
                                where: { userId: pgUser.id },
                            })
                            await prisma.session.deleteMany({
                                where: { userId: pgUser.id },
                            })
                            await prisma.authenticator.deleteMany({
                                where: { userId: pgUser.id },
                            })
                            await prisma.user.delete({
                                where: { id: pgUser.id },
                            })
                        }

                        // Cascade delete all user content from MongoDB
                        await Post.deleteMany({ author: userAction.userId })

                        await Comment.deleteMany({ author: userAction.userId })

                        await Reply.deleteMany({ author: userAction.userId })

                        await Activity.deleteMany({
                            $or: [
                                { user: userAction.userId },
                                { triggeredBy: userAction.userId },
                            ],
                        })

                        await Follow.deleteMany({
                            $or: [
                                { follower: userAction.userId },
                                { following: userAction.userId },
                            ],
                        })

                        // Finally delete the profile
                        await Profile.findByIdAndDelete(userAction.userId)

                        actionResult = "permanent_ban"
                        break

                    case "reset_avatar":
                        previousAvatar = targetProfile.avatar
                        await Profile.findByIdAndUpdate(userAction.userId, {
                            $unset: { avatar: 1 },
                        })
                        actionResult = "reset_avatar"
                        break

                    case "reset_username":
                        // Generate a random username
                        previousUsername = targetProfile.name
                        newUsername = generateRandomUsername()

                        await Profile.findByIdAndUpdate(userAction.userId, {
                            name: newUsername,
                        })
                        actionResult = "reset_username"
                        break

                    case "reset_bio":
                        previousBio = targetProfile.bio
                        await Profile.findByIdAndUpdate(userAction.userId, {
                            $unset: { bio: 1 },
                        })
                        actionResult = "reset_bio"
                        break

                    case "change_role":
                        if (!userAction.role) {
                            results.push({
                                user: userAction.userId,
                                success: false,
                                error: "New role required for role change",
                            })
                            continue
                        }

                        await Profile.findByIdAndUpdate(userAction.userId, {
                            role: userAction.role,
                        })
                        actionResult = "role_changed"
                        break

                    default:
                        results.push({
                            user: userAction.userId,
                            success: false,
                            error: "Invalid action type",
                        })
                        continue
                }

                // Create administration record with actual user/admin data
                const administrationRecord = new Administration({
                    user: {
                        _id: targetProfile._id,
                        name: targetProfile.name,
                        email: targetProfile.email,
                        avatar: targetProfile.avatar,
                        profileId: targetProfile.profileId
                    },
                    action: action,
                    reason: userAction.reasons.join(", "),
                    duration: userAction.duration,
                    previousRole: previousRole,
                    newRole: userAction.role,
                    previousAvatar: previousAvatar,
                    previousUsername: previousUsername,
                    newUsername: newUsername,
                    previousBio: previousBio,
                    admin: {
                        _id: adminProfile._id,
                        name: adminProfile.name,
                        email: adminProfile.email,
                        avatar: adminProfile.avatar,
                        profileId: adminProfile.profileId
                    },
                    result: actionResult,
                })

                await administrationRecord.save()

                results.push({
                    user: userAction.userId,
                    success: true,
                    action: action,
                    result: actionResult,
                })

                // TODO: Send email notification to user
                // This would be implemented in the email composition task
            } catch (error) {
                console.error(
                    `Error processing action for user ${userAction.userId}:`,
                    error
                )
                results.push({
                    user: userAction.userId,
                    success: false,
                    error: "Failed to process action",
                })
            }
        }

        const successCount = results.filter((r) => r.success).length
        const failureCount = results.length - successCount

        return NextResponse.json({
            message: `Processed ${results.length} actions. ${successCount} successful, ${failureCount} failed.`,
            results,
            summary: {
                total: results.length,
                successful: successCount,
                failed: failureCount,
            },
        })
    } catch (error) {
        console.error("Error processing bulk actions:", error)
        return NextResponse.json(
            { error: "Failed to process bulk actions" },
            { status: 500 }
        )
    }
}
