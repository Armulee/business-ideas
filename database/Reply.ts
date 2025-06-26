import mongoose, { Document, Schema } from "mongoose"
import { IPost } from "./Post"
import { IComment } from "./Comment"
import { IProfile } from "./Profile"

export interface IReply extends Document<Schema.Types.ObjectId> {
    content: string
    comment: mongoose.Schema.Types.ObjectId
    author: mongoose.Schema.Types.ObjectId
    post: mongoose.Schema.Types.ObjectId
    upvoteCount?: number
    downvoteCount?: number
    createdAt: Date
    updatedAt?: Date
    replyTo: { id: string; name: string; avatar: string }
    postLink: string
}

export interface IReplyPopulated
    extends Omit<
        IReply,
        "comment" | "author" | "post" | "upvotes" | "downvotes"
    > {
    comment: IComment
    author: IProfile
    post: IPost
    upvotes: IProfile[]
    downvotes: IProfile[]
}

const ReplySchema = new Schema<IReply>({
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    upvoteCount: { type: Number, default: 0 },
    downvoteCount: { type: Number, default: 0 },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
    replyTo: {
        id: { type: String },
        name: { type: String },
        avatar: { type: String },
    },
    postLink: { type: String, required: true },
})

// After saving the reply, push _id to Profile.replies array
// ReplySchema.post<IPost>("save", async function (doc) {
//     await mongoose
//         .model("Profile")
//         .findByIdAndUpdate(
//             doc.author,
//             { $push: { replies: doc._id } },
//             { new: true, upsert: false }
//         )
// })

const Reply =
    mongoose.models.Reply || mongoose.model<IReply>("Reply", ReplySchema)
export default Reply
