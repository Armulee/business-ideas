import connectDB from "@/database"
import { prisma } from "@/lib/prisma"
import Profile from "@/database/Profile"
import bcrypt from "bcrypt"
import { NextResponse } from "next/server"
import { signIn } from "@/auth"

export async function POST(req: Request) {
    try {
        await connectDB()

        const { token, method, email, password } = await req.json()

        if (!token) {
            return NextResponse.json(
                { message: "Token required" },
                { status: 400 }
            )
        }

        // Find user by verification token
        const user = await prisma.user.findFirst({
            where: {
                verificationToken: token,
                verificationExpires: {
                    gt: new Date(),
                },
            },
        })
        if (!user) {
            return NextResponse.json(
                { message: "Invalid or expired token" },
                { status: 400 }
            )
        }

        if (method === "passkey") {
            // Complete setup with passkey
            const updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: {
                    emailVerified: new Date(),
                    verificationToken: null,
                    verificationExpires: null,
                    provider: "passkey",
                },
            })

            // Create MongoDB profile
            const mongoProfile = await Profile.create({
                name: updatedUser.name,
                email: email,
            })
            await mongoProfile.save()

            // Update PostgreSQL user with profileId
            await prisma.user.update({
                where: { id: updatedUser.id },
                data: { profileId: mongoProfile._id.toString() },
            })

            return NextResponse.json(
                { message: "Account setup completed with passkey" },
                { status: 200 }
            )
        } else if (method === "credentials") {
            if (!email || !password) {
                return NextResponse.json(
                    {
                        message:
                            "Email and password required for credentials setup",
                    },
                    { status: 400 }
                )
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10)

            // Complete setup with credentials
            const updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: {
                    password: hashedPassword,
                    emailVerified: new Date(),
                    verificationToken: null,
                    verificationExpires: null,
                    provider: "credentials",
                },
            })

            // Create MongoDB profile
            const mongoProfile = await Profile.create({
                name: updatedUser.name,
                email: user.email,
            })
            await mongoProfile.save()

            // Update PostgreSQL user with profileId
            await prisma.user.update({
                where: { id: updatedUser.id },
                data: { profileId: mongoProfile._id.toString() },
            })

            await signIn("credentials", { email, password })
            return NextResponse.json(
                { message: "Account setup completed with credentials" },
                { status: 200 }
            )
        } else {
            return NextResponse.json(
                { message: "Invalid setup method" },
                { status: 400 }
            )
        }
    } catch (error) {
        console.error("Complete setup error:", error)
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }
}
