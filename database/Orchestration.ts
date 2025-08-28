import mongoose, { Document, Schema } from "mongoose"

export interface PlatformPrompts {
    systemPrompt: string
    userPrompt: string
    imagePrompt?: string
}

export interface IOrchestration extends Document<Schema.Types.ObjectId> {
    type: string
    main: PlatformPrompts
    linkedin: PlatformPrompts
    x: PlatformPrompts
    meta: PlatformPrompts
    updatedAt: Date
    createdAt: Date
}

const PlatformPromptsSchema = new mongoose.Schema({
    systemPrompt: {
        type: String,
        default: "",
    },
    userPrompt: {
        type: String,
        default: "",
    },
    imagePrompt: {
        type: String,
        default: "",
    },
}, { _id: false })

const OrchestrationSchema = new mongoose.Schema<IOrchestration>({
    type: {
        type: String,
        required: true,
        enum: ["content"], // Can be extended in the future
        default: "content",
    },
    main: {
        type: PlatformPromptsSchema,
        default: () => ({
            systemPrompt: "",
            userPrompt: "",
            imagePrompt: "",
        }),
    },
    linkedin: {
        type: PlatformPromptsSchema,
        default: () => ({
            systemPrompt: "",
            userPrompt: "",
            imagePrompt: "",
        }),
    },
    x: {
        type: PlatformPromptsSchema,
        default: () => ({
            systemPrompt: "",
            userPrompt: "",
            imagePrompt: "",
        }),
    },
    meta: {
        type: PlatformPromptsSchema,
        default: () => ({
            systemPrompt: "",
            userPrompt: "",
            imagePrompt: "",
        }),
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
})

// Update lastUpdated on save
OrchestrationSchema.pre<IOrchestration>("save", function (next) {
    this.updatedAt = new Date()
    next()
})

const Orchestration =
    mongoose.models.Orchestration ||
    mongoose.model<IOrchestration>("Orchestration", OrchestrationSchema)

export default Orchestration
