"use client"

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
import { AlertTriangle, DollarSign, RefreshCw } from "lucide-react"

interface RegenerateDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    loading?: boolean
}

export default function RegenerateDialog({
    open,
    onOpenChange,
    onConfirm,
    loading = false,
}: RegenerateDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className='bg-gray-900 border-gray-700 text-white'>
                <AlertDialogHeader>
                    <AlertDialogTitle className='flex items-center gap-2 text-red-400'>
                        <AlertTriangle className='w-5 h-5' />
                        Confirm Content Regeneration
                    </AlertDialogTitle>
                    <AlertDialogDescription className='text-gray-300'>
                        This action will regenerate all content from scratch
                        using AI, which will:
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className='space-y-3 py-4'>
                    <div className='flex items-start gap-3 p-3 bg-red-900/20 border border-red-700/50 rounded-lg'>
                        <DollarSign className='w-5 h-5 text-red-400 mt-0.5 flex-shrink-0' />
                        <div className='text-sm text-gray-200'>
                            <p className='font-medium text-red-300 mb-1'>
                                Cost Warning
                            </p>
                            <p>This will charge additional AI API costs for:</p>
                            <ul className='list-disc list-inside mt-2 space-y-1 text-gray-300'>
                                <li>Main content generation (GPT-5)</li>
                                <li>
                                    Platform-specific refinements (LinkedIn, X,
                                    Meta)
                                </li>
                                <li>Image prompt generation</li>
                                <li>New image creation</li>
                            </ul>
                        </div>
                    </div>

                    <div className='flex items-start gap-3 p-3 bg-blue-900/20 border border-blue-700/50 rounded-lg'>
                        <RefreshCw className='w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0' />
                        <div className='text-sm text-gray-200'>
                            <p className='font-medium text-blue-300 mb-1'>
                                What Happens
                            </p>
                            <p>
                                All existing generated content will be replaced
                                with fresh AI-generated content. This process
                                cannot be undone.
                            </p>
                        </div>
                    </div>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel
                        className='bg-gray-700 hover:bg-gray-600 text-white border-gray-600'
                        disabled={loading}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        disabled={loading}
                        className='bg-red-600 hover:bg-red-700 text-white border-red-600 disabled:opacity-50'
                    >
                        {loading ? (
                            <>
                                <RefreshCw className='w-4 h-4 mr-2 animate-spin' />
                                Regenerating...
                            </>
                        ) : (
                            "Yes, Regenerate All Content"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
