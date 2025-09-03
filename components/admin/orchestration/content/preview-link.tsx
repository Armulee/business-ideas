"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

interface PreviewLinkProps {
    checkingContent: boolean
    hasGeneratedContent: boolean
}

export default function PreviewLink({
    checkingContent,
    hasGeneratedContent,
}: PreviewLinkProps) {
    return (
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
    )
}