import { PostData } from "@/components/post/types"
import Comment from "@/database/Comment"
import { IPostPopulated, default as PostModel } from "@/database/Post"
import Profile, { IProfile } from "@/database/Profile"
import Reply from "@/database/Reply"
import Widget, { IWidgets } from "@/database/Widget"

// Get only post data (fast loading)
export async function getPost(id: string) {
    const post = await PostModel.findOne({ postId: id }).populate<{
        author: IProfile
    }>({
        path: "author",
        select: "_id avatar name profileId posts",
    })

    if (!post) throw new Error("Post not found")

    return JSON.parse(JSON.stringify(post))
}

// Get comments and replies separately (slower loading)
export async function getCommentsAndReplies(postObjectId: string) {
    // get comment data from post we found
    const comments =
        (await Comment.find({ post: postObjectId })
            .populate({
                path: "author",
                select: "avatar name profileId",
            })
            .sort({ created_at: 1 })) ?? undefined

    // get replies data from comments we found
    const rawReplies =
        (await Reply.find({ post: postObjectId })
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

    return JSON.parse(JSON.stringify({ comments, replies }))
}

export async function getWidgets(post: IPostPopulated) {
    // Get widgets from post if available
    const widgets: IWidgets | undefined =
        (await Widget.findOne({
            post: post._id,
        })) ?? undefined

    // Get profile for widget profile if widget profile is visible
    let profile: IProfile | undefined = undefined
    const profileWidget = widgets?.widgets.some(
        (widget) => widget.type === "profile"
    )
    if (profileWidget) {
        profile = (await Profile.findById(post.author._id)) ?? undefined
    }

    return { widgets, profile }
}

// Original function kept for backward compatibility
export default async function getPostData(id: string) {
    const postData = await getPost(id)
    const commentsData = await getCommentsAndReplies(postData.post._id)
    const widgetsData = await getWidgets(postData.post)

    return {
        ...postData,
        ...commentsData,
        ...widgetsData,
    } as PostData
}
