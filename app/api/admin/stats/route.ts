import { NextResponse } from "next/server"
import { auth } from "@/auth"
import connectDB from "@/database"
import Profile from "@/database/Profile"
import Post from "@/database/Post"
import Comment from "@/database/Comment"
import Reply from "@/database/Reply"
import Activity, { IActivityPopulated } from "@/database/Activity"
import { formatDate } from "@/utils/format-date"

export async function GET() {
    try {
        // Check if user is admin
        const session = await auth()
        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        // Get current date for today's stats
        const today = new Date()
        const startOfDay = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        )
        const lastMonth = new Date(
            today.getFullYear(),
            today.getMonth() - 1,
            today.getDate()
        )

        // Total counts
        const [totalUsers, totalPosts, totalComments, totalReplies] =
            await Promise.all([
                Profile.countDocuments(),
                Post.countDocuments(),
                Comment.countDocuments(),
                Reply.countDocuments(),
            ])

        // Today's new items
        const [newUsersToday, newPostsToday, newCommentsToday] =
            await Promise.all([
                Profile.countDocuments({ createdAt: { $gte: startOfDay } }),
                Post.countDocuments({ createdAt: { $gte: startOfDay } }),
                Comment.countDocuments({ createdAt: { $gte: startOfDay } }),
            ])

        // Last month's counts for growth calculation
        const [usersLastMonth, postsLastMonth, commentsLastMonth] =
            await Promise.all([
                Profile.countDocuments({ createdAt: { $lt: lastMonth } }),
                Post.countDocuments({ createdAt: { $lt: lastMonth } }),
                Comment.countDocuments({ createdAt: { $lt: lastMonth } }),
            ])

        // Calculate growth percentages
        const userGrowth =
            usersLastMonth > 0
                ? ((totalUsers - usersLastMonth) / usersLastMonth) * 100
                : 0
        const postGrowth =
            postsLastMonth > 0
                ? ((totalPosts - postsLastMonth) / postsLastMonth) * 100
                : 0
        const commentGrowth =
            commentsLastMonth > 0
                ? ((totalComments - commentsLastMonth) / commentsLastMonth) *
                  100
                : 0

        // Get total views from posts
        const viewsResult = await Post.aggregate([
            { $group: { _id: null, totalViews: { $sum: "$viewCount" } } },
        ])
        const totalViews = viewsResult[0]?.totalViews || 0

        // Calculate active users (users who have posted or commented in the last 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        const activeUserProfiles = await Promise.all([
            Post.distinct("author", { createdAt: { $gte: thirtyDaysAgo } }),
            Comment.distinct("author", { createdAt: { $gte: thirtyDaysAgo } }),
        ])
        const activeUsers = new Set([
            ...activeUserProfiles[0],
            ...activeUserProfiles[1],
        ]).size

        // Get chart data for the last 7 days
        const chartData = await getChartData()

        // Get recent activity from Activity model
        const recentActivity: IActivityPopulated[] = await Activity.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("actor", "name profileId")
            .populate("target", "title content")
            .select("type actor target targetType createdAt")

        // Format activity data for frontend
        const formattedActivity = recentActivity.map((activity) => ({
            action: getActivityAction(activity.type, activity.targetType),
            user: activity.actor?.name || "Unknown User",
            time: formatDate(activity.createdAt),
        }))

        const stats = {
            totalUsers,
            totalPosts,
            totalComments: totalComments + totalReplies,
            totalViews,
            activeUsers,
            newUsersToday,
            newPostsToday,
            newCommentsToday,
            userGrowth: Math.round(userGrowth * 10) / 10,
            postGrowth: Math.round(postGrowth * 10) / 10,
            commentGrowth: Math.round(commentGrowth * 10) / 10,
            viewGrowth: 0, // This would need view tracking over time
            chartData,
            recentActivity: formattedActivity,
        }

        return NextResponse.json(stats)
    } catch (error) {
        console.error("Error fetching admin stats:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

async function getChartData() {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (6 - i))
        return {
            date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            label: date.toLocaleDateString("en", { weekday: "short" }),
        }
    })

    const chartPromises = last7Days.map(async ({ date }) => {
        const nextDay = new Date(date)
        nextDay.setDate(nextDay.getDate() + 1)

        const [users, posts, comments] = await Promise.all([
            Profile.countDocuments({
                createdAt: { $gte: date, $lt: nextDay },
            }),
            Post.countDocuments({
                createdAt: { $gte: date, $lt: nextDay },
            }),
            Comment.countDocuments({
                createdAt: { $gte: date, $lt: nextDay },
            }),
        ])

        // Get views for posts created on this day (simplified)
        const viewsResult = await Post.aggregate([
            { $match: { createdAt: { $gte: date, $lt: nextDay } } },
            { $group: { _id: null, totalViews: { $sum: "$viewCount" } } },
        ])
        const views = viewsResult[0]?.totalViews || 0

        return { users, posts, comments, views }
    })

    const chartResults = await Promise.all(chartPromises)

    return {
        labels: last7Days.map((d) => d.label),
        userRegistrations: chartResults.map((r) => r.users),
        postCreations: chartResults.map((r) => r.posts),
        comments: chartResults.map((r) => r.comments),
        views: chartResults.map((r) => r.views),
    }
}

function getActivityAction(type: string, targetType: string): string {
    const actions = {
        upvote: `Upvoted ${targetType.toLowerCase()}`,
        downvote: `Downvoted ${targetType.toLowerCase()}`,
        bookmark: `Bookmarked ${targetType.toLowerCase()}`,
        repost: `Reposted ${targetType.toLowerCase()}`,
        comment: `Commented on ${targetType.toLowerCase()}`,
        reply: `Replied to ${targetType.toLowerCase()}`,
    }
    return (
        actions[type as keyof typeof actions] ||
        `${type} ${targetType.toLowerCase()}`
    )
}
