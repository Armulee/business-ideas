import { Widget } from '../types'
import { PreviewPollWidget } from './poll-widget'
import { PreviewSliderWidget } from './slider-widget'
import { PreviewRatingWidget } from './rating-widget'
import { PreviewCTAWidget } from './cta-widget'
import { PreviewChecklistWidget } from './checklist-widget'
import { PreviewMilestoneWidget } from './milestone-widget'

interface PreviewWidgetRendererProps {
  widget: Widget
  className?: string
}

export function PreviewWidgetRenderer({ widget, className }: PreviewWidgetRendererProps) {
  const renderWidget = () => {
    switch (widget.type) {
      case 'poll':
        return <PreviewPollWidget widget={widget} />
      
      case 'slider':
        return <PreviewSliderWidget widget={widget} />
      
      case 'rating':
        return <PreviewRatingWidget widget={widget} />
      
      case 'cta':
        return <PreviewCTAWidget widget={widget} />
      
      case 'checklist':
        return <PreviewChecklistWidget widget={widget} />
      
      case 'milestone':
        return <PreviewMilestoneWidget widget={widget} />
      
      default:
        return (
          <div className="p-4 bg-white/10 rounded-lg border border-white/20">
            <p className="text-white/70 text-center">
              Preview for {widget.type} widget coming soon...
            </p>
          </div>
        )
    }
  }

  return (
    <div className={className}>
      {renderWidget()}
    </div>
  )
}

// Export all preview widgets
export * from './poll-widget'
export * from './slider-widget'
export * from './rating-widget'
export * from './cta-widget'
export * from './checklist-widget'
export * from './milestone-widget'