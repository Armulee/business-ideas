import mongoose from "mongoose"
import { Category } from "./Category"

export interface Post {
    title: string
    category_id: Category
    upvotes: number
    description: string
    created_data: Date
}

const PostSchema = new mongoose.Schema<Post>({
    title: { type: String, required: true },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    upvotes: { type: Number, default: 0 },
    description: { type: String, required: true },
    created_data: { type: Date, default: Date.now },
})

const Post = mongoose.models.Post || mongoose.model<Post>("Post", PostSchema)
export default Post
