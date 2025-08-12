import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import connectToDB from "@/database"
import Feedback from "@/database/Feedback"
import Profile from "@/database/Profile"

export async function POST(request: NextRequest) {
    try {
        await connectToDB()

        const body = await request.json()
        const {
            userId,
            question1,
            question2,
            question3,
            question4,
            question5,
            question6,
            question7,
            question8,
            question9,
            question10,
        } = body

        // Validate required rating questions
        if (!question1?.rating || !question2?.rating || !question3?.rating || 
            !question4?.rating || !question5?.rating || !question6?.rating) {
            return NextResponse.json(
                { error: "All rating questions are required" },
                { status: 400 }
            )
        }

        let userProfileId = null

        // If userId is provided, get their profile
        if (userId) {
            const userProfile = await Profile.findOne({ profileId: userId })
            if (userProfile) {
                userProfileId = userProfile._id
            }
        }

        // Create new feedback (with or without user)
        const feedback = new Feedback({
            user: userProfileId, // Will be null for anonymous feedback
            question1,
            question2,
            question3,
            question4,
            question5,
            question6,
            question7,
            question8,
            question9,
            question10,
        })

        await feedback.save()

        return NextResponse.json(
            { message: "Feedback submitted successfully", feedbackId: feedback._id },
            { status: 201 }
        )
    } catch (error) {
        console.error("Error submitting feedback:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: "Unauthorized - Admin access required" },
                { status: 401 }
            )
        }

        await connectToDB()

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const skip = (page - 1) * limit

        // Get feedbacks with user profile populated (if exists)
        const feedbacks = await Feedback.find()
            .populate({
                path: 'user',
                select: 'name avatar profileId'
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const total = await Feedback.countDocuments()

        return NextResponse.json({
            feedbacks,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error("Error fetching feedbacks:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}