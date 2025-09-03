"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Upload, X } from "lucide-react"

interface PlatformImageSectionProps {
    platform: string
    image?: string
    platformName: string
    icon: React.ComponentType<{ className?: string }>
    iconColor: string
    onImageUpload: (file: File, platform: string) => Promise<void>
    onImageDelete: (platform: string) => Promise<void>
    uploading: boolean
    deleting: boolean
}

export function PlatformImageSection({
    platform,
    image,
    platformName,
    icon: Icon,
    iconColor,
    onImageUpload,
    onImageDelete,
    uploading,
    deleting,
}: PlatformImageSectionProps) {
    const [draggedOver, setDraggedOver] = useState(false)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setDraggedOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setDraggedOver(false)
    }

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        setDraggedOver(false)

        const files = Array.from(e.dataTransfer.files)
        const imageFile = files.find((file) => file.type.startsWith("image/"))

        if (imageFile) {
            await onImageUpload(imageFile, platform)
        }
    }

    const handleFileInputChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0]
        if (file) {
            await onImageUpload(file, platform)
            event.target.value = ""
        }
    }

    return (
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
                    draggedOver
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-gray-600 hover:border-gray-500"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
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
                                disabled={uploading}
                                className='button'
                                size='sm'
                            >
                                <Upload className='w-3 h-3 mr-1' />
                                {uploading ? "Uploading..." : "Replace"}
                            </Button>
                            <Button
                                onClick={() => onImageDelete(platform)}
                                disabled={deleting}
                                variant='destructive'
                                size='sm'
                            >
                                <X className='w-3 h-3 mr-1' />
                                {deleting ? "Deleting..." : "Delete"}
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
                                        .getElementById(
                                            `image-upload-${platform}`
                                        )
                                        ?.click()
                                }
                                disabled={uploading}
                                className='button'
                                size='sm'
                            >
                                <Upload className='w-3 h-3 mr-1' />
                                {uploading ? "Uploading..." : "Upload"}
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
                onChange={handleFileInputChange}
                className='hidden'
            />
        </div>
    )
}
