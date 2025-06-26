import mongoose, { Document, Schema } from "mongoose"

export interface ICounter extends Document<Schema.Types.ObjectId> {
    name: string
    count: number
}

const CounterSchema = new Schema<ICounter>({
    name: { type: String, required: true, unique: true }, // 'postId' or 'userId'
    count: { type: Number, default: 0 },
})

const Counter =
    mongoose.models.Counter ||
    mongoose.model<ICounter>("Counter", CounterSchema)

export default Counter
