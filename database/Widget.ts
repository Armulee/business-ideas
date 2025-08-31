import mongoose, { Document, Schema } from "mongoose"

// Legacy types (kept for backward compatibility)
export type WidgetData = SummaryData[] | PollData | string
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

// New comprehensive widget types
export type NewWidgetType = 
  | 'poll' | 'slider' | 'rating' | 'visual-pick' | 'private-comment'
  | 'checklist' | 'swiper' | 'cta' | 'reorder' | 'range' 
  | 'social-medias' | 'follow' | 'summarizer' | 'milestone'

// Legacy widget types (kept for compatibility)
export type LegacyWidgetType = "profile" | "summary" | "callToComment" | "quickPoll"

// Combined widget type
export type WidgetType = NewWidgetType | LegacyWidgetType

// New Widget Schema - Stores widget configuration for posts
export interface IWidget extends Document {
  _id: mongoose.Types.ObjectId
  postId: mongoose.Types.ObjectId
  type: WidgetType
  question: string
  isRequired: boolean
  configuration: any // Widget-specific configuration
  createdAt: Date
  updatedAt: Date
}

const NewWidgetSchema = new Schema<IWidget>({
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      // New widget types
      'poll', 'slider', 'rating', 'visual-pick', 'private-comment',
      'checklist', 'swiper', 'cta', 'reorder', 'range', 
      'social-medias', 'follow', 'summarizer', 'milestone',
      // Legacy widget types
      'profile', 'summary', 'callToComment', 'quickPoll'
    ]
  },
  question: {
    type: String,
    required: true,
    maxlength: 500
  },
  isRequired: {
    type: Boolean,
    default: false
  },
  configuration: {
    type: Schema.Types.Mixed,
    required: true
  }
}, {
  timestamps: true
})

// Widget Response Schema - Stores user interactions with widgets
export interface IWidgetResponse extends Document {
  _id: mongoose.Types.ObjectId
  widgetId: mongoose.Types.ObjectId
  postId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  response: any // Response data specific to widget type
  isPrivate: boolean
  submittedAt: Date
  updatedAt: Date
}

const WidgetResponseSchema = new Schema<IWidgetResponse>({
  widgetId: {
    type: Schema.Types.ObjectId,
    ref: "Widget",
    required: true,
    index: true
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post", 
    required: true,
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  response: {
    type: Schema.Types.Mixed,
    required: true
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Compound indexes for efficient queries
WidgetResponseSchema.index({ widgetId: 1, userId: 1 }, { unique: true })
WidgetResponseSchema.index({ postId: 1, userId: 1 })
NewWidgetSchema.index({ postId: 1 }, { unique: true }) // One widget per post

// Legacy Widget Schema (kept for backward compatibility)
export interface IWidgets extends Document {
    postId: mongoose.Schema.Types.ObjectId
    type: LegacyWidgetType
    data: WidgetData
}

const LegacyWidgetSchema = new mongoose.Schema<IWidgets>({
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

// Export models
export const Widget = mongoose.models.Widget || mongoose.model<IWidget>("Widget", NewWidgetSchema)
export const WidgetResponse = mongoose.models.WidgetResponse || mongoose.model<IWidgetResponse>("WidgetResponse", WidgetResponseSchema)

// Legacy model export (for backward compatibility)
export const LegacyWidget = mongoose.models.LegacyWidget || mongoose.model<IWidgets>("LegacyWidget", LegacyWidgetSchema)

// Default export for backward compatibility
export default Widget
