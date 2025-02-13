import mongoose from "mongoose"

const MONGODB_URI =
    process.env.MONGODB_URI ||
    "mongodb+srv://debugger:debugger@cluster0.ezjbt6b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, { dbName: "business_ideas" })
        console.log("✅ MongoDB Connected Successfully!")
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error)
        process.exit(1) // Exit process if connection fails
    }
}

export default connectDB
