import mongoose, { Document, Schema } from "mongoose"

export interface Widget {
    id: string
    type: WidgetType
    data?: SummaryData[] | PollData | string
}

export type WidgetType = "profile" | "summary" | "callToComment" | "quickPoll"

export type WidgetData =
    | { id: string; type: "profile" }
    | { id: string; type: "summary" }
    | { id: string; type: "callToComment" }
    | { id: string; type: "quickPoll" }

export interface IWidgets extends Document {
    post: mongoose.Schema.Types.ObjectId
    widgets: Widget[]
}

export interface SummaryData {
    id: string
    topic: string
    values: {
        id: string
        value: string
    }[]
}

export interface PollData {
    question: string
    options: {
        id: string
        value: string
        vote: string[]
    }[]
}

const WidgetSchema = new mongoose.Schema<IWidgets>({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
        index: true,
    },
    widgets: [
        {
            id: {
                type: String,
                required: true,
            },
            type: {
                type: String,
                enum: ["profile", "summary", "callToComment", "quickPoll"],
                required: true,
            },
            data: {
                type: Schema.Types.Mixed,
            },
        },
    ],
})

const Widget =
    mongoose.models.Widget || mongoose.model<IWidgets>("Widget", WidgetSchema)
export default Widget
