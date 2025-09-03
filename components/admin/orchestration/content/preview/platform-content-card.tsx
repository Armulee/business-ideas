"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AutoHeightTextarea from "@/components/ui/auto-height-textarea"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Send, RefreshCw, Sparkles, Loader2 } from "lucide-react"
import { FaLinkedin, FaMeta, FaXTwitter } from "react-icons/fa6"
import { PlatformImageSection } from "./platform-image-section"

interface PlatformContentCardProps {
    platform: string
    content: string
    image?: string
    postingState: boolean
    onContentChange: (platform: string, newContent: string) => void
    onPostToPlatform: (platform: string) => Promise<void>
    onImageUpload: (file: File, platform: string) => Promise<void>
    onImageDelete: (platform: string) => Promise<void>
    uploading: boolean
    deleting: boolean
    mainContent?: string
    onRegenerate: (platform: string, prompt: string) => Promise<void>
    regenerating: boolean
}

const platformConfig = {
    linkedin: {
        name: "LinkedIn",
        icon: FaLinkedin,
        iconColor: "text-blue-500",
        buttonClass: "bg-blue-600 hover:bg-blue-700",
    },
    x: {
        name: "X (Twitter)",
        icon: FaXTwitter,
        iconColor: "text-white",
        buttonClass: "bg-blue-600 hover:bg-blue-700",
    },
    meta: {
        name: "Meta (Facebook)",
        icon: FaMeta,
        iconColor: "text-blue-500",
        buttonClass: "bg-blue-600 hover:bg-blue-700",
    },
}

