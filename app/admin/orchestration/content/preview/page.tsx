"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import axios from "axios"
import { FaLinkedin, FaMeta, FaXTwitter } from "react-icons/fa6"
import { Flame, ArrowLeft, Calendar, Clock } from "lucide-react"

interface GeneratedContent {
    main?: string
    linkedin?: string
    linkedinImage?: string
    x?: string
    xImage?: string
    meta?: string
    metaImage?: string
    generatedAt?: string
}

export default function OrchestrationPreviewPage() {
    const [content, setContent] = useState<GeneratedContent | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)


    useEffect(() => {
        fetchGeneratedContent()
    }, [])

    const fetchGeneratedContent = async () => {
        try {
            setLoading(true)
            const response = await axios.get("/api/orchestration/content/generated")
            
            if (response.data.exists) {
                setContent(response.data.content)
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

    if (loading) {
        return (
            <div className="py-8 space-y-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/admin/orchestration/content">
                            <Button variant="outline" size="sm" className="glassmorphism border-white/20">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Orchestration
                            </Button>
                        </Link>
                        <h1 className="text-white text-2xl font-bold">Generated Content Preview</h1>
                    </div>
                    
                    <div className="flex items-center justify-center min-h-96">
                        <div className="text-white text-lg">Loading generated content...</div>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !content) {
        return (
            <div className="py-8 space-y-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/admin/orchestration/content">
                            <Button variant="outline" size="sm" className="glassmorphism border-white/20">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Orchestration
                            </Button>
                        </Link>
                        <h1 className="text-white text-2xl font-bold">Generated Content Preview</h1>
                    </div>
                    
                    <Card className="glassmorphism bg-red-900/20 border-red-500/30">
                        <CardContent className="p-8 text-center">
                            <div className="text-red-400 text-lg mb-4">
                                {error || "No content available"}
                            </div>
                            <p className="text-white/60 mb-6">
                                Content may have expired or hasn&apos;t been generated yet. 
                                Please generate new content from the orchestration page.
                            </p>
                            <Link href="/admin/orchestration/content">
                                <Button className="bg-blue-600 hover:bg-blue-700">
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
        <div className="py-8 space-y-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/admin/orchestration/content">
                        <Button variant="outline" size="sm" className="glassmorphism border-white/20">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Orchestration
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-white text-2xl font-bold">Generated Content Preview</h1>
                        {content.generatedAt && (
                            <div className="flex items-center gap-4 text-white/60 text-sm mt-2">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    Generated on {formatDate(content.generatedAt)}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    Expires at 8:00 PM today
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Main Content */}
                    {content.main && (
                        <Card className="glassmorphism bg-gray-900/50 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Flame className="w-5 h-5 text-orange-500" />
                                    Main Platform Content
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-white whitespace-pre-wrap bg-gray-800/30 p-4 rounded-lg">
                                    {content.main}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* LinkedIn Content */}
                    {content.linkedin && (
                        <Card className="glassmorphism bg-gray-900/50 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <FaLinkedin className="w-5 h-5 text-blue-500" />
                                    LinkedIn Content
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-white whitespace-pre-wrap bg-gray-800/30 p-4 rounded-lg">
                                    {content.linkedin}
                                </div>
                                {content.linkedinImage && (
                                    <div className="space-y-2">
                                        <Label className="text-white text-sm font-medium">
                                            Generated Image:
                                        </Label>
                                        <Image
                                            src={content.linkedinImage}
                                            alt="LinkedIn generated image"
                                            width={400}
                                            height={400}
                                            className="w-full max-w-md mx-auto rounded-lg"
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* X (Twitter) Content */}
                    {content.x && (
                        <Card className="glassmorphism bg-gray-900/50 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <FaXTwitter className="w-5 h-5 text-white" />
                                    X (Twitter) Content
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-white whitespace-pre-wrap bg-gray-800/30 p-4 rounded-lg">
                                    {content.x}
                                </div>
                                {content.xImage && (
                                    <div className="space-y-2">
                                        <Label className="text-white text-sm font-medium">
                                            Generated Image:
                                        </Label>
                                        <Image
                                            src={content.xImage}
                                            alt="X generated image"
                                            width={400}
                                            height={400}
                                            className="w-full max-w-md mx-auto rounded-lg"
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Meta Content */}
                    {content.meta && (
                        <Card className="glassmorphism bg-gray-900/50 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <FaMeta className="w-5 h-5 text-blue-500" />
                                    Meta (Facebook) Content
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-white whitespace-pre-wrap bg-gray-800/30 p-4 rounded-lg">
                                    {content.meta}
                                </div>
                                {content.metaImage && (
                                    <div className="space-y-2">
                                        <Label className="text-white text-sm font-medium">
                                            Generated Image:
                                        </Label>
                                        <Image
                                            src={content.metaImage}
                                            alt="Meta generated image"
                                            width={400}
                                            height={400}
                                            className="w-full max-w-md mx-auto rounded-lg"
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Refresh Button */}
                <div className="flex justify-center pt-6">
                    <Button 
                        onClick={fetchGeneratedContent}
                        variant="outline"
                        className="glassmorphism border-white/20"
                    >
                        Refresh Content
                    </Button>
                </div>
            </div>
        </div>
    )
}