import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Twitter from "next-auth/providers/twitter"
import Resend from "next-auth/providers/resend"
import Passkey from "next-auth/providers/passkey"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import connectDB from "@/database"
import bcrypt from "bcrypt"
import Profile from "@/database/Profile"
import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible"
import {
    generateRandomWord,
    generateUsername,
} from "./lib/generate-random-name"

const limiter = new RateLimiterMemory({ points: 6, duration: 900 })

export const { auth, handlers, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    experimental: {
        enableWebAuthn: true,
    },
    providers: [
        Google,
        Twitter,
        Resend({ from: "BlueBizHub Magician <no-reply@bluebizhub.com>" }),
        Passkey,
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, request) {
                // Rate limit block
                const ip =
                    request.headers?.get("x-forwarded-for")?.split(",")[0] ||
                    request.headers?.get("x-real-ip") ||
                    "127.0.0.1"
                let rateLimiterRes: RateLimiterRes
                try {
                    rateLimiterRes = await limiter.consume(ip)
                } catch (limited) {
                    const retry = Math.ceil(
                        (limited as RateLimiterRes).msBeforeNext / 1000
                    )
                    throw new Error(
                        JSON.stringify({ code: "RATE_LIMIT_EXCEEDED", retry })
                    )
                }

                // Login logic - check PostgreSQL User for credentials
                try {
                    await connectDB()

                    const pgUser = await prisma.user.findUnique({
                        where: { email: credentials?.email as string },
                    })

                    if (!pgUser) {
                        throw new Error(
                            JSON.stringify({
                                code: "CREDENTIALS_INVALID",
                                message:
                                    "Email is not found. Please try again.",
                                remainingAttempts:
                                    rateLimiterRes.remainingPoints,
                            })
                        )
                    }

                    if (pgUser && pgUser.provider !== "credentials") {
                        // refund rate limit
                        await limiter.reward(ip)
                        const provider = pgUser.provider
                            ? pgUser.provider.charAt(0).toUpperCase() +
                              pgUser.provider.slice(1)
                            : "OAuth"

                        throw new Error(
                            JSON.stringify({
                                code: "PROVIDER_ALREADY_ASSOCIATED",
                                provider,
                                message: `This email is associated with ${provider}. Please log in using ${provider}.`,
                            })
                        )
                    }

                    if (!pgUser.password) {
                        throw new Error(
                            JSON.stringify({
                                code: "CREDENTIALS_INVALID",
                                message: "No password set for this account.",
                                remainingAttempts:
                                    rateLimiterRes.remainingPoints,
                            })
                        )
                    }

                    // match encrypted password
                    const isMatch = await bcrypt.compare(
                        credentials!.password as string,
                        pgUser.password
                    )
                    if (!isMatch) {
                        throw new Error(
                            JSON.stringify({
                                code: "CREDENTIALS_INVALID",
                                message:
                                    "Password is not correct. Please try again.",
                                remainingAttempts:
                                    rateLimiterRes.remainingPoints,
                            })
                        )
                    }

                    // ensure profile exists in MongoDB
                    let profile = pgUser.profileId
                        ? await Profile.findById(pgUser.profileId)
                        : null

                    if (!profile) {
                        profile = await Profile.create({
                            name:
                                pgUser.name ||
                                generateUsername() + "-" + generateRandomWord(),
                            email: pgUser.email,
                        })
                        await profile.save()

                        // Update PostgreSQL user with profileId
                        await prisma.user.update({
                            where: { id: pgUser.id },
                            data: { profileId: profile._id.toString() },
                        })
                    }

                    // on success, clear rate-limit
                    await limiter.delete(ip)

                    return {
                        id: pgUser.id,
                        email: pgUser.email,
                        name: pgUser.name,
                        image: pgUser.image,
                        profile: profile.profileId,
                    }
                } catch (err) {
                    const error =
                        err instanceof Error
                            ? err.message
                            : "Something went wrong"

                    throw new Error(error)
                }
            },
        }),
    ],
    session: {
        strategy: "database",
    },
    callbacks: {
        async signIn({ user, account, profile: authProfile }) {
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
                                              (authProfile?.login ||
                                                  user.email),
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
        },
        async session({ session, user }) {
            // Add profileId to session from PostgreSQL user
            if (user?.id) {
                const pgUser = await prisma.user.findUnique({
                    where: { id: user.id },
                })

                if (pgUser?.profileId) {
                    // Fetch MongoDB profile data
                    await connectDB()
                    const mongoProfile = await Profile.findById(
                        pgUser.profileId
                    )

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
        },
    },
})
