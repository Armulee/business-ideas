// Main preview-editable renderer
import { Widget } from "../types"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { EditablePollWidget } from "./poll-widget"
import { EditableSliderWidget } from "./slider-widget"
import { EditableRatingWidget } from "./rating-widget"
import { EditableVisualPickWidget } from "./visual-pick-widget"
import { EditablePrivateCommentWidget } from "./private-comment-widget"
import { EditableChecklistWidget } from "./checklist-widget"
import { EditableSwiperWidget } from "./swiper-widget"
import { EditableCTAWidget } from "./cta-widget"
import { EditableReorderWidget } from "./reorder-widget"
import { EditableRangeWidget } from "./range-widget"
import { EditableSocialMediasWidget } from "./social-medias-widget"
import { EditableFollowWidget } from "./follow-widget"
import { EditableSummarizerWidget } from "./summarizer-widget"
import { EditableMilestoneWidget } from "./milestone-widget"

interface PreviewEditableRendererProps {
    widget: Widget
    onChange: (updatedWidget: Widget) => void
    onRemove?: () => void
    className?: string
}

export function PreviewEditableRenderer({
    widget,
    onChange,
    onRemove,
    className,
}: PreviewEditableRendererProps) {
    const renderWidget = () => {
        switch (widget.type) {
            case "poll":
                return (
                    <EditablePollWidget
                        widget={widget}
                        onChange={onChange}
                        className={className}
                    />
                )
            case "slider":
                return (
                    <EditableSliderWidget
                        widget={widget}
                        onChange={onChange}
                        className={className}
                    />
                )
            case "rating":
                return (
                    <EditableRatingWidget
                        widget={widget}
                        onChange={onChange}
                        className={className}
                    />
                )
            case "visual-pick":
                return (
                    <EditableVisualPickWidget
                        widget={widget}
                        onChange={onChange}
                        className={className}
                    />
                )
            case "private-comment":
                return (
                    <EditablePrivateCommentWidget
                        widget={widget}
                        onChange={onChange}
                        className={className}
                    />
                )
            case "checklist":
                return (
                    <EditableChecklistWidget
                        widget={widget}
                        onChange={onChange}
                        className={className}
                    />
                )
            case "swiper":
                return (
                    <EditableSwiperWidget
                        widget={widget}
                        onChange={onChange}
                        className={className}
                    />
                )
            case "cta":
                return (
                    <EditableCTAWidget
                        widget={widget}
                        onChange={onChange}
                        className={className}
                    />
                )
            case "reorder":
                return (
                    <EditableReorderWidget
                        widget={widget}
                        onChange={onChange}
                        className={className}
                    />
                )
            case "range":
                return (
                    <EditableRangeWidget
                        widget={widget}
                        onChange={onChange}
                        className={className}
                    />
                )
            case "social-medias":
                return (
                    <EditableSocialMediasWidget
                        widget={widget}
                        onChange={onChange}
                        className={className}
                    />
                )
            case "follow":
                return (
                    <EditableFollowWidget
                        widget={widget}
                        onChange={onChange}
                        className={className}
                    />
                )
            case "summarizer":
                return (
                    <EditableSummarizerWidget
                        widget={widget}
                        onChange={onChange}
                        className={className}
                    />
                )
            case "milestone":
                return (
                    <EditableMilestoneWidget
                        widget={widget}
                        onChange={onChange}
                        className={className}
                    />
                )
            default:
                return (
                    <div className='p-4 bg-white/10 rounded-lg border border-white/20'>
                        <p className='text-white/70 text-center'>
                            Widget is coming soon...
                        </p>
                    </div>
                )
        }
    }

    return (
        <div className={`relative group ${className || ''}`}>
            {/* Remove Button */}
            {onRemove && (
                <Button
                    variant='destructive'
                    size='sm'
                    className='absolute -top-2 -right-2 w-8 h-8 p-0 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600'
                    onClick={onRemove}
                >
                    <X className='w-4 h-4' />
                </Button>
            )}
            {/* Widget Content */}
            {renderWidget()}
        </div>
    )
}

// Export all preview-editable widgets
export { EditablePollWidget } from "./poll-widget"
export { EditableSliderWidget } from "./slider-widget"
export { EditableRatingWidget } from "./rating-widget"
export { EditableVisualPickWidget } from "./visual-pick-widget"
export { EditablePrivateCommentWidget } from "./private-comment-widget"
export { EditableChecklistWidget } from "./checklist-widget"
export { EditableSwiperWidget } from "./swiper-widget"
export { EditableCTAWidget } from "./cta-widget"
export { EditableReorderWidget } from "./reorder-widget"
export { EditableRangeWidget } from "./range-widget"
export { EditableSocialMediasWidget } from "./social-medias-widget"
export { EditableFollowWidget } from "./follow-widget"
export { EditableSummarizerWidget } from "./summarizer-widget"
export { EditableMilestoneWidget } from "./milestone-widget"
