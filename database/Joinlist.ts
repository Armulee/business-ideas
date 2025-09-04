import mongoose, { Schema, Document } from "mongoose"

export interface IJoinlist extends Document {
    profile: string // Reference to MongoDB Profile._id
    type: "business" | "partner"
    marketing: boolean
    createdAt: Date
}

const JoinlistSchema = new Schema<IJoinlist>({
    profile: {
        type: String,
        required: true,
        ref: "Profile"
    },
    type: {
        type: String,
        required: true,
        enum: ["business", "partner"]
    },
    marketing: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// Create compound index to prevent duplicate entries
JoinlistSchema.index({ profile: 1, type: 1 }, { unique: true })

export default mongoose.models.Joinlist || mongoose.model<IJoinlist>("Joinlist", JoinlistSchema)