import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import Post from "@/database/Post"
import connectDB from "@/database"
import { Resend } from "resend"
import { PostRestrictionEmailTemplate } from "@/lib/email-templates"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Check if user is admin
        if (session.user.role !== "admin") {
            return NextResponse.json(
                { error: "Admin access required" },
                { status: 403 }
            )
        }

        await connectDB()

        const { id } = await params
        const postId = parseInt(id)

        if (isNaN(postId)) {
            return NextResponse.json(
                { error: "Invalid post ID" },
                { status: 400 }
            )
        }

        const updatedPost = await Post.findOneAndUpdate(
            { postId },
            {
                status: "restrict",
                updatedAt: new Date(),
            },
            { new: true }
        ).populate("author", "profileId name email avatar")

        if (!updatedPost) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            )
        }

        // Send email notification to author
        if (resend) {
            try {
                await resend.emails.send({
                    from: "BlueBizHub <no-reply@bluebizhub.com>",
                    to: [updatedPost.author.email],
                    subject: "Post Content Review Required",
                    react: PostRestrictionEmailTemplate({
                        authorName: updatedPost.author.name,
                        postTitle: updatedPost.title,
                        postId: updatedPost.postId,
                    }),
                })
                console.log("Email sent successfully to:", updatedPost.author.email)
            } catch (emailError) {
                console.error("Error sending email notification:", emailError)
                // Continue with the response even if email fails
            }
        }

        return NextResponse.json({
            message:
                "Post has been warned and restricted. Author has been notified via email.",
            post: updatedPost,
        })
    } catch (error) {
        console.error("Error warning admin post:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
