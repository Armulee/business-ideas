import Post from "@/components/post"
import { default as PostModel } from "@/database/Post"
import connectDB from "@/database"
import { Metadata } from "next"

export default async function PostId({
    params,
}: {
    params: Promise<{ id: string; slug: string }>
}) {
    try {
        const { id, slug } = await params // No need to await

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/post/${id}/${slug}`,
            {
                cache: "no-store", // Ensure fresh data on each request
            }
        )

        if (!response.ok) {
            throw new Error(`Failed to fetch post data: ${response.statusText}`)
        }

        const data = await response.json()

        // If the slug is outdated, Next.js should handle redirection
        if (data.post && slug !== data.post.slug) {
            return <Post correctSlug={`/post/${id}/${data.post.slug}`} />
        }

        return <Post data={data} />
    } catch {
        return (
            <Post error='Sorry! We cannot find this post, it may be not existed or deleted.' />
        )
    }
}

function stripHtml(html: string) {
    return html
        .replace(/<\/li>/g, " ") // Replace closing list items with one space
        .replace(/<[^>]+>/g, "") // Remove all other HTML tags
        .trim()
        .replace(/\s+/g, " ") // Remove extra spaces
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string; slug: string }>
}): Promise<Metadata> {
    const { id, slug } = await params
    await connectDB()
    const post = await PostModel.findOne({ postId: id })

    if (!post) {
        return {
            title: "Post Not Found",
            description: "The requested post does not exist.",
        }
    }

    const { title, content: descriptionHTML, tags } = post

    const description = stripHtml(descriptionHTML)
    // Generate SEO-friendly keywords from tags
    const keywords = tags ? tags.join(", ") : title.split(" ").join(", ")

    return {
        title,
        description: description.slice(0, 150),
        keywords,
        openGraph: {
            title,
            description: description.slice(0, 150),
            url: `/post/${id}/${slug}`,
            images: [
                {
                    url: post.image || "/default-thumbnail.jpg",
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
    }
}
