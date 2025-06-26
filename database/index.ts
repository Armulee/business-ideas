import mongoose from "mongoose"
import Post from "./Post"

const MONGODB_URI =
    process.env.MONGODB_URI ||
    "mongodb+srv://debugger:debugger@cluster0.ezjbt6b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, { dbName: "business_ideas" })
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error)
        process.exit(1) // Exit process if connection fails
    }
}

export async function fetchPostById(id: number) {
    await connectDB()

    const post = await Post.findOne({ postId: id }).populate(
        "author",
        "_id name image",
        "User"
    )

    return post ? post.toObject() : null
}

export default connectDB
