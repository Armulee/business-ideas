"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AutoHeightTextarea from "@/components/ui/auto-height-textarea"
import { Flame } from "lucide-react"

interface MainContentCardProps {
    content: string
    onContentChange: (content: string) => void
}

export default function MainContentCard({
    content,
    onContentChange,
}: MainContentCardProps) {
    return (
        <Card className='glassmorphism bg-gray-900/50 border-gray-700'>
            <CardHeader>
                <CardTitle className='text-white flex items-center gap-2'>
                    <Flame className='w-5 h-5 text-orange-500' />
                    Main Platform Content
                </CardTitle>
            </CardHeader>
            <CardContent>
                <AutoHeightTextarea
                    value={content || ""}
                    onChange={(e) => onContentChange(e.target.value)}
                    className='input'
                    placeholder='Main content...'
                />
            </CardContent>
        </Card>
    )
}
