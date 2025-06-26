import mongoose from "mongoose"
import { IProfile } from "./Profile"
import { IPost } from "./Post"
import { IComment } from "./Comment"
import { IReply } from "./Reply"

export interface IActivity
    extends mongoose.Document<mongoose.Schema.Types.ObjectId> {
    target: mongoose.Schema.Types.ObjectId
    recipient: mongoose.Schema.Types.ObjectId
    actor: mongoose.Schema.Types.ObjectId
    type: "upvote" | "downvote" | "bookmark" | "repost" | "comment" | "reply"
    targetType: "Post" | "Comment" | "Reply"
    isRead: boolean
    createdAt: Date
    updatedAt: Date
}

export interface IActivityPopulated
    extends Omit<IActivity, "target" | "recipient" | "actor"> {
    target: IPost | IComment | IReply
    recipient: IProfile
    actor: IProfile
}

const ActivitySchema = new mongoose.Schema<IActivity>(
    {
        target: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "targetType",
            required: true,
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Profile",
            required: true,
        },
        actor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Profile",
            required: true,
        },
        type: {
            type: String,
            enum: [
                "upvote",
                "downvote",
                "bookmark",
                "repost",
                "comment",
                "reply",
            ],
            required: true,
        },
        targetType: {
            type: String,
            enum: ["Post", "Comment", "Reply"],
            required: true,
        },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
)

// composite index to make lookups fast
ActivitySchema.index({ target: 1, targetType: 1, type: 1, createdAt: -1 })

const Activity =
    mongoose.models.Activity ||
    mongoose.model<IActivity>("Activity", ActivitySchema)
export default Activity
