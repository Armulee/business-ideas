import { useCallback } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Rocket, Save } from "lucide-react"
import axios from "axios"
import { NewPostSchema } from "@/components/new-post/new-ideas/types"
import { useWidgetForm } from "@/components/new-post/new-ideas/provider"
import { toast } from "sonner"

interface NewPostActionsProps {
    hasUnsavedChanges: boolean
    hasInteracted: boolean
    savingDraft: boolean
    submitting: boolean
    error: string | null
    form: ReturnType<typeof useForm<NewPostSchema>>
    setSavingDraft: (value: boolean) => void
    setHasUnsavedChanges: (value: boolean) => void
    setShowSaved: (value: boolean) => void
    _draftId: string | null
    setDraftId: (value: string | null) => void
    setCleanFormState: (value: NewPostSchema) => void
}

export function NewPostActions({
    hasUnsavedChanges,
    hasInteracted,
    savingDraft,
    submitting,
    error,
    form,
    setSavingDraft,
    setHasUnsavedChanges,
    setShowSaved,
    _draftId,
    setDraftId,
    setCleanFormState,
}: NewPostActionsProps) {
    const { widget } = useWidgetForm()

    const saveDraft = useCallback(async () => {
        if (!hasInteracted || savingDraft) return

        setSavingDraft(true)
        try {
            const formValues = form.getValues()

            // Check if there's any content to save
            const hasContent =
                formValues.title?.trim() ||
                formValues.content?.trim() ||
                (formValues.categories && formValues.categories.length > 0)

            if (!hasContent) {
                console.log("No content to save")
                setSavingDraft(false)
                return
            }

            const draftData = {
                title: formValues.title?.trim() || undefined,
                categories: formValues.categories || [],
                content: formValues.content?.trim() || undefined,
                community: "new-ideas",
                advancedSettings: formValues.advancedSettings,
                widgets: widget ? [widget] : [],
            }

            let response
            if (_draftId) {
                // Update existing draft
                response = await axios.patch("/api/post/draft", {
                    draftId: _draftId,
                    ...draftData,
                })
            } else {
                // Create new draft
                response = await axios.post("/api/post/draft", draftData)
                setDraftId(response.data.draft.id)
            }

            setShowSaved(true)
            setHasUnsavedChanges(false)
            // Update clean state to current form values after saving
            setCleanFormState(form.getValues())

            // Refresh the new post button to show updated draft count
            const windowWithRefresh = window as typeof window & {
                refreshNewPostButton?: () => void
            }
            if (windowWithRefresh.refreshNewPostButton) {
                windowWithRefresh.refreshNewPostButton()
            }
        } catch (error) {
            console.error("Failed to save draft:", error)
            toast.error("Failed to save draft", {
                description:
                    "There was an error saving your draft. Please try again.",
                duration: 5000,
            })
        } finally {
            setSavingDraft(false)
        }
    }, [
        form,
        widget,
        hasInteracted,
        savingDraft,
        _draftId,
        setSavingDraft,
        setShowSaved,
        setHasUnsavedChanges,
        setDraftId,
        setCleanFormState,
    ])

    return (
        <div className='flex items-center gap-3'>
            {/* Save Draft Button */}
            <Button
                type='button'
                variant={"ghost"}
                onClick={saveDraft}
                disabled={!hasUnsavedChanges || !hasInteracted || savingDraft}
                className={`flex items-center gap-2 text-sm transition-all duration-200 bg-transparent hover:bg-white/10 rounded-full px-4 py-2 ${
                    !hasUnsavedChanges || !hasInteracted || savingDraft
                        ? "text-white/60 cursor-not-allowed"
                        : "text-white"
                }`}
                size='sm'
            >
                <Save className='w-4 h-4' />
                {savingDraft ? "Saving..." : "Save Draft"}
            </Button>

            {/* Publish Button */}
            <Button
                type='submit'
                form='new-post-form'
                disabled={submitting}
                className={`flex items-center gap-2 text-sm transition-all duration-200 rounded-full px-4 py-2 ${
                    error
                        ? "bg-red-600/80 hover:bg-red-600 border-red-500/50"
                        : "bg-white text-blue-600 hover:bg-white/90"
                }`}
                size='sm'
            >
                <Rocket className='w-4 h-4' />
                {submitting ? "Publishing..." : "Publish"}
            </Button>
        </div>
    )
}
