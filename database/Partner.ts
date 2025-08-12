// /database/Partner.ts
import mongoose, { Document, Schema, models } from "mongoose"

export interface IPartner extends Document<Schema.Types.ObjectId> {
    name?: string
    allowedDomains?: string[] // e.g., ["example.com", "site.co"]
    categories?: string[] // site topics/taxonomy
    status: "active" | "paused"
    createdAt?: Date
    updatedAt?: Date
}

const PartnerSchema = new Schema<IPartner>(
    {
        name: { type: String },
        allowedDomains: { type: [String] }, // e.g., ["example.com", "news.site.co"]
        categories: { type: [String] }, // site topics
        status: { type: String, enum: ["active", "paused"], default: "active" },
    },
    { timestamps: true }
)

export default models.Partner ||
    mongoose.model<IPartner>("Partner", PartnerSchema)
