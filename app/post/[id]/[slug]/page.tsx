import Post from "@/components/post"
import { IPostPopulated, default as PostModel } from "@/database/Post"
import connectDB from "@/database"
import { Metadata } from "next"
import { ICommentPopulated } from "@/database/Comment"
import { IReplyPopulated } from "@/database/Reply"
import Comment from "@/database/Comment"
import Profile, { IProfile } from "@/database/Profile"
import Reply from "@/database/Reply"
import Widget, { IWidgets, Widget as WidgetType } from "@/database/Widget"

export interface PostData {
    post: IPostPopulated | undefined
    comments: ICommentPopulated[] | undefined
    replies: Record<string, IReplyPopulated[]> | undefined
    widgets: WidgetType[] | undefined
    profile?: IProfile | undefined
}

export default async function PostId({
    params,
}: {
    params: Promise<{ id: string; slug: string }>
}) {
    try {
        const { id, slug } = await params // No need to await

        await connectDB()

        const data = await getPostData(id)

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

// helper function for getting all post data
async function getPostData(id: string) {
    const post =
        (await PostModel.findOne({ postId: id }).populate<{
            author: IProfile
        }>({
            path: "author",
            select: "_id avatar name profileId posts",
        })) ?? undefined
    if (!post) throw new Error("Post not found")

    const comments =
        (await Comment.find({ post: post._id })
            .populate({
                path: "author",
                select: "avatar name profileId",
            })
            .sort({ created_at: 1 })) ?? undefined

    const rawReplies =
        (await Reply.find({ post: post._id })
            .populate({
                path: "author",
                select: "avatar name profileId",
            })
            .populate("comment", "_id") // Ensure reply is populated with the comment ID
            .exec()) ?? undefined
    // Group replies by comment ID
    const replies = comments.reduce((acc, comment) => {
        acc[comment._id] = rawReplies.filter(
            (reply) => reply.comment._id.toString() === comment._id.toString()
        )
        return acc
    }, {})

    // Get widgets
    const widgets: IWidgets | undefined =
        (await Widget.findOne({
            post: post._id,
        })) ?? undefined
    // Get profile for widget profile
    let profile: IProfile | undefined = undefined
    const profileWidget = widgets?.widgets.some(
        (widget) => widget.type === "profile"
    )
    if (profileWidget) {
        profile = (await Profile.findById(post.author._id)) ?? undefined
    }

    return JSON.parse(
        JSON.stringify({ post, comments, replies, widgets, profile })
    ) as PostData
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
