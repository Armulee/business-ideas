// /database/Impression.ts
import mongoose, { Document, Schema, models } from "mongoose"

export interface IImpression extends Document<Schema.Types.ObjectId> {
    partnerId: string // IPartner._id
    postId?: string | null // related post (optional)
    refDomain?: string | null // parent site domain (no www)
    refUrl?: string | null // full referrer if available
    country?: string | null // ISO-2
    ua?: string | null // user-agent
    ipHash?: string | null // sha256 of IP (for dedupe/fraud)
    type: "impression" | "engagement"
    createdAt?: Date
    updatedAt?: Date
}

const ImpressionSchema = new Schema<IImpression>(
    {
        partnerId: { type: String },
        postId: { type: Schema.Types.ObjectId, ref: "Post" },
        refDomain: { type: String }, // parsed parent domain
        refUrl: { type: String }, // full referrer if available
        country: { type: String }, // geo
        ua: { type: String },
        ipHash: { type: String }, // hashed IP for dedupe/fraud
        type: {
            type: String,
            enum: ["impression", "engagement"],
            default: "impression",
        },
    },
    { timestamps: true }
)

export default models.Impression ||
    mongoose.model<IImpression>("Impression", ImpressionSchema)
