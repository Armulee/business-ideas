import connectDB from "@/database"
import Activity from "@/database/Activity"
import Comment from "@/database/Comment"
import Post from "@/database/Post"
import Profile, { IProfile } from "@/database/Profile"
import Reply from "@/database/Reply"
import Widget from "@/database/Widget"
import { Types } from "mongoose"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        await connectDB()
        const slug = await Post.findOne({ postId: id }).select("slug")

        if (!slug) {
            return NextResponse.json(
                { message: "Post not found" },
                { status: 404 }
            )
        }
        return NextResponse.json(slug, { status: 200 })
    } catch (err) {
        console.error(err)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

// Delete post
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB()
        const { id } = await params
        if (!id) {
            return NextResponse.json(
                { error: "Id param is required to delete post" },
                { status: 400 }
            )
        }

        // 1. Find the post (and its author)
        const post = await Post.findById(id).populate("author", "_id")
        if (!post) {
            return NextResponse.json(
                { message: "Post not found" },
                { status: 404 }
            )
        }
        const postAuthorId = post.author._id.toString()

        // 2. Find all comments on that post
        const comments = await Comment.find({ post: id })
            .select("_id author")
            .lean()
        const commentIds = comments.map((c) => c._id)
        const commentAuthorCounts = comments.reduce<Record<string, number>>(
            (acc, { author }) => {
                const key = author.toString()
                acc[key] = (acc[key] || 0) + 1
                return acc
            },
            {}
        )

        // 3. Find all replies to those comments
        const replies = await Reply.find({ comment: { $in: commentIds } })
            .select("_id author")
            .lean()
        const replyIds = replies.map((r) => r._id)
        const replyAuthorCounts = replies.reduce<Record<string, number>>(
            (acc, { author }) => {
                const key = author.toString()
                acc[key] = (acc[key] || 0) + 1
                return acc
            },
            {}
        )

        // 4. Gather all the Activity documents we need to delete,
        //    and build upvote/downvote/bookmark/repost counts per actor
        const allTargets = [post._id, ...commentIds, ...replyIds]
        const acts = await Activity.find({
            target: { $in: allTargets },
        })
            .select("actor type")
            .lean()

        // tally how many of each type each actor did
        const actorCounts: Record<
            string,
            {
                upvoteCount: number
                downvoteCount: number
                bookmarkCount: number
                repostCount: number
            }
        > = {}
        for (const { actor, type } of acts) {
            const key = (actor as Types.ObjectId).toString()
            if (!actorCounts[key]) {
                actorCounts[key] = {
                    upvoteCount: 0,
                    downvoteCount: 0,
                    bookmarkCount: 0,
                    repostCount: 0,
                }
            }
            switch (type) {
                case "upvote":
                    actorCounts[key].upvoteCount++
                    break
                case "downvote":
                    actorCounts[key].downvoteCount++
                    break
                case "bookmark":
                    actorCounts[key].bookmarkCount++
                    break
                case "repost":
                    actorCounts[key].repostCount++
                    break
                // we do NOT decrement commentsCount/repliesCount here—
                // those come from actual comment/reply docs
            }
        }

        // 5. Delete the post, its comments, replies, widget, and activities
        await Promise.all([
            Post.findByIdAndDelete(id),
            Comment.deleteMany({ _id: { $in: commentIds } }),
            Reply.deleteMany({ _id: { $in: replyIds } }),
            Widget.deleteOne({ post: post._id }),
            Activity.deleteMany({ target: { $in: allTargets } }),
        ])

        // 6. Decrement the counters on Profiles
        const updates: Promise<IProfile | null>[] = []

        // a) post author: postsCount--
        updates.push(
            Profile.findByIdAndUpdate(postAuthorId, {
                $inc: { postCount: -1 },
            })
        )

        // b) comment authors
        for (const [authorId, count] of Object.entries(commentAuthorCounts)) {
            updates.push(
                Profile.findByIdAndUpdate(authorId, {
                    $inc: { commentCount: -count },
                })
            )
        }

        // c) reply authors
        for (const [authorId, count] of Object.entries(replyAuthorCounts)) {
            updates.push(
                Profile.findByIdAndUpdate(authorId, {
                    $inc: { replyCount: -count },
                })
            )
        }

        // d) actors of upvotes/downvotes/bookmarks/reposts
        for (const [
            actorId,
            { upvoteCount, downvoteCount, bookmarkCount, repostCount },
        ] of Object.entries(actorCounts)) {
            updates.push(
                Profile.findByIdAndUpdate(actorId, {
                    $inc: {
                        upvoteCount,
                        downvoteCount,
                        bookmarkCount,
                        repostCount,
                    },
                })
            )
        }

        await Promise.all(updates)

        return NextResponse.json(
            { message: "Post and all related data deleted" },
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
