import mongoose, { Schema, Document, Types } from "mongoose"

export interface IReport extends Document<Types.ObjectId> {
    target: Types.ObjectId
    reporter: Types.ObjectId
    reason: string
    details?: string
    targetType: "Post" | "Comment" | "Reply"
    status: "pending" | "reviewed" | "resolved"
    createdAt: Date
    updatedAt: Date
}

const ReportSchema = new Schema<IReport>(
    {
        target: {
            type: Schema.Types.ObjectId,
            refPath: "targetType",
            required: true,
        },
        reporter: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
            required: true,
        },
        reason: {
            type: String,
            required: true,
        },
        details: {
            type: String,
            trim: true,
        },
        targetType: {
            type: String,
            enum: ["Post", "Comment", "Reply"],
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "reviewed", "resolved"],
            default: "pending",
        },
    },
    { timestamps: true }
)

// index so you can quickly list all reports on a given target
ReportSchema.index({ target: 1, targetType: 1 })

const Report =
    mongoose.models.Report || mongoose.model<IReport>("Report", ReportSchema)

export default Report
