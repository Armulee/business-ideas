import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
// import AppleProvider from "next-auth/providers/apple"
// import FacebookProvider from "next-auth/providers/facebook"
// import LinkedinProvider from "next-auth/providers/linkedin"
import TwitterProvider from "next-auth/providers/twitter"
// import EmailProvider from "next-auth/providers/email"
import CredentialsProvider from "next-auth/providers/credentials"
// import { MongooseAdapter } from "@brendon1555/authjs-mongoose-adapter"
import connectDB from "@/database"
import User from "@/database/User"
import bcrypt from "bcrypt"
import Profile from "@/database/Profile"
import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible"
import { generateRandomWord, generateUsername } from "@/hooks/helper-function"

const limiter = new RateLimiterMemory({ points: 6, duration: 900 })

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
        }),
        TwitterProvider({
            clientId: process.env.TWITTER_ID as string,
            clientSecret: process.env.TWITTER_SECRET as string,
            version: "2.0",
        }),
        // AppleProvider({
        //     clientId: process.env.APPLE_ID as string,
        //     clientSecret: process.env.APPLE_SECRET as string,
        // }),
        // FacebookProvider({
        //     clientId: process.env.FACEBOOK_ID as string,
        //     clientSecret: process.env.FACEBOOK_SECRET as string,
        // }),
        // LinkedinProvider({
        //     clientId: process.env.LINKEDIN_ID as string,
        //     clientSecret: process.env.LINKEDIN_SECRET as string,
        // }),
        // EmailProvider({
        //     server: process.env.EMAIL_SERVER,
        //     from: process.env.EMAIL_FROM,
        // }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, request) {
                // Rate limit block
                const ip =
                    (request.headers?.["x-forwarded-for"] as string).split(
                        ","
                    )[0] ||
                    request.headers?.["x-real-ip"] ||
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

                // Login logic
                try {
                    await connectDB()

                    const user = await User.findOne({
                        email: credentials?.email,
                    })

                    if (!user) {
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

                    if (user && user.provider !== "credentials") {
                        // refund rate limit
                        await limiter.reward(ip)
                        const provider =
                            user.provider.charAt(0).toUpperCase() +
                            user.provider.slice(1)

                        throw new Error(
                            JSON.stringify({
                                code: "PROVIDER_ALREADY_ASSOCIATED",
                                provider,
                                message: `This email is associated with ${provider}. Please log in using ${provider}.`,
                            })
                        )
                    }

                    // match encrypted password
                    const isMatch = await bcrypt.compare(
                        credentials!.password,
                        user.password
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

                    // ensure profile exists, etc...
                    let profile = await Profile.findOne({ user: user._id })
                    if (!profile) {
                        profile = await Profile.create({
                            user: user._id,
                            name:
                                user.name ||
                                generateUsername() + "-" + generateRandomWord(),
                        })

                        await profile.save()
                    }

                    //     await profile.save()
                    // }

                    // on success, clear rate-limit
                    await limiter.delete(ip)

                    return {
                        id: profile._id.toString(),
                        profile: profile.profileId,
                        name: profile.name,
                        email: user.email,
                        image: user.image,
                    }
                } catch (err) {
                    const error =
                        err instanceof Error
                            ? err.message
                            : "Something went wrong"

                    // throw error with the remaining points
                    throw new Error(error)
                }
            },
        }),
    ],
    // adapter: MongooseAdapter(MONGODB_URI),
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user, account }) {
            try {
                await connectDB()
                const existingUser = await User.findOne({ email: user.email })

                if (!existingUser) {
                    // Create new User
                    const newUser = await User.create({
                        email: user.email,
                        provider: account?.provider,
                    })

                    await newUser.save()

                    // Create new Profile & Move image to avatar
                    const newProfile = await Profile.create({
                        user: newUser._id,
                        name: user.name,
                        avatar: user.image, // Move image here
                    })

                    await newProfile.save()

                    return true // Allow sign-in
                }

                return true
            } catch (err) {
                console.error(err)
                return false
            }
        },
        async jwt({ token, user }) {
            if (user) {
                const dbUser = await User.findOne({ email: user.email })

                if (dbUser) {
                    const profile = await Profile.findOne({ user: dbUser._id })
                    token.id = {
                        id: profile._id.toString(),
                        profileId: profile.profileId,
                    }
                }
            }
            return token
        },
        async session({ session, token }) {
            const { id, profileId } = token.id as {
                id: string
                profileId: number
            }
            session.user.id = id
            session.user.profile = profileId
            return Promise.resolve(session)
        },
    },
    // cookies: {
    //     sessionToken: {
    //         name: "next-auth.session-token",
    //         options: {
    //             httpOnly: true,
    //             sameSite: "lax",
    //             secure: process.env.NODE_ENV === "production",
    //         },
    //     },
    // },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
