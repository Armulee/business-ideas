import mongoose, { Document, Schema } from "mongoose"
import { IProfile } from "./Profile"
import { Widget } from "./Widget"

export interface IDraftPost extends Document<Schema.Types.ObjectId> {
    title?: string
    author: mongoose.Schema.Types.ObjectId
    category?: string
    categories?: string[]
    content?: string
    tags?: string[]
    community: string
    createdAt: Date
    updatedAt: Date
    lastSavedAt: Date
    advancedSettings?: {
        privacy: "public" | "followers"
        allowComments: boolean
        hideViewCount: boolean
        hideVoteCount: boolean
        globalPost: boolean
        targetRegion?: string
        targetCountry?: string
    }
    widgets?: Widget[]
}

// ✅ Interface for Populated DraftPost
export interface IDraftPostPopulated extends Omit<IDraftPost, "author"> {
    author: IProfile // Populated version
}

const DraftPostSchema = new mongoose.Schema<IDraftPost>({
    title: { type: String },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
    },
    category: { type: String },
    categories: { type: [String] },
    content: { type: String },
    tags: { type: [String] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastSavedAt: { type: Date, default: Date.now },
    community: { type: String, required: true },
    widgets: { type: Schema.Types.Mixed },
    advancedSettings: {
        privacy: {
            type: String,
            enum: ["public", "followers"],
            default: "public",
        },
        allowComments: { type: Boolean, default: true },
        hideViewCount: { type: Boolean, default: false },
        hideVoteCount: { type: Boolean, default: false },
        globalPost: { type: Boolean, default: true },
        targetRegion: { type: String, default: "worldwide" },
        targetCountry: { type: String, default: "" },
    },
})

// Update timestamps on save
DraftPostSchema.pre<IDraftPost>("save", async function (next) {
    this.updatedAt = new Date()
    this.lastSavedAt = new Date()
    next()
})

const DraftPost =
    mongoose.models.DraftPost ||
    mongoose.model<IDraftPost>("DraftPost", DraftPostSchema)
export default DraftPost
