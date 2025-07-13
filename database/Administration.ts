import mongoose, { Schema, Document } from "mongoose"

export interface IAdministration extends Document<Schema.Types.ObjectId> {
    user: {
        _id: Schema.Types.ObjectId
        name: string
        email: string
        avatar?: string
        profileId: number
    }
    action:
        | "restrict"
        | "delete"
        | "reset_avatar"
        | "reset_username"
        | "reset_bio"
        | "change_role"
    reason: string
    duration?: string // For restriction actions
    previousRole?: string // For role change actions
    newRole?: string // For role change actions
    previousAvatar?: string // For avatar reset actions
    previousUsername?: string // For username reset actions
    newUsername?: string // For username reset actions
    previousBio?: string // For bio reset actions
    admin: {
        _id: Schema.Types.ObjectId
        name: string
        email: string
        avatar?: string
        profileId: number
    }
    result:
        | "approved"
        | "temporary_ban"
        | "permanent_ban"
        | "reset_avatar"
        | "reset_username"
        | "reset_bio"
        | "role_changed"
    createdAt: Date
    updatedAt: Date
}

const AdministrationSchema = new Schema<IAdministration>({
    user: {
        _id: { type: Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        avatar: { type: String },
        profileId: { type: Number, required: true }
    },
    action: {
        type: String,
        enum: [
            "restrict",
            "delete",
            "reset_avatar",
            "reset_username",
            "reset_bio",
            "change_role",
        ],
        required: true,
    },
    reason: { type: String, required: true },
    duration: { type: String }, // For restriction actions (e.g., "7", "14", "30")
    previousRole: { type: String }, // For role change tracking
    newRole: { type: String }, // For role change tracking
    previousAvatar: { type: String }, // For avatar reset tracking
    previousUsername: { type: String }, // For username reset tracking
    newUsername: { type: String }, // For username reset tracking
    previousBio: { type: String }, // For bio reset tracking
    admin: {
        _id: { type: Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        avatar: { type: String },
        profileId: { type: Number, required: true }
    },
    result: {
        type: String,
        enum: [
            "approved",
            "temporary_ban",
            "permanent_ban",
            "reset_avatar",
            "reset_username",
            "reset_bio",
            "role_changed",
        ],
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
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
