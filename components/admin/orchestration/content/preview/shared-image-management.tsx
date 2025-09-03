"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ImageIcon, Upload, X } from "lucide-react"

interface SharedImageManagementProps {
    sharedImage?: string
    uploading: boolean
    deleting: boolean
    onImageUpload: (file: File, platform: string) => Promise<void>
    onImageDelete: (platform: string) => Promise<void>
}

export default function SharedImageManagement({
    sharedImage,
    uploading,
    deleting,
    onImageUpload,
    onImageDelete,
}: SharedImageManagementProps) {
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
            await onImageUpload(imageFile, "shared")
        }
    }

    const handleFileInputChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0]
        if (file) {
            await onImageUpload(file, "shared")
            event.target.value = ""
        }
    }

    return (
        <Card className='glassmorphism bg-gray-900/50 border-gray-700 mt-6'>
            <CardHeader>
                <CardTitle className='text-white flex items-center gap-2'>
                    <ImageIcon className='w-5 h-5 text-purple-500' />
                    Shared Image for All Platforms
                </CardTitle>
                <p className='text-white/60 text-sm'>
                    Upload an image to use across all social media platforms.
                    This will override platform-specific images.
                </p>
            </CardHeader>
            <CardContent className='space-y-4'>
                {/* Display current image */}
                <div
                    className={`border-2 border-dashed rounded-lg transition-all duration-200 ${
                        draggedOver
                            ? "border-purple-500 bg-purple-500/10"
                            : "border-gray-600 hover:border-gray-500"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {sharedImage ? (
                        <div className='space-y-4 p-4'>
                            <Label className='text-white text-sm font-medium'>
                                Current Shared Image:
                            </Label>
                            <div className='relative group'>
                                <Image
                                    src={sharedImage}
                                    alt='Shared image for all platforms'
                                    width={400}
                                    height={400}
                                    className='w-full max-w-md mx-auto rounded-lg border border-gray-600'
                                />
                                <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2'>
                                    <Button
                                        onClick={() =>
                                            document
                                                .getElementById("image-upload")
                                                ?.click()
                                        }
                                        disabled={uploading}
                                        className='button'
                                        size='sm'
                                    >
                                        <Upload className='w-4 h-4 mr-2' />
                                        {uploading ? "Uploading..." : "Replace"}
                                    </Button>
                                    <Button
                                        onClick={() => onImageDelete("shared")}
                                        disabled={deleting}
                                        variant='destructive'
                                        size='sm'
                                    >
                                        <X className='w-4 h-4 mr-2' />
                                        {deleting ? "Deleting..." : "Delete"}
                                    </Button>
                                </div>
                            </div>
                            <div className='text-center text-white/60 text-sm'>
                                This image will be used for all social media
                                platforms
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
                                            .getElementById("image-upload")
                                            ?.click()
                                    }
                                    disabled={uploading}
                                    className='button'
                                >
                                    <Upload className='w-4 h-4 mr-2' />
                                    {uploading
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
                    onChange={handleFileInputChange}
                    className='hidden'
                />
            </CardContent>
        </Card>
    )
}
