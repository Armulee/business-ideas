import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import connectDB from "@/database"
import Joinlist from "@/database/Joinlist"

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        
        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            )
        }

        const { profile, type, marketing } = await request.json()

        if (!profile || !type || typeof marketing !== 'boolean') {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            )
        }

        if (!['business', 'partner'].includes(type)) {
            return NextResponse.json(
                { message: "Invalid type. Must be 'business' or 'partner'" },
                { status: 400 }
            )
        }

        await connectDB()

        // Check if user already exists in joinlist
        const existingEntry = await Joinlist.findOne({
            profile: profile,
            type: type
        })

        if (existingEntry) {
            return NextResponse.json(
                { message: "Already enrolled in this list" },
                { status: 409 }
            )
        }

        // Create new joinlist entry
        const joinlistEntry = new Joinlist({
            profile,
            type,
            marketing
        })

        await joinlistEntry.save()

        return NextResponse.json(
            { 
                message: "Successfully enrolled in joinlist",
                data: joinlistEntry 
            },
            { status: 201 }
        )

    } catch (error) {
        console.error('Error creating joinlist entry:', error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        
        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            )
        }

        // Check if user is admin (you might want to add admin role check here)
        // For now, we'll allow any authenticated user to view joinlist data
        
        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const skip = (page - 1) * limit

        await connectDB()

        const filter = type ? { type } : {}

        const [joinlistEntries, total] = await Promise.all([
            Joinlist.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Joinlist.countDocuments(filter)
        ])

        return NextResponse.json({
            data: joinlistEntries,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })

    } catch (error) {
        console.error('Error fetching joinlist data:', error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}