import { Schema, model, Document, Types, models } from "mongoose"
import { IProfile } from "./Profile"

// Define the TS interface for a Follow
export interface IFollow extends Document<Types.ObjectId> {
    follower: Types.ObjectId // who is doing the following
    followee: Types.ObjectId // who is being followed
    createdAt: Date
}

export interface IFollowPopulated
    extends Omit<IFollow, "follower" | "followee"> {
    follower: IProfile
    followee: IProfile
}

// Create the Mongoose schema using that interface
const FollowSchema = new Schema<IFollow>({
    follower: { type: Schema.Types.ObjectId, ref: "Profile", required: true },
    followee: { type: Schema.Types.ObjectId, ref: "Profile", required: true },
    createdAt: { type: Date, default: Date.now },
})

// Unique compound index to prevent duplicate follows
FollowSchema.index({ follower: 1, followee: 1 }, { unique: true })
// Index to make “get all followers of X” fast
FollowSchema.index({ followee: 1 })

export const Follow = models.Follow || model<IFollow>("Follow", FollowSchema)
