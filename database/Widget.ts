import mongoose, { Document, Schema } from "mongoose"

export type WidgetData = SummaryData[] | PollData | string

export type WidgetType = "profile" | "summary" | "callToComment" | "quickPoll"

export interface IWidgets extends Document {
    postId: mongoose.Schema.Types.ObjectId
    type: WidgetType
    data: WidgetData
}

export interface SummaryData {
    topic: string
    values: string[]
}

export interface PollData {
    question: string
    options: {
        value: string
        vote: string[]
    }[]
}

const WidgetSchema = new mongoose.Schema<IWidgets>({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
        index: true,
    },
    type: {
        type: String,
        enum: ["profile", "summary", "callToComment", "quickPoll"],
        required: true,
    },
    data: {
        type: Schema.Types.Mixed,
    },
})

const Widget =
    mongoose.models.Widget || mongoose.model<IWidgets>("Widget", WidgetSchema)
export default Widget
