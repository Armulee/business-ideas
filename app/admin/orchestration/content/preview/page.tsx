"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import axios from "axios"
import { FaLinkedin, FaMeta, FaXTwitter } from "react-icons/fa6"
import {
    Flame,
    ArrowLeft,
    Calendar,
    Clock,
    Send,
    Trash2,
    SendHorizontal,
    Upload,
    X,
    ImageIcon,
    RefreshCw,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import AutoHeightTextarea from "@/components/ui/auto-height-textarea"

interface GeneratedContent {
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
    const [draggedOver, setDraggedOver] = useState<string | null>(null)

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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString()
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
        
        // Mark as having unsaved changes
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
            
            // Update original content and reset unsaved changes
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

            // Make API call to post to the platform
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

    const handleFileInputChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
        platform: string = "shared"
    ) => {
        const file = event.target.files?.[0]
        if (file) {
            await handleImageUpload(file, platform)
            // Reset input value
            event.target.value = ""
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

    // Drag and drop handlers
    const handleDragOver = (e: React.DragEvent, platform: string) => {
        e.preventDefault()
        setDraggedOver(platform)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setDraggedOver(null)
    }

    const handleDrop = async (e: React.DragEvent, platform: string) => {
        e.preventDefault()
        setDraggedOver(null)

        const files = Array.from(e.dataTransfer.files)
        const imageFile = files.find((file) => file.type.startsWith("image/"))

        if (imageFile) {
            await handleImageUpload(imageFile, platform)
        } else {
            toast.error("Please drop an image file")
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

    // Component for individual platform image management
    const PlatformImageSection = ({
        platform,
        image,
        platformName,
        icon: Icon,
        iconColor,
    }: {
        platform: string
        image?: string
        platformName: string
        icon: React.ComponentType<{ className?: string }>
        iconColor: string
    }) => (
        <div className='space-y-3 pt-4 border-t border-gray-600'>
            <div className='flex items-center gap-2'>
                <Icon className={`w-4 h-4 ${iconColor}`} />
                <Label className='text-white text-sm font-medium'>
                    {platformName} Image
                </Label>
            </div>

            {/* Image display or dropzone */}
            <div
                className={`relative border-2 border-dashed rounded-lg transition-all duration-200 ${
                    draggedOver === platform
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-gray-600 hover:border-gray-500"
                }`}
                onDragOver={(e) => handleDragOver(e, platform)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, platform)}
            >
                {image ? (
                    <div className='relative group'>
                        <Image
                            src={image}
                            alt={`${platformName} image`}
                            width={300}
                            height={300}
                            className='w-full max-w-48 mx-auto rounded border border-gray-600'
                        />
                        <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-2'>
                            <Button
                                onClick={() =>
                                    document
                                        .getElementById(
                                            `image-upload-${platform}`
                                        )
                                        ?.click()
                                }
                                disabled={platformUploading[platform]}
                                className='button'
                                size='sm'
                            >
                                <Upload className='w-3 h-3 mr-1' />
                                {platformUploading[platform] ? "Uploading..." : "Replace"}
                            </Button>
                            <Button
                                onClick={() => handleImageDelete(platform)}
                                disabled={platformDeleting[platform]}
                                variant='destructive'
                                size='sm'
                            >
                                <X className='w-3 h-3 mr-1' />
                                {platformDeleting[platform] ? "Deleting..." : "Delete"}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className='p-6 text-center'>
                        <div className='flex flex-col items-center gap-3'>
                            <div className='w-12 h-12 rounded-full bg-gray-800/50 flex items-center justify-center'>
                                <Icon className={`w-6 h-6 ${iconColor}`} />
                            </div>
                            <div className='space-y-1'>
                                <p className='text-white/60 text-sm'>
                                    No {platformName.toLowerCase()} image
                                </p>
                                <p className='text-white/40 text-xs'>
                                    Drag & drop or click to upload
                                </p>
                            </div>
                            <Button
                                onClick={() =>
                                    document
                                        .getElementById(`image-upload-${platform}`)
                                        ?.click()
                                }
                                disabled={platformUploading[platform]}
                                className='button'
                                size='sm'
                            >
                                <Upload className='w-3 h-3 mr-1' />
                                {platformUploading[platform] ? "Uploading..." : "Upload"}
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Hidden file input */}
            <Input
                id={`image-upload-${platform}`}
                type='file'
                accept='image/*'
                onChange={(e) => handleFileInputChange(e, platform)}
                className='hidden'
            />
        </div>
    )

    if (loading) {
        return (
            <div className='py-8 space-y-6'>
                <div className='max-w-4xl mx-auto'>
                    <div className='flex items-center gap-4 mb-8'>
                        <Link href='/admin/orchestration/content'>
                            <Button
                                variant='outline'
                                size='sm'
                                className='glassmorphism border-white/20'
                            >
                                <ArrowLeft className='w-4 h-4 mr-2' />
                                Back to Orchestration
                            </Button>
                        </Link>
                        <h1 className='text-white text-2xl font-bold'>
                            Generated Content Preview
                        </h1>
                    </div>

                    <div className='flex items-center justify-center min-h-96'>
                        <div className='text-white text-lg'>
                            Loading generated content...
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !content) {
        return (
            <div className='py-8 space-y-6'>
                <div className='max-w-4xl mx-auto'>
                    <div className='flex items-start gap-4 mb-8'>
                        <Link href='/admin/orchestration/content'>
                            <Button
                                variant='outline'
                                size='sm'
                                className='button'
                            >
                                <ArrowLeft className='w-4 h-4 mr-2' />
                                Back to Orchestration
                            </Button>
                        </Link>
                        <h1 className='text-white text-2xl font-bold'>
                            Generated Content Preview
                        </h1>
                    </div>

                    <Card className='glassmorphism bg-red-900/20 border-red-500/30'>
                        <CardContent className='p-8 text-center'>
                            <div className='text-red-400 text-lg mb-4'>
                                {error || "No content available"}
                            </div>
                            <p className='text-white/60 mb-6'>
                                Content may have expired or hasn&apos;t been
                                generated yet. Please generate new content from
                                the orchestration page.
                            </p>
                            <Link href='/admin/orchestration/content'>
                                <Button className='bg-blue-600 hover:bg-blue-700'>
                                    Go to Orchestration
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className='py-8 space-y-6'>
            <div className='max-w-4xl mx-auto'>
                {/* Header */}
                <div className='flex flex-col gap-4 mb-8'>
                    <div className='flex items-center justify-between'>
                        <Link href='/admin/orchestration/content'>
                            <Button
                                variant='outline'
                                size='sm'
                                className='button'
                            >
                                <ArrowLeft className='w-4 h-4 mr-2' />
                                Back to Orchestration
                            </Button>
                        </Link>
                        <button
                            onClick={fetchGeneratedContent}
                            className='flex items-center gap-2 text-white/60 hover:text-white transition-colors'
                        >
                            <RefreshCw className='w-4 h-4' />
                            <span className='text-sm'>Refresh</span>
                        </button>
                    </div>
                    <div className='w-full text-center'>
                        <h1 className='text-white text-2xl font-bold'>
                            Generated Content Preview
                        </h1>
                        {content.generatedAt && (
                            <div className='w-full flex flex-col gap-1 justify-center items-center text-white/60 text-sm mt-2'>
                                <div className='flex items-center gap-1 mb-1'>
                                    <Calendar className='w-4 h-4' />
                                    Generated on{" "}
                                    {formatDate(content.generatedAt)}
                                </div>
                                <div className='flex items-center gap-1'>
                                    <Clock className='w-4 h-4' />
                                    Expires at 8:00 PM today
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className='flex justify-center gap-4 mb-6'>
                    <Button
                        onClick={hasUnsavedChanges ? handleSave : handlePostAll}
                        disabled={saving || postingAll || deletingContent}
                        className={hasUnsavedChanges 
                            ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700'
                        }
                    >
                        {hasUnsavedChanges ? (
                            <>
                                <Send className='w-4 h-4 mr-2' />
                                {saving ? "Saving..." : "Save Changes"}
                            </>
                        ) : (
                            <>
                                <SendHorizontal className='w-4 h-4 mr-2' />
                                {postingAll ? "Posting to All..." : "Post All"}
                            </>
                        )}
                    </Button>
                    <Button
                        onClick={handleDeleteContent}
                        disabled={deletingContent || postingAll || saving}
                        variant='destructive'
                        className='bg-red-600 hover:bg-red-700'
                    >
                        <Trash2 className='w-4 h-4 mr-2' />
                        {deletingContent ? "Deleting..." : "Delete Content"}
                    </Button>
                </div>

                <div className='space-y-6'>
                    {/* Main Content */}
                    {content.main && (
                        <Card className='glassmorphism bg-gray-900/50 border-gray-700'>
                            <CardHeader>
                                <CardTitle className='text-white flex items-center gap-2'>
                                    <Flame className='w-5 h-5 text-orange-500' />
                                    Main Platform Content
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <AutoHeightTextarea
                                    value={content.main || ""}
                                    onChange={(e) =>
                                        handleContentChange(
                                            "main",
                                            e.target.value
                                        )
                                    }
                                    className='input'
                                    placeholder='Main content...'
                                />
                            </CardContent>
                        </Card>
                    )}

                    {/* LinkedIn Content */}
                    {content.linkedin && (
                        <Card className='glassmorphism bg-gray-900/50 border-gray-700'>
                            <CardHeader>
                                <div className='flex items-center justify-between'>
                                    <CardTitle className='text-white flex items-center gap-2'>
                                        <FaLinkedin className='w-5 h-5 text-blue-500' />
                                        LinkedIn Content
                                    </CardTitle>
                                    <Button
                                        onClick={() =>
                                            handlePostToPlatform("linkedin")
                                        }
                                        disabled={postingStates.linkedin}
                                        className='bg-blue-600 hover:bg-blue-700'
                                        size='sm'
                                    >
                                        <Send className='w-4 h-4 mr-2' />
                                        {postingStates.linkedin
                                            ? "Posting..."
                                            : "Post to LinkedIn"}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <AutoHeightTextarea
                                    value={content.linkedin || ""}
                                    onChange={(e) =>
                                        handleContentChange(
                                            "linkedin",
                                            e.target.value
                                        )
                                    }
                                    className='input'
                                    placeholder='LinkedIn content...'
                                />
                                <PlatformImageSection
                                    platform='linkedin'
                                    image={content.linkedinImage}
                                    platformName='LinkedIn'
                                    icon={FaLinkedin}
                                    iconColor='text-blue-500'
                                />
                            </CardContent>
                        </Card>
                    )}

                    {/* X (Twitter) Content */}
                    {content.x && (
                        <Card className='glassmorphism bg-gray-900/50 border-gray-700'>
                            <CardHeader>
                                <div className='flex items-center justify-between'>
                                    <CardTitle className='text-white flex items-center gap-2'>
                                        <FaXTwitter className='w-5 h-5 text-white' />
                                        X (Twitter) Content
                                    </CardTitle>
                                    <Button
                                        onClick={() =>
                                            handlePostToPlatform("x")
                                        }
                                        disabled={postingStates.x}
                                        className='bg-blue-600 hover:bg-blue-700'
                                        size='sm'
                                    >
                                        <Send className='w-4 h-4 mr-2' />
                                        {postingStates.x
                                            ? "Posting..."
                                            : "Post to X"}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <AutoHeightTextarea
                                    value={content.x || ""}
                                    onChange={(e) =>
                                        handleContentChange("x", e.target.value)
                                    }
                                    className='input'
                                    placeholder='X (Twitter) content...'
                                />
                                <PlatformImageSection
                                    platform='x'
                                    image={content.xImage}
                                    platformName='X (Twitter)'
                                    icon={FaXTwitter}
                                    iconColor='text-white'
                                />
                            </CardContent>
                        </Card>
                    )}

                    {/* Meta Content */}
                    {content.meta && (
                        <Card className='glassmorphism bg-gray-900/50 border-gray-700'>
                            <CardHeader>
                                <div className='flex items-center justify-between'>
                                    <CardTitle className='text-white flex items-center gap-2'>
                                        <FaMeta className='w-5 h-5 text-blue-500' />
                                        Meta (Facebook) Content
                                    </CardTitle>
                                    <Button
                                        onClick={() =>
                                            handlePostToPlatform("meta")
                                        }
                                        disabled={postingStates.meta}
                                        className='bg-blue-600 hover:bg-blue-700'
                                        size='sm'
                                    >
                                        <Send className='w-4 h-4 mr-2' />
                                        {postingStates.meta
                                            ? "Posting..."
                                            : "Post to Meta"}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <AutoHeightTextarea
                                    value={content.meta || ""}
                                    onChange={(e) =>
                                        handleContentChange(
                                            "meta",
                                            e.target.value
                                        )
                                    }
                                    className='input'
                                    placeholder='Meta content...'
                                />
                                <PlatformImageSection
                                    platform='meta'
                                    image={content.metaImage}
                                    platformName='Meta (Facebook)'
                                    icon={FaMeta}
                                    iconColor='text-blue-500'
                                />
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Shared Image Management */}
                <Card className='glassmorphism bg-gray-900/50 border-gray-700 mt-6'>
                    <CardHeader>
                        <CardTitle className='text-white flex items-center gap-2'>
                            <ImageIcon className='w-5 h-5 text-purple-500' />
                            Shared Image for All Platforms
                        </CardTitle>
                        <p className='text-white/60 text-sm'>
                            Upload an image to use across all social media
                            platforms. This will override platform-specific
                            images.
                        </p>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        {/* Display current image */}
                        <div
                            className={`border-2 border-dashed rounded-lg transition-all duration-200 ${
                                draggedOver === "shared"
                                    ? "border-purple-500 bg-purple-500/10"
                                    : "border-gray-600 hover:border-gray-500"
                            }`}
                            onDragOver={(e) => handleDragOver(e, "shared")}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, "shared")}
                        >
                            {content?.sharedImage ? (
                                <div className='space-y-4 p-4'>
                                    <Label className='text-white text-sm font-medium'>
                                        Current Shared Image:
                                    </Label>
                                    <div className='relative group'>
                                        <Image
                                            src={content.sharedImage}
                                            alt='Shared image for all platforms'
                                            width={400}
                                            height={400}
                                            className='w-full max-w-md mx-auto rounded-lg border border-gray-600'
                                        />
                                        <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2'>
                                            <Button
                                                onClick={() =>
                                                    document
                                                        .getElementById(
                                                            "image-upload"
                                                        )
                                                        ?.click()
                                                }
                                                disabled={uploadingImage}
                                                className='button'
                                                size='sm'
                                            >
                                                <Upload className='w-4 h-4 mr-2' />
                                                {uploadingImage ? "Uploading..." : "Replace"}
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    handleImageDelete("shared")
                                                }
                                                disabled={deletingImage}
                                                variant='destructive'
                                                size='sm'
                                            >
                                                <X className='w-4 h-4 mr-2' />
                                                {deletingImage ? "Deleting..." : "Delete"}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className='text-center text-white/60 text-sm'>
                                        This image will be used for all social
                                        media platforms
                                    </div>
                                </div>
                            ) : (
                                <div className='text-center py-8'>
                                    <div className='flex flex-col items-center gap-4'>
                                        <div className='w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center'>
                                            <ImageIcon className='w-8 h-8 text-gray-400' />
                                        </div>
                                        <div className='space-y-2'>
                                            <p className='text-white/60 text-sm'>
                                                No shared image uploaded
                                            </p>
                                            <p className='text-white/40 text-xs'>
                                                Drag & drop or click to upload
                                            </p>
                                        </div>
                                        <Button
                                            onClick={() =>
                                                document
                                                    .getElementById(
                                                        "image-upload"
                                                    )
                                                    ?.click()
                                            }
                                            disabled={uploadingImage}
                                            className='button'
                                        >
                                            <Upload className='w-4 h-4 mr-2' />
                                            {uploadingImage
                                                ? "Uploading..."
                                                : "Upload Image"}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Hidden file input */}
                        <Input
                            id='image-upload'
                            type='file'
                            accept='image/*'
                            onChange={(e) => handleFileInputChange(e, "shared")}
                            className='hidden'
                        />

                        {/* Show current platform-specific images if available */}
                        {(content?.linkedinImage ||
                            content?.xImage ||
                            content?.metaImage) && (
                            <div className='space-y-3 pt-4 border-t border-gray-600'>
                                <Label className='text-white/60 text-sm'>
                                    Platform-specific images (will be overridden
                                    by shared image):
                                </Label>
                                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                    {content.linkedinImage && (
                                        <div className='space-y-2'>
                                            <div className='flex items-center gap-2'>
                                                <FaLinkedin className='w-4 h-4 text-blue-500' />
                                                <span className='text-white/60 text-xs'>
                                                    LinkedIn
                                                </span>
                                            </div>
                                            <Image
                                                src={content.linkedinImage}
                                                alt='LinkedIn image'
                                                width={200}
                                                height={200}
                                                className='w-full max-w-32 rounded border border-gray-600 opacity-60'
                                            />
                                        </div>
                                    )}
                                    {content.xImage && (
                                        <div className='space-y-2'>
                                            <div className='flex items-center gap-2'>
                                                <FaXTwitter className='w-4 h-4 text-white' />
                                                <span className='text-white/60 text-xs'>
                                                    X (Twitter)
                                                </span>
                                            </div>
                                            <Image
                                                src={content.xImage}
                                                alt='X image'
                                                width={200}
                                                height={200}
                                                className='w-full max-w-32 rounded border border-gray-600 opacity-60'
                                            />
                                        </div>
                                    )}
                                    {content.metaImage && (
                                        <div className='space-y-2'>
                                            <div className='flex items-center gap-2'>
                                                <FaMeta className='w-4 h-4 text-blue-500' />
                                                <span className='text-white/60 text-xs'>
                                                    Meta
                                                </span>
                                            </div>
                                            <Image
                                                src={content.metaImage}
                                                alt='Meta image'
                                                width={200}
                                                height={200}
                                                className='w-full max-w-32 rounded border border-gray-600 opacity-60'
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
