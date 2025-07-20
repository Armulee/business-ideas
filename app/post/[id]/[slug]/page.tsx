import Post from "@/components/post"
import connectDB from "@/database"
import { Metadata } from "next"
import { default as PostModel } from "@/database/Post"

export default async function PostId({
    params,
}: {
    params: Promise<{ id: string; slug: string }>
}) {
    const { id, slug } = await params
    return <Post id={id} slug={slug} />
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
