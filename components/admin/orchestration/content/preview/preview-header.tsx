"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw, Calendar, Clock } from "lucide-react"

interface PreviewHeaderProps {
    onRegenerate: () => void
    regenerating?: boolean
    generatedAt?: string
}

export default function PreviewHeader({
    onRegenerate,
    regenerating = false,
    generatedAt,
}: PreviewHeaderProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString()
    }

    return (
        <div className='flex flex-col gap-4 mb-8'>
            <div className='flex items-center justify-between'>
                <Link href='/admin/orchestration/content'>
                    <Button variant='outline' size='sm' className='button'>
                        <ArrowLeft className='w-4 h-4 mr-2' />
                        Back to Orchestration
                    </Button>
                </Link>
                <button
                    onClick={onRegenerate}
                    disabled={regenerating}
                    className='flex items-center gap-2 text-white/60 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    <RefreshCw
                        className={`w-4 h-4 ${regenerating ? "animate-spin" : ""}`}
                    />
                    <span className='text-sm'>
                        {regenerating ? "Regenerating..." : "Regenerate"}
                    </span>
                </button>
            </div>
            <div className='w-full text-center'>
                <h1 className='text-white text-2xl font-bold'>
                    Generated Content Preview
                </h1>
                {generatedAt && (
                    <div className='w-full flex flex-col gap-1 justify-center items-center text-white/60 text-sm mt-2'>
                        <div className='flex items-center gap-1 mb-1'>
                            <Calendar className='w-4 h-4' />
                            Generated on {formatDate(generatedAt)}
                        </div>
                        <div className='flex items-center gap-1'>
                            <Clock className='w-4 h-4' />
                            Expires at 8:00 PM today
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