export default function PlatformContentCard({
    platform,
    content,
    image,
    postingState,
    onContentChange,
    onPostToPlatform,
    onImageUpload,
    onImageDelete,
    uploading,
    deleting,
    mainContent,
    onRegenerate,
    regenerating,
}: PlatformContentCardProps) {
    const [showPromptInput, setShowPromptInput] = useState(false)
    const [prompt, setPrompt] = useState("")
    const [streamingContent, setStreamingContent] = useState("")
    const [isStreaming, setIsStreaming] = useState(false)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [showPostConfirmDialog, setShowPostConfirmDialog] = useState(false)
    const [pendingRegeneration, setPendingRegeneration] = useState<{
        type: "custom" | "quick"
        prompt?: string
    } | null>(null)

    const config = platformConfig[platform as keyof typeof platformConfig]
    if (!config) return null

    const Icon = config.icon

    const handleRegenerate = async () => {
        if (!prompt.trim()) return

        setIsStreaming(true)
        setStreamingContent("")

        try {
            await onRegenerate(platform, prompt)
        } catch (error) {
            console.error("Failed to regenerate content:", error)
        } finally {
            setIsStreaming(false)
            setShowPromptInput(false)
            setPrompt("")
        }
    }

    const handleQuickRegenerate = async () => {
        if (!mainContent) return

        setIsStreaming(true)
        setStreamingContent("")

        try {
            // Use a default prompt for quick regeneration
            const defaultPrompt = `Refine this content for ${config.name}: ${mainContent}`
            await onRegenerate(platform, defaultPrompt)
        } catch (error) {
            console.error("Failed to regenerate content:", error)
        } finally {
            setIsStreaming(false)
        }
    }

    const confirmRegeneration = (type: "custom" | "quick", prompt?: string) => {
        setPendingRegeneration({ type, prompt })
        setShowConfirmDialog(true)
    }

    const executeRegeneration = async () => {
        if (!pendingRegeneration) return

        setShowConfirmDialog(false)
        setPendingRegeneration(null)

        if (
            pendingRegeneration.type === "custom" &&
            pendingRegeneration.prompt
        ) {
            await handleRegenerate()
        } else if (pendingRegeneration.type === "quick") {
            await handleQuickRegenerate()
        }
    }

    const confirmPosting = () => {
        setShowPostConfirmDialog(true)
    }

    const executePosting = async () => {
        setShowPostConfirmDialog(false)
        await onPostToPlatform(platform)
    }

    const displayContent = isStreaming ? streamingContent : content

    return (
        <>
            <Card className='glassmorphism bg-gray-900/50 border-gray-700'>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <CardTitle className='text-white flex items-center gap-2'>
                            <Icon className={`w-5 h-5 ${config.iconColor}`} />
                            {config.name} Content
                        </CardTitle>
                        <div className='flex items-center gap-3'>
                            {/* Regenerate Buttons - Pure Icons */}
                            <Button
                                variant={"ghost"}
                                onClick={() =>
                                    setShowPromptInput(!showPromptInput)
                                }
                                disabled={regenerating || isStreaming}
                                className='p-2 text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-transparent'
                                title='Custom Prompt'
                            >
                                <Sparkles className='w-4 h-4' />
                            </Button>
                            <Button
                                variant={"ghost"}
                                onClick={() => confirmRegeneration("quick")}
                                disabled={
                                    regenerating || isStreaming || !mainContent
                                }
                                className='p-2 text-orange-400 hover:text-orange-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-transparent'
                                title='Quick Regenerate'
                            >
                                <RefreshCw
                                    className={`w-4 h-4 ${isStreaming ? "animate-spin" : ""}`}
                                />
                            </Button>
                            <Button
                                onClick={confirmPosting}
                                disabled={postingState || isStreaming}
                                variant='ghost'
                                size='sm'
                                className='p-2 text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-transparent'
                                title={
                                    postingState
                                        ? "Posting..."
                                        : `Post to ${config.name}`
                                }
                            >
                                {postingState ? (
                                    <Loader2 className='w-4 h-4 animate-spin' />
                                ) : (
                                    <Send className='w-4 h-4' />
                                )}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className='space-y-4'>
                    {/* Custom Prompt Input */}
                    {showPromptInput && (
                        <div className='space-y-3 p-4 bg-black/20 rounded-lg border border-purple-500/30'>
                            <div className='flex items-center gap-2'>
                                <Sparkles className='w-4 h-4 text-purple-400' />
                                <span className='text-white text-sm font-medium'>
                                    Prompt for generate new content
                                </span>
                            </div>
                            <div className='flex gap-2 relative'>
                                <AutoHeightTextarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder={`Enter a prompt to generate new content for ${config.name}...`}
                                    className='flex-1 bg-black/30 border-purple-500/50 text-white placeholder:text-white/20'
                                    disabled={regenerating || isStreaming}
                                />
                                <Button
                                    onClick={() =>
                                        confirmRegeneration("custom", prompt)
                                    }
                                    disabled={
                                        !prompt.trim() ||
                                        regenerating ||
                                        isStreaming
                                    }
                                    variant={"ghost"}
                                    className='absolute right-2 top-1/2 -translate-y-1/2 text-purple-500 hover:text-purple-600 hover:bg-transparent'
                                    size='sm'
                                >
                                    {regenerating ? (
                                        <Loader2 className='w-3 h-3 mr-1 animate-spin' />
                                    ) : (
                                        <Send className='w-3 h-3 mr-1' />
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Content Display */}
                    <AutoHeightTextarea
                        value={displayContent || ""}
                        onChange={(e) =>
                            onContentChange(platform, e.target.value)
                        }
                        className='input'
                        placeholder={`${config.name} content...`}
                        disabled={isStreaming}
                    />

                    {/* Streaming Indicator */}
                    {isStreaming && (
                        <div className='flex items-center gap-2 text-purple-400 text-sm'>
                            <div className='w-2 h-2 bg-purple-400 rounded-full animate-pulse'></div>
                            <span>AI is generating new content...</span>
                        </div>
                    )}

                    <PlatformImageSection
                        platform={platform}
                        image={image}
                        platformName={config.name}
                        icon={Icon}
                        iconColor={config.iconColor}
                        onImageUpload={onImageUpload}
                        onImageDelete={onImageDelete}
                        uploading={uploading}
                        deleting={deleting}
                    />
                </CardContent>
            </Card>

            {/* Regeneration Confirmation Dialog */}
            <AlertDialog
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
            >
                <AlertDialogContent className='bg-gray-900 border-gray-700'>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='text-white'>
                            Confirm Content Regeneration
                        </AlertDialogTitle>
                        <AlertDialogDescription className='text-gray-300'>
                            This action will call the AI API to regenerate the{" "}
                            {config.name} content. The current content will be
                            replaced with the new AI-generated text.
                            <br />
                            <br />
                            <strong>Are you sure you want to continue?</strong>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className='bg-gray-700 text-white border-gray-600 hover:bg-gray-600'>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={executeRegeneration}
                            className='bg-purple-600 hover:bg-purple-700'
                        >
                            Yes, Regenerate
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Posting Confirmation Dialog */}
            <AlertDialog
                open={showPostConfirmDialog}
                onOpenChange={setShowPostConfirmDialog}
            >
                <AlertDialogContent className='bg-gray-900 border-gray-700'>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='text-white'>
                            Confirm Posting to {config.name}
                        </AlertDialogTitle>
                        <AlertDialogDescription className='text-gray-300'>
                            This content is scheduled to be posted automatically
                            at 20:00 every day.
                            <br />
                            <br />
                            <strong>
                                Do you wish to post before the scheduled time?
                            </strong>
                            <br />
                            <br />
                            <span className='text-yellow-400'>
                                ⚠️ Note: Posting now will override the scheduled
                                posting time.
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className='bg-gray-700 text-white border-gray-600 hover:bg-gray-600'>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={executePosting}
                            className='bg-blue-600 hover:bg-blue-700'
                        >
                            Yes, Post Now
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
