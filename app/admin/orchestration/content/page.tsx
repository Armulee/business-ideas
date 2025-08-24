"use client"

import { useState, useEffect } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { toast } from "sonner"
import axios from "axios"
import AutoHeightTextarea from "@/components/ui/auto-height-textarea"
import { FaLinkedin, FaMeta, FaXTwitter } from "react-icons/fa6"
import { Flame } from "lucide-react"
import Image from "next/image"
// import InfiniteCanvas from "@/components/admin/orchestration/content/infinite-canvas"

interface PlatformPrompts {
    systemPrompt: string
    userPrompt: string
}

interface OrchestrationData {
    main: PlatformPrompts
    linkedin: PlatformPrompts
    x: PlatformPrompts
    meta: PlatformPrompts
}

interface LinkedinContent {
    content?: string
    text?: string
    image_required?: boolean
    image_brief?: string
}

interface GeneratedContent {
    main?: string
    linkedin?: string | LinkedinContent
    linkedinImage?: string
    x?: string
    meta?: string
}

export default function ContentOrchestrationPage() {
    const [data, setData] = useState<OrchestrationData>({
        main: { systemPrompt: "", userPrompt: "" },
        linkedin: { systemPrompt: "", userPrompt: "" },
        x: { systemPrompt: "", userPrompt: "" },
        meta: { systemPrompt: "", userPrompt: "" },
    })
    const [loading, setLoading] = useState(false)
    const [generatedContent, setGeneratedContent] =
        useState<GeneratedContent | null>(null)
    const [editDialog, setEditDialog] = useState({
        open: false,
        platform: "",
        type: "",
        value: "",
    })

    const platformConfig = {
        main: {
            name: "Main Platform",
            icon: Flame,
            color: "text-blue-500",
        },
        linkedin: {
            name: "LinkedIn",
            icon: FaLinkedin,
            color: "text-blue-500",
        },
        x: { name: "X (Twitter)", icon: FaXTwitter, color: "text-white" },
        meta: { name: "Meta (Facebook)", icon: FaMeta, color: "text-blue-500" },
    }

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const response = await axios.get("/api/orchestration/content")
            setData(response.data)
        } catch (error) {
            console.error("Failed to fetch orchestration data:", error)
        }
    }

    const handleSavePrompt = async () => {
        try {
            setLoading(true)
            const updatedData = {
                ...data,
                [editDialog.platform]: {
                    ...data[editDialog.platform as keyof OrchestrationData],
                    [editDialog.type]: editDialog.value,
                },
            }

            await axios.patch("/api/orchestration/content", updatedData)
            setData(updatedData)
            setEditDialog({ open: false, platform: "", type: "", value: "" })
            toast.success("Prompt updated successfully")
        } catch (error) {
            console.error("Failed to save prompt:", error)
            toast.error("Failed to update prompt")
        } finally {
            setLoading(false)
        }
    }

    const handleGenerateContent = async () => {
        try {
            setLoading(true)
            const response = await axios.post("/api/orchestration/content/cron")
            console.log(response)

            // Set the generated content from the response
            if (response.data.data) {
                setGeneratedContent(response.data.data)
            }

            toast.success("Content generation completed successfully")
        } catch (error) {
            const err = error as Error
            console.log("Failed to generate content:", err.message)
            toast.error("Failed to start content generation")
        } finally {
            setLoading(false)
        }
    }

    const openEditDialog = (platform: string, type: string, value: string) => {
        setEditDialog({ open: true, platform, type, value })
    }
    return (
        <div className='container mx-auto py-8 space-y-6'>
            <Card className='glassmorphism max-w-4xl mx-auto bg-transparent'>
                <CardHeader>
                    <CardTitle className='text-white text-2xl'>
                        Content Orchestration
                    </CardTitle>
                    <CardDescription>
                        This Orchestration is making by Make (Integromat) which
                        using 2 prompts to generate a content by Antrophic
                        Claude Sonnet 4 and refine the content to OpenAI Chatgpt
                        4 to post in the various social medias automatically.
                    </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                    <Accordion type='single' collapsible className='w-full'>
                        {Object.entries(platformConfig).map(
                            ([platform, config]) => {
                                const Icon = config.icon
                                const platformData =
                                    data[platform as keyof OrchestrationData]

                                return (
                                    <AccordionItem
                                        key={platform}
                                        value={platform}
                                        className='border-gray-700'
                                    >
                                        <AccordionTrigger className='text-white hover:text-white/80 hover:no-underline'>
                                            <div className='flex items-center gap-3'>
                                                <Icon
                                                    className={`w-5 h-5 ${config.color}`}
                                                />
                                                <span className='font-semibold'>
                                                    {config.name}
                                                </span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className='space-y-4 pt-4 glassmorphism bg-black/30 p-6 mb-6'>
                                            {/* System Prompt Section */}
                                            <div className='space-y-2'>
                                                <div className='flex items-center justify-between'>
                                                    <Label className='text-white text-sm font-medium'>
                                                        System Prompt
                                                    </Label>
                                                </div>
                                                <Card
                                                    onClick={() =>
                                                        openEditDialog(
                                                            platform,
                                                            "systemPrompt",
                                                            platformData.systemPrompt
                                                        )
                                                    }
                                                    className='bg-gray-800/50 border-gray-700 input hover:bg-white/20 cursor-pointer'
                                                >
                                                    <CardContent className='p-3'>
                                                        <div className='text-gray-300 text-sm whitespace-pre-wrap break-words w-full line-clamp-4'>
                                                            {platformData.systemPrompt ||
                                                                "No system prompt configured"}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>

                                            {/* User Prompt Section */}
                                            <div className='space-y-2'>
                                                <div className='flex items-center justify-between'>
                                                    <Label className='text-white text-sm font-medium'>
                                                        User Prompt
                                                    </Label>
                                                </div>
                                                <Card
                                                    onClick={() =>
                                                        openEditDialog(
                                                            platform,
                                                            "userPrompt",
                                                            platformData.userPrompt
                                                        )
                                                    }
                                                    className='bg-gray-800/50 border-gray-700 input hover:bg-white/20 cursor-pointer'
                                                >
                                                    <CardContent className='p-3'>
                                                        <div className='text-gray-300 text-sm whitespace-pre-wrap break-words line-clamp-4'>
                                                            {platformData.userPrompt ||
                                                                "No user prompt configured"}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                )
                            }
                        )}
                    </Accordion>

                    <p className='text-white/70 text-xs mt-6'>
                        After setting the prompts, make a deployment to vercel
                        and then you can wait for the results at 8PM everyday.{" "}
                        <span className='text-red-400'>
                            Do not press the &quot;Instantly generate
                            content&quot; button frequently,
                        </span>{" "}
                        this is for quickly generating test content.
                    </p>

                    {/* Action Buttons */}
                    <div className='pt-2 space-y-3'>
                        <Button
                            onClick={() => handleGenerateContent()}
                            disabled={loading}
                            className='w-full bg-blue-600 hover:bg-blue-700'
                        >
                            {loading
                                ? "Generating..."
                                : "Instantly generate content for all platforms"}
                        </Button>
                        <p className='text-white/60 text-xs'>
                            This button will generate content for all configured
                            platforms and post them instantly.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <p className='text-sm max-w-xl mx-auto mt-4'>
                To trigger or check status of this process, head over to the{" "}
                <a
                    className='text-blue-400 underline'
                    href='https://vercel.com/armulees-projects/blue-biz-hub/settings/cron-jobs'
                >
                    Vercel Cronjobs Setting
                </a>{" "}
                and change the status to stop posting request to Make
                (Integromat).
            </p>

            {/* Generated Content Display */}
            {generatedContent && (
                <div className='mt-8 space-y-4'>
                    <h3 className='text-white text-lg font-semibold'>
                        Generated Content
                    </h3>

                    {generatedContent.main && (
                        <Card className='bg-gray-800/50 border-gray-700'>
                            <CardHeader className='pb-3'>
                                <CardTitle className='text-white text-sm flex items-center gap-2'>
                                    <Flame className='w-4 h-4 text-blue-500' />
                                    Main Platform Content
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className='text-gray-300 text-sm whitespace-pre-wrap break-words'>
                                    {generatedContent.main}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {generatedContent.linkedin && typeof generatedContent.linkedin === 'object' && (
                        <Card className='bg-gray-800/50 border-gray-700'>
                            <CardHeader className='pb-3'>
                                <CardTitle className='text-white text-sm flex items-center gap-2'>
                                    <FaLinkedin className='w-4 h-4 text-blue-500' />
                                    LinkedIn Content (Refined)
                                    {generatedContent.linkedinImage && (
                                        <span className='ml-auto text-xs text-green-400'>
                                            🖼️ Image Generated
                                        </span>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                {/* Content Box */}
                                <div className='space-y-2'>
                                    <h4 className='text-white text-xs font-medium'>Content:</h4>
                                    <Card className='bg-gray-700/50 border-gray-600'>
                                        <CardContent className='p-3'>
                                            <div className='text-gray-300 text-sm whitespace-pre-wrap break-words'>
                                                {generatedContent.linkedin.content || generatedContent.linkedin.text || "No content"}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Image Required Box */}
                                <div className='space-y-2'>
                                    <h4 className='text-white text-xs font-medium'>Image Required:</h4>
                                    <Card className='bg-gray-700/50 border-gray-600'>
                                        <CardContent className='p-3'>
                                            <div className={`text-sm font-medium ${
                                                generatedContent.linkedin.image_required ? "text-green-400" : "text-gray-400"
                                            }`}>
                                                {generatedContent.linkedin.image_required ? "true" : "false"}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Image Brief Box */}
                                <div className='space-y-2'>
                                    <h4 className='text-white text-xs font-medium'>Image Brief:</h4>
                                    <Card className='bg-gray-700/50 border-gray-600'>
                                        <CardContent className='p-3'>
                                            <div className='text-gray-300 text-sm whitespace-pre-wrap break-words'>
                                                {generatedContent.linkedin.image_brief || "null"}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Generated Image Display */}
                                {generatedContent.linkedinImage && (
                                    <div className='mt-6 space-y-2'>
                                        <h4 className='text-white text-xs font-medium'>Generated Image:</h4>
                                        <Card className='bg-gray-700/50 border-gray-600'>
                                            <CardContent className='p-3'>
                                                <Image
                                                    src={generatedContent.linkedinImage}
                                                    alt='Generated LinkedIn Image'
                                                    width={512}
                                                    height={512}
                                                    className='w-full max-w-md mx-auto rounded-lg shadow-lg'
                                                    onError={(e) => {
                                                        console.error("Failed to load image:", generatedContent.linkedinImage)
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
                    )}

                    {generatedContent.x && (
                        <Card className='bg-gray-800/50 border-gray-700'>
                            <CardHeader className='pb-3'>
                                <CardTitle className='text-white text-sm flex items-center gap-2'>
                                    <FaXTwitter className='w-4 h-4 text-white' />
                                    X (Twitter) Content
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className='text-gray-300 text-sm whitespace-pre-wrap break-words'>
                                    {generatedContent.x}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {generatedContent.meta && (
                        <Card className='bg-gray-800/50 border-gray-700'>
                            <CardHeader className='pb-3'>
                                <CardTitle className='text-white text-sm flex items-center gap-2'>
                                    <FaMeta className='w-4 h-4 text-blue-500' />
                                    Meta (Facebook) Content
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className='text-gray-300 text-sm whitespace-pre-wrap break-words'>
                                    {generatedContent.meta}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
            {/* Edit Dialog */}
            <Dialog
                open={editDialog.open}
                onOpenChange={(open) =>
                    !open &&
                    setEditDialog({
                        open: false,
                        platform: "",
                        type: "",
                        value: "",
                    })
                }
            >
                <DialogContent className='bg-gray-900 border-gray-700 text-white max-w-2xl'>
                    <DialogHeader>
                        <DialogTitle>
                            Edit{" "}
                            {editDialog.type === "systemPrompt"
                                ? "System"
                                : "User"}{" "}
                            Prompt
                            {editDialog.platform && (
                                <span className='text-sm font-normal text-gray-400 block'>
                                    for{" "}
                                    {
                                        platformConfig[
                                            editDialog.platform as keyof typeof platformConfig
                                        ]?.name
                                    }
                                </span>
                            )}
                        </DialogTitle>
                    </DialogHeader>
                    <div className='space-y-4'>
                        <AutoHeightTextarea
                            value={editDialog.value}
                            onChange={(e) =>
                                setEditDialog({
                                    ...editDialog,
                                    value: e.target.value,
                                })
                            }
                            placeholder={`Enter ${editDialog.type === "systemPrompt" ? "system" : "user"} prompt for ${editDialog.platform}...`}
                            className='min-h-[200px] bg-gray-800 border-gray-600 text-white'
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant='outline'
                            onClick={() =>
                                setEditDialog({
                                    open: false,
                                    platform: "",
                                    type: "",
                                    value: "",
                                })
                            }
                            className='border-gray-600 button text-white hover:bg-gray-800 md:mt-0 mt-2'
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSavePrompt}
                            disabled={loading}
                            className='bg-blue-600 hover:bg-blue-700'
                        >
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
