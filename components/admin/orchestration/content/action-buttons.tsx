"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface ActionButtonsProps {
    loading: boolean
    hasGeneratedContent: boolean
    onGenerateContent: () => void
}

export default function ActionButtons({
    loading,
    hasGeneratedContent,
    onGenerateContent,
}: ActionButtonsProps) {
    return (
        <div className='pt-2 space-y-3'>
            <div className='flex gap-3'>
                <Button
                    onClick={() => onGenerateContent()}
                    disabled={loading}
                    className='flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50'
                >
                    {loading ? (
                        <>
                            <RefreshCw className='w-4 h-4 mr-2 animate-spin' />
                        </>
                    ) : (
                        "Generate Content"
                    )}
                </Button>
            </div>
            <p className='text-white/60 text-xs'>
                Generate content using your saved prompts. Content expires daily
                at 8PM.
                {!hasGeneratedContent && (
                    <span className='text-yellow-400 block mt-1'>
                        ⚠️ Generate content first to enable preview
                    </span>
                )}
            </p>
        </div>
    )
}
