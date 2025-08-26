"use client"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { FaMeta } from "react-icons/fa6"
import Image from "next/image"

interface PlatformContent {
    content?: string
    text?: string
    image_required?: boolean
    image_brief?: string
}

interface MetaContentProps {
    content?: string | PlatformContent
    image?: string
}

export default function MetaContent({ content, image }: MetaContentProps) {
    if (!content) return null

    // Handle string content
    if (typeof content === 'string') {
        return (
            <Card className='bg-gray-800/50 border-gray-700'>
                <CardHeader className='pb-3'>
                    <CardTitle className='text-white text-sm flex items-center gap-2'>
                        <FaMeta className='w-4 h-4 text-blue-500' />
                        Meta (Facebook) Content
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='text-gray-300 text-sm whitespace-pre-wrap break-words'>
                        {content}
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Handle object content (refined)
    return (
        <Card className='bg-gray-800/50 border-gray-700'>
            <CardHeader className='pb-3'>
                <CardTitle className='text-white text-sm flex items-center gap-2'>
                    <FaMeta className='w-4 h-4 text-blue-500' />
                    Meta (Facebook/Instagram) Content (Refined)
                    {image && (
                        <span className='ml-auto text-xs text-green-400'>
                            🖼️ Image Generated
                        </span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
                {/* Content Box */}
                <div className='space-y-2'>
                    <h4 className='text-white text-xs font-medium'>
                        Content:
                    </h4>
                    <Card className='bg-gray-700/50 border-gray-600'>
                        <CardContent className='p-3'>
                            <div className='text-gray-300 text-sm whitespace-pre-wrap break-words'>
                                {content.content || content.text || "No content"}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Image Required Box */}
                <div className='space-y-2'>
                    <h4 className='text-white text-xs font-medium'>
                        Image Required:
                    </h4>
                    <Card className='bg-gray-700/50 border-gray-600'>
                        <CardContent className='p-3'>
                            <div
                                className={`text-sm font-medium ${
                                    content.image_required
                                        ? "text-green-400"
                                        : "text-gray-400"
                                }`}
                            >
                                {content.image_required ? "true" : "false"}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Image Brief Box */}
                <div className='space-y-2'>
                    <h4 className='text-white text-xs font-medium'>
                        Image Brief:
                    </h4>
                    <Card className='bg-gray-700/50 border-gray-600'>
                        <CardContent className='p-3'>
                            <div className='text-gray-300 text-sm whitespace-pre-wrap break-words'>
                                {content.image_brief || "null"}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Generated Image Display */}
                {image && (
                    <div className='mt-6 space-y-2'>
                        <h4 className='text-white text-xs font-medium'>
                            Generated Image:
                        </h4>
                        <Card className='bg-gray-700/50 border-gray-600'>
                            <CardContent className='p-3'>
                                <Image
                                    src={image}
                                    alt='Generated Meta (Facebook/Instagram) Image'
                                    width={512}
                                    height={512}
                                    className='w-full max-w-md mx-auto rounded-lg shadow-lg'
                                    onError={(e) => {
                                        console.error(
                                            "Failed to load image:",
                                            image
                                        )
                                        e.currentTarget.style.display = "none"
                                    }}
                                />
                                <p className='text-xs text-gray-500 text-center mt-2'>
                                    Generated by Leonardo AI (Lucid Origin)
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}