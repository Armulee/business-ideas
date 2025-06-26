import mongoose, { Document, Schema } from "mongoose"
import Counter from "./Counter"
import slugify from "slugify"
import { IProfile } from "./Profile"
// import { IWidgets } from "./Widget"

export interface IPost extends Document<Schema.Types.ObjectId> {
    postId: number
    title: string
    author: mongoose.Schema.Types.ObjectId
    category?: string
    upvoteCount?: number
    downvoteCount?: number
    content: string
    tags?: string[]
    slug: string
    community: string
    commentCount?: number
    createdAt: Date
    updatedAt?: Date
    bookmarkCount?: number
    repostCount?: number
    viewCount?: number
    advancedSettings: {
        privacy: "public" | "followers"
        allowComments: boolean
        hideViewCount: boolean
        hideVoteCount: boolean
    }
    postLink: string
}

// ✅ Interface for Populated Post
export interface IPostPopulated extends Omit<IPost, "author"> {
    author: IProfile // Populated version
    // upvotes: IProfile[]
    // downvotes: IProfile[]
    // widgets: IWidgets
}

const PostSchema = new mongoose.Schema<IPost>({
    postId: { type: Number, unique: true },
    title: { type: String, required: true },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
    },
    category: { type: String },
    upvoteCount: { type: Number, default: 0 },
    downvoteCount: { type: Number, default: 0 },
    content: { type: String, required: true },
    tags: { type: [String] },
    slug: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    community: { type: String, required: true },
    bookmarkCount: { type: Number, default: 0 },
    repostCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    postLink: { type: String },
    advancedSettings: {
        privacy: {
            type: String,
            enum: ["public", "followers"],
            default: "public",
        },
        allowComments: { type: Boolean, default: true },
        hideViewCount: { type: Boolean, default: false },
        hideVoteCount: { type: Boolean, default: false },
    },
})

// Auto-increment the postId before saving
PostSchema.pre<IPost>("save", async function (next) {
    if (!this.postId) {
        const counter = await Counter.findOneAndUpdate(
            { name: "posts" },
            { $inc: { count: 1 } },
            { new: true, upsert: true }
        )

        this.postId = counter.count
    }

    // Generate a slug from title (if not set or title changes)
    if (!this.slug || this.isModified("title")) {
        this.slug = slugify(this.title, { lower: true, strict: true })
    }

    // Auto-generate and save postLink
    this.postLink = `/post/${this.postId}/${this.slug}`
    next()
})

const Post = mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema)
export default Post
