import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// get user email exists in the database or not?
export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams
        const email = searchParams.get("email")

        if (!email) {
            return new NextResponse(
                JSON.stringify({ message: "Email required" }),
                {
                    status: 400,
                }
            )
        }

        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (user) {
            return new NextResponse(JSON.stringify({ message: "found" }), {
                status: 200,
            })
        } else {
            return new NextResponse(JSON.stringify({ message: "not found" }), {
                status: 200,
            })
        }
    } catch (err) {
        console.error(err)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
