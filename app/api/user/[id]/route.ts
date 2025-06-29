import connectDB from "@/database"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        await connectDB()
        const user = await prisma.user.findUnique({ 
            where: { id } 
        })

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            )
        }
        return NextResponse.json(user, { status: 200 })
    } catch (err) {
        console.error(err)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
