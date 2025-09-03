"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

interface ErrorStateProps {
    error: string | null
}

export default function ErrorState({ error }: ErrorStateProps) {
    return (
        <div className='py-8 space-y-6'>
            <div className='max-w-4xl mx-auto'>
                <div className='flex items-start gap-4 mb-8'>
                    <Link href='/admin/orchestration/content'>
                        <Button variant='outline' size='sm' className='button'>
                            <ArrowLeft className='w-4 h-4 mr-2' />
                            Back to Orchestration
                        </Button>
                    </Link>
                    <h1 className='text-white text-2xl font-bold'>
                        Generated Content Preview
                    </h1>
                </div>

                <Card className='glassmorphism bg-red-900/20 border-red-500/30'>
                    <CardContent className='p-8 text-center'>
                        <div className='text-red-400 text-lg mb-4'>
                            {error || "No content available"}
                        </div>
                        <p className='text-white/60 mb-6'>
                            Content may have expired or hasn&apos;t been
                            generated yet. Please generate new content from the
                            orchestration page.
                        </p>
                        <Link href='/admin/orchestration/content'>
                            <Button className='bg-blue-600 hover:bg-blue-700'>
                                Go to Orchestration
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
