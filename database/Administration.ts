import mongoose, { Schema, Document } from "mongoose"

export interface IAdministration extends Document<Schema.Types.ObjectId> {
    user: {
        userId: string // PostgreSQL User ID
        profileId: number // MongoDB Profile ID
    }
    action: 'restrict' | 'delete' | 'reset_avatar' | 'reset_username' | 'change_role'
    reason: string
    duration?: string // For restriction actions
    previousRole?: string // For role change actions
    newRole?: string // For role change actions
    adminId: string // PostgreSQL User ID of admin who performed action
    adminProfileId: number // MongoDB Profile ID of admin who performed action
    result: 'approved' | 'temporary_ban' | 'permanent_ban' | 'reset_avatar' | 'reset_username' | 'role_changed'
    createdAt: Date
    updatedAt: Date
}

const AdministrationSchema = new Schema<IAdministration>({
    user: {
        type: new Schema({
            userId: { type: String, required: true },
            profileId: { type: Number, required: true }
        }, { _id: false }),
        required: true
    },
    action: { 
        type: String, 
        enum: ['restrict', 'delete', 'reset_avatar', 'reset_username', 'change_role'], 
        required: true 
    },
    reason: { type: String, required: true },
    duration: { type: String }, // For restriction actions (e.g., "7", "14", "30")
    previousRole: { type: String }, // For role change tracking
    newRole: { type: String }, // For role change tracking
    adminId: { type: String, required: true }, // PostgreSQL User ID of admin
    adminProfileId: { type: Number, required: true }, // MongoDB Profile ID of admin
    result: { 
        type: String, 
        enum: ['approved', 'temporary_ban', 'permanent_ban', 'reset_avatar', 'reset_username', 'role_changed'], 
        required: true 
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

// Update the updatedAt field before saving
AdministrationSchema.pre<IAdministration>("save", function (next) {
    this.updatedAt = new Date()
    next()
})

const Administration =
    mongoose.models.Administration ||
    mongoose.model<IAdministration>("Administration", AdministrationSchema)

export default Administration