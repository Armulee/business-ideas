"use client"

import type React from "react"

// import { useState } from "react"
import { X, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Update the WidgetBaseProps interface
interface WidgetBaseProps {
    id: string
    title: string
    onRemove: () => void
    children: React.ReactNode
    allowEdit?: boolean
    onEdit?: () => void
    dragAttributes?: React.HTMLAttributes<HTMLDivElement>
    isDragging?: boolean
}

// Update the WidgetBase component
export default function WidgetBase({
    id,
    onRemove,
    children,
    allowEdit = false,
    onEdit,
    dragAttributes,
    isDragging = false,
}: WidgetBaseProps) {
    // const [isHovering, setIsHovering] = useState(false)

    return (
        <div
            id={id}
            {...dragAttributes} // Apply drag attributes to the entire widget
            className={`glassmorphism px-6 pb-6 pt-12 relative overflow-hidden h-full ${
                isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
        >
            <div className='absolute top-0 right-3 flex items-center mb-3'>
                {allowEdit ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                type='button'
                                variant='ghost'
                                size='icon'
                                className='h-8 w-8 text-white/70 hover:text-white hover:bg-white/10'
                            >
                                <MoreHorizontal className='h-4 w-4' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align='end'
                            className='bg-gray-800/95 backdrop-blur-md border-white/20 text-white'
                        >
                            <DropdownMenuItem
                                onClick={onEdit}
                                className='cursor-pointer hover:bg-white/10'
                            >
                                Edit Widget
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <div />
                )}

                <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    onClick={(e) => {
                        e.stopPropagation()
                        onRemove()
                    }}
                    className='h-8 w-8 text-white/70 hover:text-white hover:bg-white/10 z-50'
                >
                    <X className='h-4 w-4' />
                </Button>
            </div>

            <div className='h-[calc(100%-2.5rem)]'>{children}</div>
        </div>
    )
}
