import mongoose, { Schema, Document } from "mongoose"

interface RatingWithComment {
    rating: number // 1-5 stars
    comment?: string // Optional additional text
}

export interface IFeedback extends Document<Schema.Types.ObjectId> {
    user: Schema.Types.ObjectId // Reference to Profile collection
    
    // Rating questions (1-5 stars each with optional comment)
    question1: RatingWithComment
    question2: RatingWithComment
    question3: RatingWithComment
    question4: RatingWithComment
    question5: RatingWithComment
    question6: RatingWithComment
    
    // Open text questions
    question7?: string
    question8?: string
    question9?: string
    question10?: string
    
    createdAt: Date
    updatedAt: Date
}

// Rating with comment schema
const RatingWithCommentSchema = new Schema({
    rating: { 
        type: Number, 
        required: true,
        min: 1,
        max: 5
    },
    comment: { type: String }
}, { _id: false })

// Feedback schema
const FeedbackSchema = new Schema<IFeedback>({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'Profile',
        required: false 
    },
    
    question1: { type: RatingWithCommentSchema, required: true },
    question2: { type: RatingWithCommentSchema, required: true },
    question3: { type: RatingWithCommentSchema, required: true },
    question4: { type: RatingWithCommentSchema, required: true },
    question5: { type: RatingWithCommentSchema, required: true },
    question6: { type: RatingWithCommentSchema, required: true },
    
    question7: { type: String },
    question8: { type: String },
    question9: { type: String },
    question10: { type: String },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

FeedbackSchema.pre<IFeedback>("save", async function (next) {
    this.updatedAt = new Date()
    next()
})

const Feedback =
    mongoose.models.Feedback ||
    mongoose.model<IFeedback>("Feedback", FeedbackSchema)
export default Feedback