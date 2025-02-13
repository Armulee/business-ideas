import mongoose from "mongoose"

export interface Category {
    id: number
    name: string
}

const CategorySchema = new mongoose.Schema<Category>({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, unique: true },
})

const Category =
    mongoose.models.Category ||
    mongoose.model<Category>("Category", CategorySchema)
export default Category
