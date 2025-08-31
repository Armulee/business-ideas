"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { toast } from "sonner"
import axios from "axios"
import { FaLinkedin, FaMeta, FaXTwitter } from "react-icons/fa6"
import { Flame } from "lucide-react"
import EditDialog from "@/components/admin/orchestration/content/edit-dialog"
// import MainContent from "@/components/admin/orchestration/content/generated-content/main"
// import LinkedinContent from "@/components/admin/orchestration/content/generated-content/linkedin"
// import XContent from "@/components/admin/orchestration/content/generated-content/x"
// import MetaContent from "@/components/admin/orchestration/content/generated-content/meta"
// import InfiniteCanvas from "@/components/admin/orchestration/content/infinite-canvas"

interface PlatformPrompts {
    systemPrompt: string
    userPrompt: string
    imagePrompt?: string
}

interface OrchestrationData {
    main: PlatformPrompts
    linkedin: PlatformPrompts
    x: PlatformPrompts
    meta: PlatformPrompts
}

interface GeneratedContent {
    main?: string
    linkedin?: string
    linkedinImage?: string
    x?: string
    xImage?: string
    meta?: string
    metaImage?: string
}

export default function ContentOrchestrationPage() {
    const [data, setData] = useState<OrchestrationData>({
        main: { systemPrompt: "", userPrompt: "", imagePrompt: "" },
        linkedin: { systemPrompt: "", userPrompt: "", imagePrompt: "" },
        x: { systemPrompt: "", userPrompt: "", imagePrompt: "" },
        meta: { systemPrompt: "", userPrompt: "", imagePrompt: "" },
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

    const handleEditDialogChange = (open: boolean) => {
        if (!open) {
            setEditDialog({ open: false, platform: "", type: "", value: "" })
        }
    }

    const handleEditValueChange = (value: string) => {
        setEditDialog({ ...editDialog, value })
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

    console.log(generatedContent)
    return (
        <div className='py-8 space-y-6'>
            <Card className='glassmorphism max-w-lg mx-auto bg-transparent'>
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

                                            {/* Image Prompt Section - Only show for social media platforms, not main */}
                                            {platform !== "main" && (
                                                <div className='space-y-2'>
                                                    <div className='flex items-center justify-between'>
                                                        <Label className='text-white text-sm font-medium'>
                                                            Image Prompt
                                                        </Label>
                                                    </div>
                                                    <Card
                                                        onClick={() =>
                                                            openEditDialog(
                                                                platform,
                                                                "imagePrompt",
                                                                platformData.imagePrompt ||
                                                                    ""
                                                            )
                                                        }
                                                        className='bg-gray-800/50 border-gray-700 input hover:bg-white/20 cursor-pointer'
                                                    >
                                                        <CardContent className='p-3'>
                                                            <div className='text-gray-300 text-sm whitespace-pre-wrap break-words line-clamp-4'>
                                                                {platformData.imagePrompt ||
                                                                    "No image prompt configured"}
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            )}
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
                <div className='mt-8 space-y-6 max-w-4xl mx-auto'>
                    <h3 className='text-white text-xl font-bold text-center'>
                        Generated Content
                    </h3>

                    {/* Main Content */}
                    {generatedContent.main && (
                        <Card className='glassmorphism bg-gray-900/50 border-gray-700'>
                            <CardHeader>
                                <CardTitle className='text-white flex items-center gap-2'>
                                    <Flame className='w-5 h-5 text-orange-500' />
                                    Main Platform Content
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className='text-white whitespace-pre-wrap bg-gray-800/30 p-4 rounded-lg'>
                                    {generatedContent.main}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* LinkedIn Content */}
                    {generatedContent.linkedin && (
                        <Card className='glassmorphism bg-gray-900/50 border-gray-700'>
                            <CardHeader>
                                <CardTitle className='text-white flex items-center gap-2'>
                                    <FaLinkedin className='w-5 h-5 text-blue-500' />
                                    LinkedIn Content
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <div className='text-white whitespace-pre-wrap bg-gray-800/30 p-4 rounded-lg'>
                                    {generatedContent.linkedin}
                                </div>
                                {generatedContent.linkedinImage && (
                                    <div className='space-y-2'>
                                        <Label className='text-white text-sm font-medium'>
                                            Generated Image:
                                        </Label>
                                        <Image
                                            src={generatedContent.linkedinImage}
                                            alt='LinkedIn generated image'
                                            width={400}
                                            height={400}
                                            className='w-full max-w-md mx-auto rounded-lg'
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* X (Twitter) Content */}
                    {generatedContent.x && (
                        <Card className='glassmorphism bg-gray-900/50 border-gray-700'>
                            <CardHeader>
                                <CardTitle className='text-white flex items-center gap-2'>
                                    <FaXTwitter className='w-5 h-5 text-white' />
                                    X (Twitter) Content
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <div className='text-white whitespace-pre-wrap bg-gray-800/30 p-4 rounded-lg'>
                                    {generatedContent.x}
                                </div>
                                {generatedContent.xImage && (
                                    <div className='space-y-2'>
                                        <Label className='text-white text-sm font-medium'>
                                            Generated Image:
                                        </Label>
                                        <Image
                                            src={generatedContent.xImage}
                                            alt='X generated image'
                                            width={400}
                                            height={400}
                                            className='w-full max-w-md mx-auto rounded-lg'
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Meta Content */}
                    {generatedContent.meta && (
                        <Card className='glassmorphism bg-gray-900/50 border-gray-700'>
                            <CardHeader>
                                <CardTitle className='text-white flex items-center gap-2'>
                                    <FaMeta className='w-5 h-5 text-blue-500' />
                                    Meta (Facebook) Content
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <div className='text-white whitespace-pre-wrap bg-gray-800/30 p-4 rounded-lg'>
                                    {generatedContent.meta}
                                </div>
                                {generatedContent.metaImage && (
                                    <div className='space-y-2'>
                                        <Label className='text-white text-sm font-medium'>
                                            Generated Image:
                                        </Label>
                                        <Image
                                            src={generatedContent.metaImage}
                                            alt='Meta generated image'
                                            width={400}
                                            height={400}
                                            className='w-full max-w-md mx-auto rounded-lg'
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            <EditDialog
                open={editDialog.open}
                platform={editDialog.platform}
                type={editDialog.type}
                value={editDialog.value}
                loading={loading}
                onOpenChange={handleEditDialogChange}
                onValueChange={handleEditValueChange}
                onSave={handleSavePrompt}
            />
        </div>
    )
}
