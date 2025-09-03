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
    imagePrompt?: string
}

export interface OrchestrationData {
    main: MainPlatformPrompts
    linkedin: SocialPlatformPrompts
    x: SocialPlatformPrompts
    meta: SocialPlatformPrompts
}

export interface GeneratedContent {
    main?: string
    linkedin?: string
    linkedinImage?: string
    linkedinImageId?: string
    x?: string
    xImage?: string
    xImageId?: string
    meta?: string
    metaImage?: string
    metaImageId?: string
    generatedAt?: string
    sharedImage?: string
    sharedImageId?: string
    mainImagePrompt?: string
    linkedinImagePrompt?: string
    xImagePrompt?: string
    metaImagePrompt?: string
}
