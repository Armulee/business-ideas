import { ProfileData, Activities } from "@/components/profile/types"
import connectDB from "@/database"
import Activity from "@/database/Activity"
import Comment from "@/database/Comment"
import { Follow, IFollowPopulated } from "@/database/Follow"
import Post from "@/database/Post"
import Profile, { IProfile } from "@/database/Profile"
import Reply from "@/database/Reply"

// Get only profile header data (fast loading)
export async function getProfileHeader(id: string) {
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

    return JSON.parse(
        JSON.stringify({
            profile: profileDoc.toObject(),
            followings,
            followers,
        })
    )
}

// Get profile stats (medium priority)
export async function getProfileStats(profileObjectId: string) {
    const [postCount, commentCount, replyCount] = await Promise.all([
        Post.countDocuments({ author: profileObjectId }),
        Comment.countDocuments({ author: profileObjectId }),
        Reply.countDocuments({ author: profileObjectId }),
    ])

    return {
        postCount,
        commentCount,
        replyCount,
        totalContent: postCount + commentCount + replyCount,
    }
}

// Get profile activities (slow loading, conditional for owner)
export async function getProfileActivities(profileObjectId: string, isOwner: boolean = false) {
    // Always fetch posts, comments, replies
    const [posts, comments, replies] = await Promise.all([
        Post.find({ author: profileObjectId })
            .populate("author", "name profileId avatar")
            .select(
                "title postLink content category createdAt viewCount commentCount upvoteCount downvoteCount"
            ),
        Comment.find({ author: profileObjectId })
            .populate("author", "name profileId avatar")
            .populate("post", "title")
            .select("postLink post author content createdAt"),
        Reply.find({ author: profileObjectId })
            .populate("author", "name profileId avatar")
            .populate("comment", "content")
            .populate("post", "title")
            .select("postLink comment post content createdAt author"),
    ])

    const activities: Activities = {
        posts,
        discusses: { comments, replies },
        reposts: [],
        upvotes: [],
        downvotes: [],
        bookmarks: [],
    }

    // Only fetch private activities if user is the owner
    if (isOwner) {
        const [upvoteActs, downvoteActs, repostActs, bookmarkActs] =
            await Promise.all([
                Activity.find({ actor: profileObjectId, type: "upvote" })
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
                Activity.find({ actor: profileObjectId, type: "downvote" })
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
                Activity.find({ actor: profileObjectId, type: "repost" })
                    .populate({
                        path: "target",
                        select: "title postLink content category createdAt viewCount commentCount upvoteCount downvoteCount",
                        populate: {
                            path: "author",
                            select: "name profileId avatar",
                        },
                    })
                    .sort({ createdAt: -1 })
                    .lean(),
                Activity.find({ actor: profileObjectId, type: "bookmark" })
                    .populate({
                        path: "target",
                        select: "title postLink content category createdAt viewCount commentCount upvoteCount downvoteCount",
                        populate: {
                            path: "author",
                            select: "name profileId avatar",
                        },
                    })
                    .sort({ createdAt: -1 })
                    .lean(),
            ])

        // Pull the "target" documents out of each activity
        activities.upvotes = upvoteActs.map(({ target, targetType, createdAt }) => ({
            ...target,
            targetType,
            createdAt,
        }))
        activities.downvotes = downvoteActs.map(
            ({ target, targetType, createdAt }) => ({
                ...target,
                targetType,
                createdAt,
            })
        )
        activities.reposts = repostActs.map(({ target }) => ({
            ...target,
            targetType: "Post",
        }))
        activities.bookmarks = bookmarkActs.map(({ target }) => ({
            ...target,
            targetType: "Post",
        }))
    }

    return JSON.parse(JSON.stringify(activities))
}

// Original function kept for backward compatibility
export default async function getProfile(id: string) {
    try {
        const headerData = await getProfileHeader(id)
        const statsData = await getProfileStats(headerData.profile._id)
        const activitiesData = await getProfileActivities(headerData.profile._id, true)

        return {
            ...headerData,
            stats: statsData,
            activities: activitiesData,
        } as ProfileData
    } catch (err) {
        throw new Error((err as Error).message)
    }
}