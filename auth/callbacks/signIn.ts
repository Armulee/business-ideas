import connectDB from "@/database"
import Profile from "@/database/Profile"
import { prisma } from "@/lib/prisma"
import { Account, Profile as AuthProfileType, User } from "next-auth"
import type { AdapterUser } from "@auth/core/adapters"
import { CredentialInput } from "next-auth/providers/credentials"

interface SignInProps {
    user: User | AdapterUser
    account?: Account | null
    profile?: AuthProfileType
    email?: {
        verificationRequest?: boolean
    }
    credentials?: Record<string, CredentialInput>
}

export default async function signIn({
    user,
    account,
    profile: authProfile,
}: SignInProps) {
    try {
        await connectDB()

        // For OAuth providers (Google, Twitter), Resend, and Passkey
        if (account?.provider !== "credentials") {
            // Find or create MongoDB profile
            let mongoProfile = await Profile.findOne({
                email: user.email,
            })

            if (!mongoProfile) {
                // For passkey, get the name from the existing PostgreSQL user if available
                let userName = user.name || authProfile?.name
                
                if (account?.provider === "passkey" && !userName) {
                    // Try to get name from existing PostgreSQL user
                    const existingPgUser = await prisma.user.findUnique({
                        where: { email: user.email! },
                    })
                    userName = existingPgUser?.name || user.email?.split('@')[0]
                }

                mongoProfile = await Profile.create({
                    name: userName,
                    email: user.email,
                    avatar: user.image,
                })
            } else {
                // Update existing profile with any missing name
                if (!mongoProfile.name && user.name) {
                    mongoProfile.name = user.name
                    await mongoProfile.save()
                } else if (!mongoProfile.name && account?.provider === "passkey") {
                    // For passkey, try to get name from PostgreSQL user
                    const existingPgUser = await prisma.user.findUnique({
                        where: { email: user.email! },
                    })
                    if (existingPgUser?.name) {
                        mongoProfile.name = existingPgUser.name
                        await mongoProfile.save()
                    }
                }
            }

            // Update PostgreSQL user with profileId
            const existingPgUser = await prisma.user.findUnique({
                where: { email: user.email! },
            })

            if (existingPgUser && !existingPgUser.profileId) {
                await prisma.user.update({
                    where: { id: existingPgUser.id },
                    data: { profileId: mongoProfile._id.toString() },
                })
            }
        }

        return true
    } catch (err) {
        console.error("SignIn callback error:", err)
        return false
    }
}
