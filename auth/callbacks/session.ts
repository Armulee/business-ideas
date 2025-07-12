import connectDB from "@/database"
import Profile from "@/database/Profile"
import { prisma } from "@/lib/prisma"
import type { Session, User } from "next-auth"
import type { JWT } from "next-auth/jwt"

export default async function session({
    session,
    user,
    token,
}: {
    session: Session
    user?: User
    token?: JWT
}) {
    // Add profileId to session from PostgreSQL user
    // For JWT strategy, we get the user ID from the token.sub
    const userId = token?.sub || user?.id
    
    if (userId) {
        const pgUser = await prisma.user.findUnique({
            where: { id: userId },
        })

        if (pgUser?.profileId) {
            // Fetch MongoDB profile data
            await connectDB()
            const mongoProfile = await Profile.findById(pgUser.profileId)

            if (mongoProfile) {
                session.user.id = mongoProfile._id.toString() // MongoDB Profile _id as session.user.id
                session.user.profile = mongoProfile.profileId // Incremental profileId as session.user.profile
                session.user.role = mongoProfile.role || 'user' // Add role to session
            }
        } else if (pgUser?.email) {
            // If no profileId in PostgreSQL user, try to find by email
            await connectDB()
            const mongoProfile = await Profile.findOne({ email: pgUser.email })
            
            if (mongoProfile) {
                // Update PostgreSQL user with profileId
                await prisma.user.update({
                    where: { id: userId },
                    data: { profileId: mongoProfile._id.toString() },
                })
                
                session.user.id = mongoProfile._id.toString()
                session.user.profile = mongoProfile.profileId
                session.user.role = mongoProfile.role || 'user'
            }
        }
    }
    return session
}
