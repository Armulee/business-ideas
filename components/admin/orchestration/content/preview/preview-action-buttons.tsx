"use client"

import { Button } from "@/components/ui/button"
import { Send, SendHorizontal, Trash2 } from "lucide-react"

interface PreviewActionButtonsProps {
    hasUnsavedChanges: boolean
    saving: boolean
    postingAll: boolean
    deletingContent: boolean
    onSave: () => void
    onPostAll: () => void
    onDeleteContent: () => void
}

export default function PreviewActionButtons({
    hasUnsavedChanges,
    saving,
    postingAll,
    deletingContent,
    onSave,
    onPostAll,
    onDeleteContent,
}: PreviewActionButtonsProps) {
    return (
        <div className='flex justify-center gap-4 mb-6'>
            <Button
                onClick={hasUnsavedChanges ? onSave : onPostAll}
                disabled={saving || postingAll || deletingContent}
                className={
                    hasUnsavedChanges
                        ? "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                }
            >
                {hasUnsavedChanges ? (
                    <>
                        <Send className='w-4 h-4 mr-2' />
                        {saving ? "Saving..." : "Save Changes"}
                    </>
                ) : (
                    <>
                        <SendHorizontal className='w-4 h-4 mr-2' />
                        {postingAll ? "Posting to All..." : "Post All"}
                    </>
                )}
            </Button>
            <Button
                onClick={onDeleteContent}
                disabled={deletingContent || postingAll || saving}
                variant='destructive'
                className='bg-red-600 hover:bg-red-700'
            >
                <Trash2 className='w-4 h-4 mr-2' />
                {deletingContent ? "Deleting..." : "Delete Content"}
            </Button>
        </div>
    )
}
