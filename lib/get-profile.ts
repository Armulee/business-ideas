import { ProfileData } from "@/components/profile/types"
import connectDB from "@/database"
import Activity from "@/database/Activity"
import Comment from "@/database/Comment"
import { Follow, IFollowPopulated } from "@/database/Follow"
import Post from "@/database/Post"
import Profile, { IProfile } from "@/database/Profile"
import Reply from "@/database/Reply"

export default async function getProfile(id: string) {
    try {
        await connectDB()

        // Load the profile
        const profileDoc = await Profile.findOne({ profileId: Number(id) })
        if (!profileDoc) throw new Error("Profile not found")

        const userId = profileDoc._id
        // Fetch followings & followers in parallel
        const [followingDocs, followerDocs] = await Promise.all([
            Follow.find({ follower: userId })
                .populate("followee", "name avatar profileId")
                .select("followee")
                .sort({ createdAt: -1 })
                .lean<IFollowPopulated[]>(),
            Follow.find({ followee: userId })
                .populate("follower", "name avatar profileId")
                .select("follower")
                .sort({ createdAt: -1 })
                .lean<IFollowPopulated[]>(),
        ])

        const followings: Pick<
            IProfile,
            "name" | "profileId" | "avatar" | "_id"
        >[] = followingDocs.map(({ followee }) => ({
            ...followee,
        }))
        const followers: Pick<
            IProfile,
            "name" | "profileId" | "avatar" | "_id"
        >[] = followerDocs.map(({ follower }) => ({
            ...follower,
        }))

        // Fetch the user’s own content (posts / comments / replies)
        const [posts, comments, replies] = await Promise.all([
            Post.find({ author: userId })
                .populate("author", "name profileId avatar")
                .select(
                    "title postLink content category createdAt viewCount commentCount upvoteCount downvoteCount"
                ),
            Comment.find({ author: userId })
                .populate("author", "name profileId avatar")
                .populate("post", "title")
                .select("postLink post author content createdAt"),
            Reply.find({ author: userId })
                .populate("author", "name profileId avatar")
                .populate("comment", "content")
                .populate("post", "title")
                .select("postLink comment post content createdAt author"),
        ])

        // Fetch activity‐based interactions
        const [upvoteActs, downvoteActs, repostActs, bookmarkActs] =
            await Promise.all([
                Activity.find({ actor: userId, type: "upvote" })
                    .populate({
                        path: "target",
                        select: "title content author post postLink",
                        populate: [
                            {
                                path: "post",
                                select: "title",
                                strictPopulate: false,
                            },
                            {
                                path: "author",
                                select: "name avatar",
                            },
                        ],
                    })
                    .sort({ createdAt: -1 })
                    .lean(),
                Activity.find({ actor: userId, type: "downvote" })
                    .populate({
                        path: "target",
                        select: "title content author post postLink",
                        populate: [
                            {
                                path: "post",
                                select: "title",
                                strictPopulate: false,
                            },
                            {
                                path: "author",
                                select: "name avatar",
                            },
                        ],
                    })
                    .sort({ createdAt: -1 })
                    .lean(),
                Activity.find({ actor: userId, type: "repost" })
                    .populate("target", "postLink title author avatar")
                    .sort({ createdAt: -1 })
                    .lean(),
                Activity.find({ actor: userId, type: "bookmark" })
                    .populate("target", "postLink title author avatar")
                    .sort({ createdAt: -1 })
                    .lean(),
            ])

        // Pull the “target” documents out of each activity
        const upvotes = upvoteActs.map(({ target, targetType, createdAt }) => ({
            ...target,
            targetType,
            createdAt,
        }))
        const downvotes = downvoteActs.map(
            ({ target, targetType, createdAt }) => ({
                ...target,
                targetType,
                createdAt,
            })
        )
        const reposts = repostActs.map(({ target }) => ({
            ...target,
            targetType: "Post",
        }))
        const bookmarks = bookmarkActs.map(({ target }) => ({
            ...target,
            targetType: "Post",
        }))

        // Assemble into your ProfileData shape
        return JSON.parse(
            JSON.stringify({
                profile: profileDoc.toObject(),
                followings,
                followers,
                activities: {
                    posts,
                    discusses: { comments, replies },
                    reposts,
                    upvotes,
                    downvotes,
                    bookmarks,
                },
            })
        ) as ProfileData
    } catch (err) {
        throw new Error((err as Error).message)
    }
}
