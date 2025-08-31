import { useState } from "react"
import { Plus } from "lucide-react"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { WidgetSelector } from "./widget-selector"
import { Widget } from "./types"

interface AddWidgetButtonProps {
    onWidgetSelect: (widget: Widget | null) => void
    className?: string
}

export function AddWidgetButton({
    onWidgetSelect,
    className,
}: AddWidgetButtonProps) {
    const [open, setOpen] = useState(false)

    const handleWidgetSelect = (widget: Widget | null) => {
        onWidgetSelect(widget)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div
                    className={`glassmorphism border border-white/20 rounded-lg p-8 cursor-pointer transition-all duration-300 hover:bg-white/20 hover:border-white/30 hover:shadow-xl backdrop-blur-md group ${className}`}
                >
                    <div className='flex flex-col items-center justify-center space-y-4'>
                        <div className='w-16 h-16 rounded-full bg-white/20 border border-white/30 flex items-center justify-center group-hover:bg-white/30 group-hover:scale-105 transition-all duration-300'>
                            <Plus className='w-8 h-8 text-white' />
                        </div>
                        <div className='text-center'>
                            <h3 className='text-white text-lg font-semibold mb-1'>
                                Add Widget
                            </h3>
                            <p className='text-white/70 text-sm'>
                                Add an interactive element to engage your
                                readers
                            </p>
                        </div>
                    </div>
                </div>
            </DialogTrigger>
            <WidgetSelector
                selectedWidget={null}
                onWidgetSelect={handleWidgetSelect}
                showOnlySelector={true}
            />
        </Dialog>
    )
}
