import connectDB from "@/database"
import Profile from "@/database/Profile"
import { prisma } from "@/lib/prisma"
import {
    Account,
    Profile as AuthProfileType,
    User,
    AdapterUser,
} from "next-auth"
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

        // For OAuth providers (Google, Twitter) and Resend
        if (account?.provider !== "credentials") {
            // Find or create MongoDB profile
            let mongoProfile = await Profile.findOne({
                $or: [
                    { email: user.email },
                    {
                        socialLinks: {
                            $elemMatch: {
                                platform: account?.provider,
                                url: { $regex: user.email },
                            },
                        },
                    },
                ],
            })

            if (!mongoProfile) {
                mongoProfile = await Profile.create({
                    name: user.name || authProfile?.name,
                    email: user.email,
                    avatar: user.image,
                    socialLinks: account?.provider
                        ? [
                              {
                                  platform: account.provider,
                                  url:
                                      `https://${account.provider}.com/` +
                                      (authProfile?.login || user.email),
                              },
                          ]
                        : [],
                })
                await mongoProfile.save()
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
