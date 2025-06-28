import Post from "@/components/post"
import { default as PostModel } from "@/database/Post"
import connectDB from "@/database"
import { Metadata } from "next"
import { getPost, getWidgets } from "@/lib/get-post"

export default async function PostId({
    params,
}: {
    params: Promise<{ id: string; slug: string }>
}) {
    try {
        const { id, slug } = await params

        await connectDB()

        // Get only post data for immediate rendering
        const post = await getPost(id)
        const { widgets, profile } = await getWidgets(post)

        // If the slug is outdated, Next.js should handle redirection
        if (post && slug !== post.slug) {
            return <Post correctSlug={`/post/${id}/${post.slug}`} />
        }

        console.log({ post, widgets: widgets?.widgets, profile })

        return (
            <Post
                initialData={{ post, widgets: widgets?.widgets, profile }}
                postId={id}
            />
        )
    } catch {
        return (
            <Post error='Sorry! We cannot find this post, it may be not existed or deleted.' />
        )
    }
}

// strip html from the post content
function stripHtml(html: string) {
    return html
        .replace(/<\/li>/g, " ") // Replace closing list items with one space
        .replace(/<[^>]+>/g, "") // Remove all other HTML tags
        .trim()
        .replace(/\s+/g, " ") // Remove extra spaces
}

// generate metadata for the post
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
