import connectDB from "@/database"
import { prisma } from "@/lib/prisma"
import Profile from "@/database/Profile"
import bcrypt from "bcrypt"
import { NextResponse } from "next/server"

export async function PATCH(req: Request) {
    try {
        await connectDB()

        const { method, username, email, password } = await req.json()

        if (method === "passkey") {
            // Create MongoDB profile
            const mongoProfile = await Profile.create({
                name: username,
                email,
            })
            await mongoProfile.save()

            // Complete setup with passkey
            await prisma.user.update({
                where: { email },
                data: {
                    emailVerified: new Date(),
                    verificationToken: null,
                    verificationExpires: null,
                    provider: "passkey",
                    profileId: mongoProfile._id.toString(),
                },
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

            // Create MongoDB profile
            const mongoProfile = await Profile.create({
                name: username,
                email,
            })
            await mongoProfile.save()

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10)

            // Complete setup with credentials
            await prisma.user.update({
                where: { email },
                data: {
                    password: hashedPassword,
                    emailVerified: new Date(),
                    verificationToken: null,
                    verificationExpires: null,
                    provider: "credentials",
                    profileId: mongoProfile._id.toString(),
                },
            })

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
