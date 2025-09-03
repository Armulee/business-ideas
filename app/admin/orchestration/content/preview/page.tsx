"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import axios from "axios"
import PreviewHeader from "@/components/admin/orchestration/content/preview/preview-header"
import PreviewActionButtons from "@/components/admin/orchestration/content/preview/preview-action-buttons"
import MainContentCard from "@/components/admin/orchestration/content/preview/main-content-card"
import PlatformContentCard from "@/components/admin/orchestration/content/preview/platform-content-card"
import SharedImageManagement from "@/components/admin/orchestration/content/preview/shared-image-management"
import ErrorState from "@/components/admin/orchestration/content/preview/error-state"
import AdminLoading from "@/components/admin/loading"
import RegenerateDialog from "@/components/admin/orchestration/content/preview/regenerate-dialog"
import { GeneratedContent } from "@/components/admin/orchestration/content/types"

export default function OrchestrationPreviewPage() {
    const router = useRouter()
    const [content, setContent] = useState<GeneratedContent | null>(null)
    const [, setOriginalContent] = useState<GeneratedContent | null>(null)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [postingStates, setPostingStates] = useState<Record<string, boolean>>(
        {}
    )
    const [deletingContent, setDeletingContent] = useState(false)
    const [postingAll, setPostingAll] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)
    const [deletingImage, setDeletingImage] = useState(false)
    const [platformUploading, setPlatformUploading] = useState<
        Record<string, boolean>
    >({})
    const [platformDeleting, setPlatformDeleting] = useState<
        Record<string, boolean>
    >({})
    const [regenerating, setRegenerating] = useState<Record<string, boolean>>(
        {}
    )
    const [regeneratingAll, setRegeneratingAll] = useState(false)
    const [regenerateDialogOpen, setRegenerateDialogOpen] = useState(false)

    useEffect(() => {
        fetchGeneratedContent()
    }, [])

    const fetchGeneratedContent = async () => {
        try {
            setLoading(true)
            const response = await axios.get(
                "/api/orchestration/content/generated"
            )

            if (response.data.exists) {
                setContent(response.data.content)
                setOriginalContent(response.data.content)
                setHasUnsavedChanges(false)
            } else {
                setError("No generated content found or content has expired")
            }
        } catch (error) {
            console.error("Failed to fetch generated content:", error)
            setError("Failed to load generated content")
            toast.error("Failed to load generated content")
        } finally {
            setLoading(false)
        }
    }

    const handleContentChange = (platform: string, newContent: string) => {
        setContent((prevContent) => {
            if (!prevContent) return null

            const updatedContent = { ...prevContent }

            switch (platform) {
                case "main":
                    updatedContent.main = newContent
                    break
                case "linkedin":
                    updatedContent.linkedin = newContent
                    break
                case "x":
                    updatedContent.x = newContent
                    break
                case "meta":
                    updatedContent.meta = newContent
                    break
            }

            return updatedContent
        })

        setHasUnsavedChanges(true)
    }

    const handleSave = async () => {
        if (!content || !hasUnsavedChanges) return

        try {
            setSaving(true)
            await axios.put("/api/orchestration/content/generated", {
                main: content.main,
                linkedin: content.linkedin,
                linkedinImage: content.linkedinImage,
                x: content.x,
                xImage: content.xImage,
                meta: content.meta,
                metaImage: content.metaImage,
                mainImagePrompt: content.mainImagePrompt,
                linkedinImagePrompt: content.linkedinImagePrompt,
                xImagePrompt: content.xImagePrompt,
                metaImagePrompt: content.metaImagePrompt,
            })

            setOriginalContent(content)
            setHasUnsavedChanges(false)
            toast.success("Content saved successfully!")
        } catch (error) {
            console.error("Failed to save content to database:", error)
            toast.error("Failed to save content")
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteContent = async () => {
        if (
            !confirm("Are you sure you want to delete this generated content?")
        ) {
            return
        }

        try {
            setDeletingContent(true)
            await axios.delete("/api/orchestration/content/generated")
            toast.success("Content deleted successfully")
            router.push("/admin/orchestration/content")
        } catch (error) {
            console.error("Failed to delete content:", error)
            toast.error("Failed to delete content")
        } finally {
            setDeletingContent(false)
        }
    }

    const handlePostToPlatform = async (platform: string) => {
        setPostingStates((prev) => ({ ...prev, [platform]: true }))

        try {
            let contentToPost = ""
            let imageToPost = ""

            switch (platform) {
                case "linkedin":
                    contentToPost = content?.linkedin || ""
                    imageToPost = getImageForPosting(platform)
                    break
                case "x":
                    contentToPost = content?.x || ""
                    imageToPost = getImageForPosting(platform)
                    break
                case "meta":
                    contentToPost = content?.meta || ""
                    imageToPost = getImageForPosting(platform)
                    break
                default:
                    throw new Error("Invalid platform")
            }

            const response = await axios.post(
                "/api/orchestration/content/generated/post-to-media",
                {
                    platform: platform,
                    content: contentToPost,
                    image: imageToPost,
                }
            )

            if (response.data.success) {
                toast.success(
                    `Successfully posted to ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`
                )

                // Remove the platform content after successful posting
                setContent((prevContent) => {
                    if (!prevContent) return null
                    const updatedContent = { ...prevContent }

                    switch (platform) {
                        case "linkedin":
                            delete updatedContent.linkedin
                            delete updatedContent.linkedinImage
                            break
                        case "x":
                            delete updatedContent.x
                            delete updatedContent.xImage
                            break
                        case "meta":
                            delete updatedContent.meta
                            delete updatedContent.metaImage
                            break
                    }

                    return updatedContent
                })
            } else {
                throw new Error(response.data.message || "Failed to post")
            }
        } catch (error) {
            console.error(`Failed to post to ${platform}:`, error)
            toast.error(
                `Failed to post to ${platform.charAt(0).toUpperCase() + platform.slice(1)}`
            )
        } finally {
            setPostingStates((prev) => ({ ...prev, [platform]: false }))
        }
    }

    const handlePostAll = async () => {
        setPostingAll(true)

        const platforms = ["linkedin", "x", "meta"].filter((platform) => {
            switch (platform) {
                case "linkedin":
                    return content?.linkedin
                case "x":
                    return content?.x
                case "meta":
                    return content?.meta
                default:
                    return false
            }
        })

        let successCount = 0
        let failureCount = 0

        for (const platform of platforms) {
            try {
                setPostingStates((prev) => ({ ...prev, [platform]: true }))

                let contentToPost = ""
                let imageToPost = ""

                switch (platform) {
                    case "linkedin":
                        contentToPost = content?.linkedin || ""
                        imageToPost = getImageForPosting(platform)
                        break
                    case "x":
                        contentToPost = content?.x || ""
                        imageToPost = getImageForPosting(platform)
                        break
                    case "meta":
                        contentToPost = content?.meta || ""
                        imageToPost = getImageForPosting(platform)
                        break
                }

                const response = await axios.post(
                    "/api/orchestration/content/generated/post-to-media",
                    {
                        platform: platform,
                        content: contentToPost,
                        image: imageToPost,
                    }
                )

                if (response.data.success) {
                    successCount++

                    // Remove the platform content after successful posting
                    setContent((prevContent) => {
                        if (!prevContent) return null
                        const updatedContent = { ...prevContent }

                        switch (platform) {
                            case "linkedin":
                                delete updatedContent.linkedin
                                delete updatedContent.linkedinImage
                                break
                            case "x":
                                delete updatedContent.x
                                delete updatedContent.xImage
                                break
                            case "meta":
                                delete updatedContent.meta
                                delete updatedContent.metaImage
                                break
                        }

                        return updatedContent
                    })
                } else {
                    failureCount++
                }
            } catch (error) {
                console.error(`Failed to post to ${platform}:`, error)
                failureCount++
            } finally {
                setPostingStates((prev) => ({ ...prev, [platform]: false }))
            }
        }

        // Show summary toast
        if (successCount > 0 && failureCount === 0) {
            toast.success(
                `Successfully posted to all ${successCount} platforms!`
            )
        } else if (successCount > 0 && failureCount > 0) {
            toast.warning(
                `Posted to ${successCount} platforms, ${failureCount} failed`
            )
        } else if (failureCount > 0) {
            toast.error(`Failed to post to all ${failureCount} platforms`)
        }

        setPostingAll(false)
    }

    const handleImageUpload = async (
        file: File,
        platform: string = "shared"
    ) => {
        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file")
            return
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error("Image size must be less than 10MB")
            return
        }

        try {
            if (platform === "shared") {
                setUploadingImage(true)
            } else {
                setPlatformUploading((prev) => ({ ...prev, [platform]: true }))
            }

            // Create FormData for file upload
            const formData = new FormData()
            formData.append("image", file)
            formData.append("platform", platform)

            // Upload to orchestration image endpoint
            const response = await axios.post(
                "/api/orchestration/content/generated/upload",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            )

            if (response.data.success) {
                // Update content with new image
                setContent((prevContent) => {
                    if (!prevContent) return null

                    const updatedContent = { ...prevContent }

                    if (platform === "shared") {
                        updatedContent.sharedImage = response.data.url
                        updatedContent.sharedImageId = response.data.publicId

                        // Update all platform images with shared image
                        updatedContent.linkedinImage = response.data.url
                        updatedContent.linkedinImageId = response.data.publicId
                        updatedContent.xImage = response.data.url
                        updatedContent.xImageId = response.data.publicId
                        updatedContent.metaImage = response.data.url
                        updatedContent.metaImageId = response.data.publicId
                    } else {
                        // Update specific platform
                        switch (platform) {
                            case "linkedin":
                                updatedContent.linkedinImage = response.data.url
                                updatedContent.linkedinImageId =
                                    response.data.publicId
                                break
                            case "x":
                                updatedContent.xImage = response.data.url
                                updatedContent.xImageId = response.data.publicId
                                break
                            case "meta":
                                updatedContent.metaImage = response.data.url
                                updatedContent.metaImageId =
                                    response.data.publicId
                                break
                        }
                    }

                    return updatedContent
                })
                toast.success(
                    `Image uploaded successfully for ${platform === "shared" ? "all platforms" : platform}!`
                )
            } else {
                throw new Error(response.data.message || "Upload failed")
            }
        } catch (error) {
            console.error("Image upload error:", error)
            toast.error("Failed to upload image")
        } finally {
            if (platform === "shared") {
                setUploadingImage(false)
            } else {
                setPlatformUploading((prev) => ({ ...prev, [platform]: false }))
            }
        }
    }

    const handleImageDelete = async (platform: string = "shared") => {
        if (
            !confirm(
                `Are you sure you want to delete this ${platform === "shared" ? "shared" : platform} image?`
            )
        ) {
            return
        }

        try {
            if (platform === "shared") {
                setDeletingImage(true)
            } else {
                setPlatformDeleting((prev) => ({ ...prev, [platform]: true }))
            }

            // Get the publicId for deletion
            let publicId = ""
            switch (platform) {
                case "shared":
                    publicId = content?.sharedImageId || ""
                    break
                case "linkedin":
                    publicId = content?.linkedinImageId || ""
                    break
                case "x":
                    publicId = content?.xImageId || ""
                    break
                case "meta":
                    publicId = content?.metaImageId || ""
                    break
            }

            // Delete from Cloudinary if we have a publicId
            if (publicId) {
                try {
                    await axios.delete(
                        "/api/orchestration/content/generated/upload",
                        {
                            data: { publicId },
                        }
                    )
                } catch (deleteError) {
                    console.warn(
                        "Failed to delete from Cloudinary:",
                        deleteError
                    )
                    // Continue with local deletion even if Cloudinary fails
                }
            }

            // Remove image from content state
            setContent((prevContent) => {
                if (!prevContent) return null
                const updatedContent = { ...prevContent }

                if (platform === "shared") {
                    delete updatedContent.sharedImage
                    delete updatedContent.sharedImageId
                    // Also clear all platform images when deleting shared image
                    delete updatedContent.linkedinImage
                    delete updatedContent.linkedinImageId
                    delete updatedContent.xImage
                    delete updatedContent.xImageId
                    delete updatedContent.metaImage
                    delete updatedContent.metaImageId
                } else {
                    // Delete specific platform image
                    switch (platform) {
                        case "linkedin":
                            delete updatedContent.linkedinImage
                            delete updatedContent.linkedinImageId
                            break
                        case "x":
                            delete updatedContent.xImage
                            delete updatedContent.xImageId
                            break
                        case "meta":
                            delete updatedContent.metaImage
                            delete updatedContent.metaImageId
                            break
                    }
                }

                return updatedContent
            })

            toast.success(
                `${platform === "shared" ? "Shared image" : platform + " image"} deleted successfully!`
            )
        } catch (error) {
            console.error("Image deletion error:", error)
            toast.error("Failed to delete image")
        } finally {
            if (platform === "shared") {
                setDeletingImage(false)
            } else {
                setPlatformDeleting((prev) => ({ ...prev, [platform]: false }))
            }
        }
    }

    // Get the image to use for posting (shared image or platform-specific image)
    const getImageForPosting = (platform: string): string => {
        switch (platform) {
            case "linkedin":
                return content?.linkedinImage || ""
            case "x":
                return content?.xImage || ""
            case "meta":
                return content?.metaImage || ""
            default:
                return ""
        }
    }

    // Handle content regeneration with AI
    const handleRegenerate = async (platform: string, prompt: string) => {
        try {
            setRegenerating((prev) => ({ ...prev, [platform]: true }))

            // Call the AI API to regenerate content
            const response = await axios.post(
                "/api/orchestration/content/regenerate",
                {
                    platform,
                    prompt,
                    mainContent: content?.main || "",
                    currentContent:
                        content?.[platform as keyof GeneratedContent] || "",
                }
            )

            if (response.data.success) {
                // Update the content with the new generated content
                setContent((prevContent) => {
                    if (!prevContent) return null
                    return {
                        ...prevContent,
                        [platform]: response.data.content,
                    }
                })

                toast.success(`${platform} content regenerated successfully!`)
            } else {
                throw new Error(
                    response.data.message || "Failed to regenerate content"
                )
            }
        } catch (error) {
            console.error(`Failed to regenerate ${platform} content:`, error)
            toast.error(`Failed to regenerate ${platform} content`)
        } finally {
            setRegenerating((prev) => ({ ...prev, [platform]: false }))
        }
    }

    const handleRegenerateAll = async () => {
        try {
            setRegeneratingAll(true)
            setRegenerateDialogOpen(false)

            // Show toast with status
            toast.info(
                "Starting content regeneration... This may take a few minutes."
            )

            // Call the regenerate API
            const response = await axios.post(
                "/api/orchestration/content/regenerate/all"
            )

            if (response.data.success) {
                toast.success("Content regenerated successfully! Refreshing...")

                // Wait a moment then refresh the content
                setTimeout(() => {
                    fetchGeneratedContent()
                }, 2000)
            } else {
                throw new Error(
                    response.data.message || "Failed to regenerate content"
                )
            }
        } catch (error) {
            console.error("Failed to regenerate all content:", error)
            toast.error("Failed to regenerate content")
        } finally {
            setRegeneratingAll(false)
        }
    }

    if (loading || regeneratingAll) {
        return <AdminLoading size='lg' />
    }

    if (error || !content) {
        return <ErrorState error={error} />
    }

    return (
        <div className='py-8 space-y-6'>
            <div className='max-w-4xl mx-auto'>
                {/* Header */}
                <PreviewHeader
                    onRegenerate={() => setRegenerateDialogOpen(true)}
                    regenerating={regeneratingAll}
                    generatedAt={content.generatedAt}
                />

                {/* Action Buttons */}
                <PreviewActionButtons
                    hasUnsavedChanges={hasUnsavedChanges}
                    saving={saving}
                    postingAll={postingAll}
                    deletingContent={deletingContent}
                    onSave={handleSave}
                    onPostAll={handlePostAll}
                    onDeleteContent={handleDeleteContent}
                />

                <div className='space-y-6'>
                    {/* Main Content */}
                    {content.main && (
                        <MainContentCard
                            content={content.main}
                            onContentChange={(newContent) =>
                                handleContentChange("main", newContent)
                            }
                        />
                    )}

                    {/* LinkedIn Content */}
                    {content.linkedin && (
                        <PlatformContentCard
                            platform='linkedin'
                            content={content.linkedin}
                            image={content.linkedinImage}
                            postingState={postingStates.linkedin}
                            onContentChange={handleContentChange}
                            onPostToPlatform={handlePostToPlatform}
                            onImageUpload={handleImageUpload}
                            onImageDelete={handleImageDelete}
                            uploading={platformUploading.linkedin || false}
                            deleting={platformDeleting.linkedin || false}
                            mainContent={content.main}
                            onRegenerate={handleRegenerate}
                            regenerating={regenerating.linkedin || false}
                        />
                    )}

                    {/* X (Twitter) Content */}
                    {content.x && (
                        <PlatformContentCard
                            platform='x'
                            content={content.x}
                            image={content.xImage}
                            postingState={postingStates.x}
                            onContentChange={handleContentChange}
                            onPostToPlatform={handlePostToPlatform}
                            onImageUpload={handleImageUpload}
                            onImageDelete={handleImageDelete}
                            uploading={platformUploading.x || false}
                            deleting={platformDeleting.x || false}
                            mainContent={content.main}
                            onRegenerate={handleRegenerate}
                            regenerating={regenerating.x || false}
                        />
                    )}

                    {/* Meta Content */}
                    {content.meta && (
                        <PlatformContentCard
                            platform='meta'
                            content={content.meta}
                            image={content.metaImage}
                            postingState={postingStates.meta}
                            onContentChange={handleContentChange}
                            onPostToPlatform={handlePostToPlatform}
                            onImageUpload={handleImageUpload}
                            onImageDelete={handleImageDelete}
                            uploading={platformUploading.meta || false}
                            deleting={platformDeleting.meta || false}
                            mainContent={content.main}
                            onRegenerate={handleRegenerate}
                            regenerating={regenerating.meta || false}
                        />
                    )}
                </div>

                {/* Shared Image Management */}
                <SharedImageManagement
                    sharedImage={content.sharedImage}
                    uploading={uploadingImage}
                    deleting={deletingImage}
                    onImageUpload={handleImageUpload}
                    onImageDelete={handleImageDelete}
                />
            </div>

            {/* Regenerate Dialog */}
            <RegenerateDialog
                open={regenerateDialogOpen}
                onOpenChange={setRegenerateDialogOpen}
                onConfirm={handleRegenerateAll}
                loading={regeneratingAll}
            />
        </div>
    )
}
