"use client"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Flame } from "lucide-react"

interface MainContentProps {
    content?: string
}

export default function MainContent({ content }: MainContentProps) {
    if (!content) return null

    return (
        <Card className='bg-gray-800/50 border-gray-700'>
            <CardHeader className='pb-3'>
                <CardTitle className='text-white text-sm flex items-center gap-2'>
                    <Flame className='w-4 h-4 text-blue-500' />
                    Main Platform Content
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className='text-gray-300 text-sm whitespace-pre-wrap break-words'>
                    {content}
                </div>
            </CardContent>
        </Card>
    )
}