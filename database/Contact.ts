import mongoose, { Schema, Document } from "mongoose"

export interface IContact extends Document<Schema.Types.ObjectId> {
    firstName: string
    lastName: string
    email: string
    topic: string
    message: string
    createdAt: Date
    updatedAt: Date
}

const ContactSchema = new Schema<IContact>({
    firstName: { 
        type: String, 
        required: true,
        trim: true,
        maxlength: 50
    },
    lastName: { 
        type: String, 
        required: true,
        trim: true,
        maxlength: 50
    },
    email: { 
        type: String, 
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    topic: { 
        type: String, 
        required: true,
        trim: true
    },
    message: { 
        type: String, 
        required: true,
        trim: true,
        maxlength: 2000
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

ContactSchema.pre<IContact>("save", async function (next) {
    this.updatedAt = new Date()
    next()
})

// Index for faster searches
ContactSchema.index({ email: 1 })
ContactSchema.index({ topic: 1 })
ContactSchema.index({ createdAt: -1 })

const Contact =
    mongoose.models.Contact ||
    mongoose.model<IContact>("Contact", ContactSchema)

export default Contact