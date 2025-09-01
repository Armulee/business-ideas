import mongoose, { Document, Schema } from "mongoose"

export interface MainPlatformPrompts {
    purpose: string
    systemPrompt: string
    userPrompt: string
    imagePrompt?: string
}

export interface SocialPlatformPrompts {
    purpose?: string
    systemPrompt: string
    userPrompt: string
}

export interface IContentOrchestration extends Document<Schema.Types.ObjectId> {
    type: string
    main: MainPlatformPrompts
    linkedin: SocialPlatformPrompts
    x: SocialPlatformPrompts
    meta: SocialPlatformPrompts
    // Generated content fields
    generatedMain?: string
    generatedLinkedin?: string
    generatedLinkedinImage?: string
    generatedX?: string
    generatedXImage?: string
    generatedMeta?: string
    generatedMetaImage?: string
    // Generated image prompts for all platforms
    generatedMainImagePrompt?: string
    generatedLinkedinImagePrompt?: string
    generatedXImagePrompt?: string
    generatedMetaImagePrompt?: string
    generatedAt?: Date
    contentExpiresAt?: Date
    updatedAt: Date
    createdAt: Date
}

const MainPlatformPromptsSchema = new mongoose.Schema({
    purpose: {
        type: String,
        default: "Introduction",
    },
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

const SocialPlatformPromptsSchema = new mongoose.Schema({
    systemPrompt: {
        type: String,
        default: "",
    },
    userPrompt: {
        type: String,
        default: "",
    },
}, { _id: false })

const ContentOrchestrationSchema = new mongoose.Schema<IContentOrchestration>({
    type: {
        type: String,
        required: true,
        enum: ["prompts", "content"],
        default: "prompts",
    },
    main: {
        type: MainPlatformPromptsSchema,
        default: () => ({
            purpose: "Introduction",
            systemPrompt: "",
            userPrompt: "",
            imagePrompt: "",
        }),
    },
    linkedin: {
        type: SocialPlatformPromptsSchema,
        default: () => ({
            systemPrompt: "",
            userPrompt: "",
        }),
    },
    x: {
        type: SocialPlatformPromptsSchema,
        default: () => ({
            systemPrompt: "",
            userPrompt: "",
        }),
    },
    meta: {
        type: SocialPlatformPromptsSchema,
        default: () => ({
            systemPrompt: "",
            userPrompt: "",
        }),
    },
    // Generated content fields
    generatedMain: {
        type: String,
    },
    generatedLinkedin: {
        type: String,
    },
    generatedLinkedinImage: {
        type: String,
    },
    generatedX: {
        type: String,
    },
    generatedXImage: {
        type: String,
    },
    generatedMeta: {
        type: String,
    },
    generatedMetaImage: {
        type: String,
    },
    // Generated image prompts for all platforms
    generatedMainImagePrompt: {
        type: String,
    },
    generatedLinkedinImagePrompt: {
        type: String,
    },
    generatedXImagePrompt: {
        type: String,
    },
    generatedMetaImagePrompt: {
        type: String,
    },
    generatedAt: {
        type: Date,
    },
    contentExpiresAt: {
        type: Date,
        index: { expireAfterSeconds: 0 }, // Auto-delete generated content when expired
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
ContentOrchestrationSchema.pre<IContentOrchestration>("save", function (next) {
    this.updatedAt = new Date()
    next()
})


const ContentOrchestration =
    mongoose.models.ContentOrchestration ||
    mongoose.model<IContentOrchestration>("ContentOrchestration", ContentOrchestrationSchema)

export default ContentOrchestration