"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { toast } from "sonner"
import axios from "axios"
import { FaLinkedin, FaMeta, FaXTwitter } from "react-icons/fa6"
import { Flame, Eye, EyeOff } from "lucide-react"
import EditDialog from "@/components/admin/orchestration/content/edit-dialog"
// import MainContent from "@/components/admin/orchestration/content/generated-content/main"
// import LinkedinContent from "@/components/admin/orchestration/content/generated-content/linkedin"
// import XContent from "@/components/admin/orchestration/content/generated-content/x"
// import MetaContent from "@/components/admin/orchestration/content/generated-content/meta"
// import InfiniteCanvas from "@/components/admin/orchestration/content/infinite-canvas"

interface MainPlatformPrompts {
    purpose: string
    systemPrompt: string
    userPrompt: string
    imagePrompt?: string
}

interface SocialPlatformPrompts {
    purpose?: string
    systemPrompt: string
    userPrompt: string
    imagePrompt?: string
}

interface OrchestrationData {
    main: MainPlatformPrompts
    linkedin: SocialPlatformPrompts
    x: SocialPlatformPrompts
    meta: SocialPlatformPrompts
}

const purposeOptions = [
    "Introduction",
    "Bring Awareness",
    "Case Study",
    "Advertisement",
]

export default function ContentOrchestrationPage() {
    const [data, setData] = useState<OrchestrationData>({
        main: {
            purpose: "Introduction",
            systemPrompt: "",
            userPrompt: "",
            imagePrompt: "",
        },
        linkedin: { systemPrompt: "", userPrompt: "", imagePrompt: "" },
        x: { systemPrompt: "", userPrompt: "", imagePrompt: "" },
        meta: { systemPrompt: "", userPrompt: "", imagePrompt: "" },
    })
    const [loading, setLoading] = useState(false)
    const [hasGeneratedContent, setHasGeneratedContent] = useState(false)
    const [checkingContent, setCheckingContent] = useState(true)
    const [editDialog, setEditDialog] = useState({
        open: false,
        platform: "",
        data: null as MainPlatformPrompts | SocialPlatformPrompts | null,
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
        checkGeneratedContent()
    }, [])

    const checkGeneratedContent = async () => {
        try {
            setCheckingContent(true)
            const response = await axios.get(
                "/api/orchestration/content/generated"
            )
            setHasGeneratedContent(response.data.exists)
        } catch (error) {
            console.error("Failed to check generated content:", error)
            setHasGeneratedContent(false)
        } finally {
            setCheckingContent(false)
        }
    }

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
                [editDialog.platform]: editDialog.data,
            }

            await axios.patch("/api/orchestration/content", updatedData)
            setData(updatedData)
            setEditDialog({ open: false, platform: "", data: null })
            toast.success("Platform updated successfully")
        } catch (error) {
            console.error("Failed to save prompt:", error)
            toast.error("Failed to update platform")
        } finally {
            setLoading(false)
        }
    }

    const handleEditDialogChange = (open: boolean) => {
        if (!open) {
            setEditDialog({ open: false, platform: "", data: null })
        }
    }

    const handleDataChange = (
        newData: MainPlatformPrompts | SocialPlatformPrompts
    ) => {
        setEditDialog({ ...editDialog, data: newData })
    }

    const handlePurposeChange = async (purpose: string) => {
        try {
            setLoading(true)
            const updatedData = {
                ...data,
                main: { ...data.main, purpose },
            }

            await axios.patch("/api/orchestration/content", updatedData)
            setData(updatedData)
            toast.success("Purpose updated successfully")
        } catch (error) {
            console.error("Failed to update purpose:", error)
            toast.error("Failed to update purpose")
        } finally {
            setLoading(false)
        }
    }

    const handleSocialPurposeChange = async (
        platform: string,
        purpose: string
    ) => {
        try {
            setLoading(true)
            const updatedData = {
                ...data,
                [platform]: {
                    ...data[platform as keyof OrchestrationData],
                    purpose,
                },
            }

            await axios.patch("/api/orchestration/content", updatedData)
            setData(updatedData)
            toast.success("Purpose updated successfully")
        } catch (error) {
            console.error("Failed to update purpose:", error)
            toast.error("Failed to update purpose")
        } finally {
            setLoading(false)
        }
    }

    const handleGenerateContent = async () => {
        try {
            setLoading(true)
            const response = await axios.post(
                "/api/orchestration/content/cron/generate"
            )

            // Save the generated content to database instead of showing it
            if (response.data.data) {
                await axios.post(
                    "/api/orchestration/content/generated",
                    response.data.data
                )
                setHasGeneratedContent(true)
                toast.success(
                    "Content generated and saved successfully! You can now view it in the preview."
                )
            }
        } catch (error) {
            const err = error as Error
            console.log("Failed to generate content:", err.message)
            toast.error("Failed to generate content")
        } finally {
            setLoading(false)
        }
    }

    const openEditDialog = (platform: string) => {
        const platformData = data[platform as keyof OrchestrationData]
        setEditDialog({ open: true, platform, data: platformData })
    }
    return (
        <div className='max-w-lg mx-auto py-3'>
            {/* Preview Link */}
            <div className='w-full text-right mb-2'>
                <Button
                    disabled={checkingContent || !hasGeneratedContent}
                    variant='outline'
                    className={`button ${
                        hasGeneratedContent
                            ? "hover:bg-white/10 text-white"
                            : "opacity-50 cursor-not-allowed text-white/50"
                    }`}
                >
                    <Link
                        href='/admin/orchestration/content/preview'
                        className='flex items-center gap-2'
                    >
                        {hasGeneratedContent ? (
                            <>
                                <Eye className='w-4 h-4' />
                                View Preview
                            </>
                        ) : (
                            <>
                                <EyeOff className='w-4 h-4' />
                                No Preview
                            </>
                        )}
                    </Link>
                </Button>
            </div>

            {/* Content Orchestration */}
            <Card className='glassmorphism mx-auto bg-transparent'>
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
                                            {/* Purpose Section - Only for Main Platform */}
                                            {platform === "main" && (
                                                <div className='flex justify-between items-end'>
                                                    <div className='space-y-2 flex-1 mr-4'>
                                                        <Label className='text-white text-sm font-medium'>
                                                            Content Purpose
                                                        </Label>
                                                        <Select
                                                            value={
                                                                (
                                                                    platformData as MainPlatformPrompts
                                                                ).purpose ||
                                                                "Introduction"
                                                            }
                                                            onValueChange={
                                                                handlePurposeChange
                                                            }
                                                            disabled={loading}
                                                        >
                                                            <SelectTrigger className='select text-white'>
                                                                <SelectValue placeholder='Select purpose' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {purposeOptions.map(
                                                                    (
                                                                        option
                                                                    ) => (
                                                                        <SelectItem
                                                                            key={
                                                                                option
                                                                            }
                                                                            value={
                                                                                option
                                                                            }
                                                                        >
                                                                            {
                                                                                option
                                                                            }
                                                                        </SelectItem>
                                                                    )
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <Button
                                                        size='sm'
                                                        variant='outline'
                                                        onClick={() =>
                                                            openEditDialog(
                                                                platform
                                                            )
                                                        }
                                                        className='button border-white/20 text-white hover:bg-white/10'
                                                        disabled={loading}
                                                    >
                                                        Edit
                                                    </Button>
                                                </div>
                                            )}

                                            {/* For Social Platforms - Purpose Selection and Edit Button */}
                                            {platform !== "main" && (
                                                <div className='flex justify-between items-end'>
                                                    <div className='space-y-2 flex-1 mr-4'>
                                                        <Label className='text-white text-sm font-medium'>
                                                            Content Purpose
                                                        </Label>
                                                        <Select
                                                            value={
                                                                (
                                                                    platformData as SocialPlatformPrompts
                                                                ).purpose ||
                                                                "Introduction"
                                                            }
                                                            onValueChange={(
                                                                purpose
                                                            ) =>
                                                                handleSocialPurposeChange(
                                                                    platform,
                                                                    purpose
                                                                )
                                                            }
                                                            disabled={loading}
                                                        >
                                                            <SelectTrigger className='bg-gray-800/50 border-gray-600 text-white'>
                                                                <SelectValue placeholder='Select purpose' />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {purposeOptions.map(
                                                                    (
                                                                        option
                                                                    ) => (
                                                                        <SelectItem
                                                                            key={
                                                                                option
                                                                            }
                                                                            value={
                                                                                option
                                                                            }
                                                                        >
                                                                            {
                                                                                option
                                                                            }
                                                                        </SelectItem>
                                                                    )
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <Button
                                                        size='sm'
                                                        variant='outline'
                                                        onClick={() =>
                                                            openEditDialog(
                                                                platform
                                                            )
                                                        }
                                                        className='button border-white/20 text-white hover:bg-white/10'
                                                        disabled={loading}
                                                    >
                                                        Edit
                                                    </Button>
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
                        <div className='flex gap-3'>
                            <Button
                                onClick={() => handleGenerateContent()}
                                disabled={loading}
                                className='flex-1 bg-blue-600 hover:bg-blue-700'
                            >
                                {loading ? "Generating..." : "Generate Content"}
                            </Button>
                        </div>
                        <p className='text-white/60 text-xs'>
                            Generate content and save it to database. Content
                            expires daily at 8PM.
                            {!hasGeneratedContent && (
                                <span className='text-yellow-400 block mt-1'>
                                    ⚠️ Generate content first to enable preview
                                </span>
                            )}
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

            {editDialog.data && (
                <EditDialog
                    open={editDialog.open}
                    platform={editDialog.platform}
                    data={editDialog.data}
                    loading={loading}
                    onOpenChange={handleEditDialogChange}
                    onDataChange={handleDataChange}
                    onSave={handleSavePrompt}
                />
            )}
        </div>
    )
}
