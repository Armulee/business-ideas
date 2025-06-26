import mongoose, { Document, Schema } from "mongoose"

export interface IUser extends Document<Schema.Types.ObjectId> {
    name?: string
    email: string
    password?: string
    provider: string
    verified: boolean
    verificationToken?: string
    verificationExpires?: Date
    resetPasswordToken?: string
}

const UserSchema = new mongoose.Schema<IUser>({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    provider: { type: String, required: true },
    verified: { type: Boolean, default: true },
    verificationToken: { type: String },
    verificationExpires: { type: Date },
    resetPasswordToken: { type: String },
})

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
export default User
