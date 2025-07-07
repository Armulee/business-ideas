import mongoose, { Schema, Document } from "mongoose"
import Counter from "./Counter"

interface SocialMedia {
    facebook: string
    instagram: string
    x: string
    linkedin: string
}

export interface IProfile extends Document<Schema.Types.ObjectId> {
    user: Schema.Types.ObjectId
    profileId: number
    name: string
    email: string
    avatar?: string
    bio?: string
    location?: string
    website?: string
    socialMedias: SocialMedia
    followingCount: number
    followerCount: number
    viewCount: number
    postCount: number
    commentCount: number
    replyCount: number
    repostCount: number
    bookmarkCount: number
    upvoteCount: number
    downvoteCount: number
    badges?: string[]
    hasSeenWelcome: boolean
    createdAt: Date
    updatedAt: Date
}

// ✅ Populated Profile Interface (PostgreSQL User reference via ID string)
export interface IProfilePopulated extends Omit<IProfile, "user"> {
    user: string // PostgreSQL User ID reference
}

// Profile schema
const ProfileSchema = new Schema<IProfile>({
    user: { type: Schema.Types.ObjectId, required: false }, // Legacy field, now using PostgreSQL User
    profileId: { type: Number, unique: true },
    avatar: { type: String },
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    bio: { type: String },
    location: { type: String },
    website: { type: String },
    socialMedias: {
        type: new Schema(
            {
                facebook: { type: String, default: "" },
                instagram: { type: String, default: "" },
                x: { type: String, default: "" },
                linkedin: { type: String, default: "" },
            },
            { _id: false }
        ),
        default: {}, // Ensures it doesn’t create an empty object by default
    },
    followerCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    postCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    replyCount: { type: Number, default: 0 },
    upvoteCount: { type: Number, default: 0 },
    downvoteCount: { type: Number, default: 0 },
    repostCount: { type: Number, default: 0 },
    bookmarkCount: { type: Number, default: 0 },
    badges: { type: [String] },
    hasSeenWelcome: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
})

ProfileSchema.pre<IProfile>("save", async function (next) {
    if (!this.profileId) {
        const counter = await Counter.findOneAndUpdate(
            { name: "profiles" }, // Change counter name
            { $inc: { count: 1 } },
            { new: true, upsert: true }
        )

        this.profileId = counter.count
    }
    next()
})

const Profile =
    mongoose.models.Profile ||
    mongoose.model<IProfile>("Profile", ProfileSchema)
export default Profile
