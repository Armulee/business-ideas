import mongoose, { Document, Schema } from "mongoose"

export interface PolicySection {
    title: string
    content: string
    list?: string[]
}

export interface IPolicy extends Document {
    type: "privacy-policy" | "terms-conditions"
    sections: PolicySection[]
    createdAt: Date
    updatedAt: Date
}

const PolicySectionSchema = new Schema<PolicySection>({
    title: {
        type: String,
        required: false,
        trim: true,
        default: "",
    },
    content: {
        type: String,
        required: true,
    },
    list: [
        {
            type: String,
            trim: true,
        },
    ],
})

const PolicySchema = new Schema<IPolicy>(
    {
        type: {
            type: String,
            enum: ["privacy-policy", "terms-conditions"],
            required: true,
            unique: true,
        },
        sections: [PolicySectionSchema],
    },
    {
        timestamps: true,
    }
)

const Policy =
    mongoose.models.Policy || mongoose.model<IPolicy>("Policy", PolicySchema)

export default Policy
