import connectDB from "@/database"
import Profile from "@/database/Profile"
import { prisma } from "@/lib/prisma"
import type { Session, User } from "next-auth"

export default async function session({
    session,
    user,
}: {
    session: Session
    user: User
}) {
    // Add profileId to session from PostgreSQL user
    if (user?.id) {
        const pgUser = await prisma.user.findUnique({
            where: { id: user.id },
        })

        if (pgUser?.profileId) {
            // Fetch MongoDB profile data
            await connectDB()
            const mongoProfile = await Profile.findById(pgUser.profileId)

            if (mongoProfile) {
                session.user.id = pgUser.id
                session.user.profile = mongoProfile.profileId
                session.user.profileData = {
                    _id: mongoProfile._id.toString(),
                    name: mongoProfile.name,
                    bio: mongoProfile.bio,
                    avatar: mongoProfile.avatar,
                    profileId: mongoProfile.profileId,
                }
            }
        }
    }
    return session
}
