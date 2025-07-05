import { default as CredentialsProvider } from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible"
import {
    generateRandomWord,
    generateUsername,
} from "../../lib/generate-random-name"
import connectDB from "@/database"
import { prisma } from "@/lib/prisma"
import { CredentialsSignin } from "next-auth"
import Profile from "@/database/Profile"

const limiter = new RateLimiterMemory({ points: 6, duration: 900 })
export default function Credentials() {
    return CredentialsProvider({
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
            await connectDB()

            const pgUser = await prisma.user.findUnique({
                where: { email: credentials?.email as string },
            })

            if (!pgUser) {
                throw new RateLimiterError(rateLimiterRes.remainingPoints)
            }

            if (
                pgUser &&
                pgUser.provider &&
                pgUser.provider !== "credentials"
            ) {
                // refund rate limit
                await limiter.reward(ip)
                const provider = pgUser.provider
                    ? pgUser.provider.charAt(0).toUpperCase() +
                      pgUser.provider.slice(1)
                    : "OAuth"

                throw new ProviderExistingError(provider)
            }

            if (
                !pgUser.password &&
                pgUser.verificationToken === credentials.password
            ) {
                return {
                    id: pgUser.id,
                    name: pgUser.name,
                    email: pgUser.email,
                }
            }

            // match encrypted password
            if (pgUser.password) {
                const isMatch = await bcrypt.compare(
                    credentials!.password as string,
                    pgUser.password
                )
                if (!isMatch) {
                    throw new RateLimiterError(rateLimiterRes.remainingPoints)
                }
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
        },
    })
}

// throw rate limit error (rate limit points will be code property)
class RateLimiterError extends CredentialsSignin {
    remainingAttempts: number

    constructor(remainingAttempts: number) {
        super()
        this.remainingAttempts = remainingAttempts
        this.code = this.remainingAttempts.toString()
    }
}

// provider error
class ProviderExistingError extends CredentialsSignin {
    provider: string

    constructor(provider: string) {
        super()
        this.provider = provider
        this.code = this.provider
    }
}
