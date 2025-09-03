"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"

interface LoadingStateProps {
    isRegenerating?: boolean
}

export default function LoadingState({
    isRegenerating = false,
}: LoadingStateProps) {
    return (
        <div className='py-8 space-y-6'>
            <div className='max-w-4xl mx-auto'>
                <div className='flex items-center gap-4 mb-8'>
                    <Link href='/admin/orchestration/content'>
                        <Button
                            variant='outline'
                            size='sm'
                            className='glassmorphism border-white/20'
                        >
                            <ArrowLeft className='w-4 h-4 mr-2' />
                            Back to Orchestration
                        </Button>
                    </Link>
                    <h1 className='text-white text-2xl font-bold'>
                        Generated Content Preview
                    </h1>
                </div>

                <div className='flex flex-col items-center justify-center min-h-96 space-y-4'>
                    <Loader2 className='w-8 h-8 text-blue-400 animate-spin' />

                    {isRegenerating && (
                        <div className='text-center space-y-2'>
                            <div className='text-white/60 text-sm'>
                                Regenerating all content with AI...
                            </div>
                            <div className='text-white/40 text-xs'>
                                This may take a few minutes. Please don&apos;t
                                close this page.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
