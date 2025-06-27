import Comment, { ICommentPopulated } from "@/database/Comment"
import { IPostPopulated, default as PostModel } from "@/database/Post"
import Profile, { IProfile } from "@/database/Profile"
import Reply, { IReplyPopulated } from "@/database/Reply"
import Widget, { IWidgets, Widget as WidgetType } from "@/database/Widget"

export interface PostData {
    post: IPostPopulated | undefined
    comments: ICommentPopulated[] | undefined
    replies: Record<string, IReplyPopulated[]> | undefined
    widgets: WidgetType[] | undefined
    profile?: IProfile | undefined
}

// helper function for getting all post data in the post server component
export default async function getPostData(id: string) {
    // get post data from database
    const post =
        (await PostModel.findOne({ postId: id }).populate<{
            author: IProfile
        }>({
            path: "author",
            select: "_id avatar name profileId posts",
        })) ?? undefined
    // throw error if not found
    if (!post) throw new Error("Post not found")

    // get comment data from post we found
    const comments =
        (await Comment.find({ post: post._id })
            .populate({
                path: "author",
                select: "avatar name profileId",
            })
            .sort({ created_at: 1 })) ?? undefined

    // get replies data from comments we found
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

    return JSON.parse(
        JSON.stringify({ post, comments, replies, widgets, profile })
    ) as PostData
}
