import { WidgetType, Widget } from "./types"
import { WIDGET_CONFIGS, WIDGET_CATEGORIES } from "./config"
import { createDefaultWidget } from "./utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { MiniPreview } from "./mini-preview"
import { useState } from "react"
import "swiper/css/free-mode"

interface WidgetSelectorProps {
    selectedWidget: Widget | null
    onWidgetSelect: (widget: Widget | null) => void
    showOnlySelector?: boolean
}

export function WidgetSelector({ onWidgetSelect }: WidgetSelectorProps) {
    const widgets = Object.values(WIDGET_CONFIGS)
    const [hoveredWidget, setHoveredWidget] = useState<WidgetType | null>(null)

    const handleWidgetSelect = (type: WidgetType) => {
        const newWidget = createDefaultWidget(type)
        onWidgetSelect(newWidget)
    }


    return (
        <DialogContent className='w-screen max-w-lg max-h-[80vh] overflow-y-auto glassmorphism bg-transparent'>
            <DialogHeader className='w-full'>
                <DialogTitle className='text-xl'>
                    Add Widget to Your Post
                </DialogTitle>
            </DialogHeader>

            {/* Widget Grid - Contained within dialog width */}
            <div className='w-full'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    {widgets.map((widget) => {
                        return (
                            <Button
                                key={widget.type}
                                variant='outline'
                                className='h-auto !p-8 flex flex-col justify-center text-center !hover:bg-blue-500/20 hover:text-white group button'
                                onClick={() => handleWidgetSelect(widget.type)}
                                onMouseEnter={() => setHoveredWidget(widget.type)}
                                onMouseLeave={() => setHoveredWidget(null)}
                            >
                                {/* Icon and Widget Name on same line */}
                                <div className='flex justify-center items-center gap-3 w-full'>
                                    <widget.icon className='w-6 h-6 flex-shrink-0 text-blue-500 group-hover:text-white' />
                                    <h3 className='font-medium text-base'>
                                        {widget.name}
                                    </h3>
                                </div>

                                {/* Description */}
                                <p className='text-wrap text-xs text-white/70 leading-relaxed mb-2'>
                                    {widget.description}
                                </p>

                                {/* Preview - Always visible with animation on hover */}
                                <div className='w-full'>
                                    <div className='text-xs text-white/50 mb-1'>Preview:</div>
                                    <MiniPreview 
                                        type={widget.type} 
                                        isHovered={hoveredWidget === widget.type}
                                    />
                                </div>

                                {/* Category Badge */}
                                <Badge
                                    variant='secondary'
                                    className='absolute top-0 right-0 text-xs bg-blue-500 text-white group-hover:bg-white group-hover:text-blue-500'
                                >
                                    {WIDGET_CATEGORIES[widget.category].name}
                                </Badge>
                            </Button>
                        )
                    })}
                </div>
            </div>
        </DialogContent>
    )
}
