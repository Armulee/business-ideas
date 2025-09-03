"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import axios from "axios"
import EditDialog from "@/components/admin/orchestration/content/edit-dialog"
import ActionButtons from "@/components/admin/orchestration/content/action-buttons"
import PreviewLink from "@/components/admin/orchestration/content/preview-link"
import PlatformAccordion from "@/components/admin/orchestration/content/platform-accordion"
import ContentHeader from "@/components/admin/orchestration/content/content-header"
import ContentFooter from "@/components/admin/orchestration/content/content-footer"
import AdminLoading from "@/components/admin/loading"
import {
    OrchestrationData,
    MainPlatformPrompts,
    SocialPlatformPrompts,
} from "@/components/admin/orchestration/content/types"
import { useRouter } from "next/navigation"

export default function ContentOrchestrationPage() {
    const router = useRouter()
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
    const [initialLoading, setInitialLoading] = useState(true)
    const [hasGeneratedContent, setHasGeneratedContent] = useState(false)
    const [checkingContent, setCheckingContent] = useState(true)
    const [editDialog, setEditDialog] = useState({
        open: false,
        platform: "",
        data: null as MainPlatformPrompts | SocialPlatformPrompts | null,
    })

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
            setInitialLoading(true)
            const response = await axios.get("/api/orchestration/content")
            setData(response.data)
        } catch (error) {
            console.error("Failed to fetch orchestration data:", error)
        } finally {
            setInitialLoading(false)
        }
    }

    // Show loading while fetching initial data
    if (initialLoading) {
        return <AdminLoading size='lg' />
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

    const handlePromptChange = (
        platform: string,
        field: "systemPrompt" | "userPrompt",
        value: string
    ) => {
        setData((prevData) => ({
            ...prevData,
            [platform]: {
                ...prevData[platform as keyof OrchestrationData],
                [field]: value,
            },
        }))
    }

    const handleSavePlatformPrompts = async (platform: string) => {
        try {
            setLoading(true)
            await axios.patch("/api/orchestration/content", data)
            toast.success(`${platform} prompts saved successfully`)
        } catch (error) {
            console.error(`Failed to save ${platform} prompts:`, error)
            toast.error(`Failed to save ${platform} prompts`)
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

            if (response.status === 200) {
                setHasGeneratedContent(true)
                toast.success(
                    "Content generated and saved successfully! Redirecting to preview..."
                )

                // Redirect to preview page after a short delay
                setTimeout(() => {
                    router.push("/admin/orchestration/content/preview")
                }, 1500)
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
            <PreviewLink
                checkingContent={checkingContent}
                hasGeneratedContent={hasGeneratedContent}
            />

            {/* Content Header */}
            <ContentHeader />

            {/* Platform Accordion */}
            <div className='mt-6'>
                <PlatformAccordion
                    data={data}
                    loading={loading}
                    onPurposeChange={handlePurposeChange}
                    onPromptChange={handlePromptChange}
                    onSavePlatformPrompts={handleSavePlatformPrompts}
                    onOpenEditDialog={openEditDialog}
                />
            </div>

            {/* Action Buttons */}
            <div className='mt-6'>
                <ActionButtons
                    loading={loading}
                    hasGeneratedContent={hasGeneratedContent}
                    onGenerateContent={handleGenerateContent}
                />
            </div>

            {/* Footer */}
            <ContentFooter />

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
