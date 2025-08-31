import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/database"
import Contact from "@/database/Contact"

export async function POST(request: NextRequest) {
    try {
        await connectDB()

        const body = await request.json()
        const { firstName, lastName, email, topic, message } = body

        // Validate required fields
        if (!firstName || !lastName || !email || !topic || !message) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            )
        }

        // Validate email format
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Please enter a valid email address" },
                { status: 400 }
            )
        }

        // Create new contact submission
        const contactSubmission = new Contact({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            topic: topic.trim(),
            message: message.trim(),
        })

        await contactSubmission.save()

        return NextResponse.json(
            {
                message: "Contact form submitted successfully",
                id: contactSubmission._id,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("Contact form submission error:", error)
        return NextResponse.json(
            { error: "Failed to submit contact form" },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        await connectDB()

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "20")
        const topic = searchParams.get("topic")

        const skip = (page - 1) * limit

        // Build query
        const query = topic ? { topic } : {}

        // Get contacts with pagination
        const contacts = await Contact.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()

        const total = await Contact.countDocuments(query)

        return NextResponse.json({
            contacts,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error("Failed to fetch contacts:", error)
        return NextResponse.json(
            { error: "Failed to fetch contacts" },
            { status: 500 }
        )
    }
}
