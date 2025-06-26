import mongoose, { Document, Schema } from "mongoose"
import { IPost } from "./Post"
import { IProfile } from "./Profile"

export interface IComment extends Document<Schema.Types.ObjectId> {
    content: string
    author: mongoose.Schema.Types.ObjectId
    post: mongoose.Schema.Types.ObjectId
    upvoteCount?: number
    downvoteCount?: number
    createdAt: Date
    updatedAt?: Date
    postLink: string
}

export interface ICommentPopulated
    extends Omit<IComment, "author" | "post" | "upvotes" | "downvotes"> {
    author: IProfile
    post: IPost
    upvotes: IProfile[]
    downvotes: IProfile[]
}

const CommentSchema = new mongoose.Schema<IComment>({
    content: { type: String, required: true, trim: true }, // Ensure no leading/trailing spaces
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
    },
    upvoteCount: { type: Number, default: 0 },
    downvoteCount: { type: Number, default: 0 },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    postLink: { type: String, required: true },
})

const Comment =
    mongoose.models.Comment ||
    mongoose.model<IComment>("Comment", CommentSchema)
export default Comment
