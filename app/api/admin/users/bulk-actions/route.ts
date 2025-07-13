import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import connectDB from "@/database"
import Profile from "@/database/Profile"
import Administration from "@/database/Administration"
import { prisma } from "@/lib/prisma"

interface UserAction {
    userId: string
    actions: Set<'restrict' | 'delete' | 'reset_avatar' | 'reset_username' | 'change_role'>
    duration?: string
    role?: 'user' | 'moderator' | 'admin'
    reasons: string[]
}


export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        
        if (!session?.user?.role || session.user.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { actions }: { actions: UserAction[] } = body

        if (!actions || !Array.isArray(actions) || actions.length === 0) {
            return NextResponse.json({ error: "No actions provided" }, { status: 400 })
        }

        await connectDB()

        const results = []
        const adminId = session.user.id // PostgreSQL User ID
        const adminProfile = await Profile.findById(session.user.id)
        const adminProfileId = adminProfile?.profileId

        if (!adminProfileId) {
            return NextResponse.json({ error: "Admin profile not found" }, { status: 400 })
        }

        for (const userAction of actions) {
            try {
                // Find the target user profile
                const targetProfile = await Profile.findById(userAction.userId)
                if (!targetProfile) {
                    results.push({ 
                        userId: userAction.userId, 
                        success: false, 
                        error: "User not found" 
                    })
                    continue
                }

                const actionResults: string[] = []
                const previousRole = targetProfile.role

                // Convert Set to Array for iteration
                const actionsArray = Array.from(userAction.actions)
                
                // Process each action for this user
                for (const action of actionsArray) {
                    let actionResult = 'approved'

                    switch (action) {
                    case 'restrict':
                        if (!userAction.duration) {
                            actionResults.push('error: Duration required for restriction')
                            continue
                        }
                        
                        const restrictionDays = parseInt(userAction.duration)
                        const restrictionDate = new Date()
                        restrictionDate.setDate(restrictionDate.getDate() + restrictionDays)
                        
                        await Profile.findByIdAndUpdate(userAction.userId, {
                            restrictedUntil: restrictionDate,
                            restrictionReason: userAction.reasons.join(', ')
                        })
                        
                        actionResult = 'temporary_ban'
                        break

                    case 'delete':
                        // Delete from both MongoDB and PostgreSQL
                        
                        // First find the PostgreSQL user by email
                        const pgUser = await prisma.user.findFirst({
                            where: { email: targetProfile.email }
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
                        
                        // Delete from MongoDB
                        await Profile.findByIdAndDelete(userAction.userId)
                        
                        actionResult = 'permanent_ban'
                        break

                    case 'reset_avatar':
                        await Profile.findByIdAndUpdate(userAction.userId, {
                            $unset: { avatar: 1 }
                        })
                        actionResult = 'reset_avatar'
                        break

                    case 'reset_username':
                        // Generate a random username
                        const randomUsername = `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`
                        await Profile.findByIdAndUpdate(userAction.userId, {
                            name: randomUsername
                        })
                        actionResult = 'reset_username'
                        break

                    case 'change_role':
                        if (!userAction.role) {
                            actionResults.push('error: New role required for role change')
                            continue
                        }
                        
                        await Profile.findByIdAndUpdate(userAction.userId, {
                            role: userAction.role
                        })
                        actionResult = 'role_changed'
                        break

                    default:
                        actionResults.push('error: Invalid action type')
                        continue
                    }
                    
                    // Add successful action result
                    actionResults.push(actionResult)
                }

                // Create administration records for each action
                for (let i = 0; i < actionsArray.length; i++) {
                    const action = actionsArray[i]
                    const result = actionResults[i]
                    
                    const administrationRecord = new Administration({
                        user: {
                            userId: targetProfile._id.toString(),
                            profileId: targetProfile.profileId
                        },
                        action: action,
                        reason: userAction.reasons.join(', '),
                        duration: userAction.duration,
                        previousRole: previousRole,
                        newRole: userAction.role,
                        adminId: adminId,
                        adminProfileId: adminProfileId,
                        result: result
                    })

                    await administrationRecord.save()
                }

                results.push({ 
                    userId: userAction.userId, 
                    success: true, 
                    actions: actionsArray,
                    results: actionResults
                })

                // TODO: Send email notification to user
                // This would be implemented in the email composition task

            } catch (error) {
                console.error(`Error processing action for user ${userAction.userId}:`, error)
                results.push({ 
                    userId: userAction.userId, 
                    success: false, 
                    error: "Failed to process action" 
                })
            }
        }

        const successCount = results.filter(r => r.success).length
        const failureCount = results.length - successCount

        return NextResponse.json({
            message: `Processed ${results.length} actions. ${successCount} successful, ${failureCount} failed.`,
            results,
            summary: {
                total: results.length,
                successful: successCount,
                failed: failureCount
            }
        })

    } catch (error) {
        console.error("Error processing bulk actions:", error)
        return NextResponse.json(
            { error: "Failed to process bulk actions" },
            { status: 500 }
        )
    }
}