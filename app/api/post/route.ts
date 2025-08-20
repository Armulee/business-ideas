import connectDB from "@/database"
import Post from "@/database/Post"
import Profile from "@/database/Profile"
import Widget from "@/database/Widget"
import { NextResponse } from "next/server"

// Post up new post to the database
export async function POST(req: Request) {
    try {
        await connectDB()

        const {
            author,
            title,
            categories,
            content,
            tags,
            community,
            advancedSettings,
            widgets,
            status = "published",
        } = await req.json()

        // Process geographic targeting
        const { globalPost, targetRegion, targetCountry, ...otherSettings } = advancedSettings
        const targetRegions = targetRegion ? [targetRegion] : []
        const targetCountries = targetCountry ? [targetCountry] : []

        // Filter out empty categories
        const filteredCategories = categories ? categories.filter((cat: string) => cat && cat.trim() !== '') : []

        // Create new post
        const newPost = await Post.create({
            author,
            title,
            categories: filteredCategories,
            content,
            tags,
            community,
            advancedSettings: otherSettings,
            status,
            globalPost: globalPost !== false,
            targetRegions,
            targetCountries,
        })
        await newPost.save()

        // newPost.postLink = `/post/${newPost.postId}/${newPost.slug}`

        // Create and save widgets if provided
        if (widgets && widgets.length > 0) {
            const newWidget = await Widget.create({
                post: newPost._id,
                widgets,
            })
            await newWidget.save()
        }

        // Update user profile to increment post count only for published posts
        if (status === "published") {
            const updatedProfile = await Profile.findByIdAndUpdate(
                author,
                { $inc: { postCount: 1 } },
                { new: true }
            )
            await updatedProfile.save()
        }

        return NextResponse.json(
            { id: newPost.postId, slug: newPost.slug },
            { status: 200 }
        )
    } catch (err) {
        console.error(err)
    }
}

// Edit post content
export async function PATCH(req: Request) {
    try {
        const { content, id } = await req.json()
        if (!content) {
            return NextResponse.json(
                { error: "Text is required" },
                { status: 400 }
            )
        }

        await connectDB()

        const thisPost = await Post.findByIdAndUpdate(
            id,
            { content, updatedAt: Date.now() },
            { new: true }
        )

        await thisPost.save()

        return NextResponse.json(
            { message: "Comment updated successfully" },
            { status: 200 }
        )
    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}
