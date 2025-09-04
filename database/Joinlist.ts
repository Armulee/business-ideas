import mongoose, { Schema, Document } from "mongoose"

export interface IJoinlist extends Document<Schema.Types.ObjectId> {
    profile: Schema.Types.ObjectId // Reference to Profile collection
    type: 'business' | 'partner' | 'other'
    marketing: boolean // Email marketing consent
    createdAt: Date
    updatedAt: Date
}

// Joinlist schema
const JoinlistSchema = new Schema<IJoinlist>({
    profile: { 
        type: Schema.Types.ObjectId, 
        ref: 'Profile', 
        required: true 
    },
    type: { 
        type: String, 
        enum: ['business', 'partner', 'other'], 
        required: true 
    },
    marketing: { 
        type: Boolean, 
        required: true, 
        default: false 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    },
})

// Update the updatedAt field before saving
JoinlistSchema.pre<IJoinlist>('save', function(next) {
    this.updatedAt = new Date()
    next()
})

const Joinlist =
    mongoose.models.Joinlist ||
    mongoose.model<IJoinlist>("Joinlist", JoinlistSchema)

export default Joinlist