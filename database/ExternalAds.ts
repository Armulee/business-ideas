// /database/ExternalAds.ts (your “related widget post” source)
import mongoose, { Document, Schema, models } from "mongoose"

export interface IExternalAds extends Document<Schema.Types.ObjectId> {
    post: Schema.Types.ObjectId // store as string in app layer; Mongoose will be ObjectId
    title: string
    targetCountries?: string[] // ISO-2 codes (e.g., ["US","TH"]); empty or undefined = global
    targetCategories?: string[] // match against partner.categories
    budgetRemaining: number // in your platform currency
    cpm: number // bid weight / ranking
    status: "active" | "paused"
    expiresAt?: Date | null
    createdAt?: Date
    updatedAt?: Date
}

const ExternalAdsSchema = new Schema<IExternalAds>(
    {
        post: { type: Schema.Types.ObjectId, ref: "Post" },
        title: { type: String },
        targetCountries: { type: [String] }, // e.g., ["US","TH"]
        targetCategories: { type: [String] }, // match partner categories
        budgetRemaining: { type: Number }, // currency units
        cpm: { type: Number }, // for ranking
        status: { type: String, enum: ["active", "paused"], default: "active" },
        expiresAt: { type: Date },
    },
    { timestamps: true }
)

export default models.ExternalAds ||
    mongoose.model<IExternalAds>("ExternalAds", ExternalAdsSchema)
