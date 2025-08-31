import { Widget, WidgetResponse, PollResponse, SliderResponse, RatingResponse } from '../types'
import { InteractivePollWidget } from './poll-widget'
import { InteractiveSliderWidget } from './slider-widget'
import { InteractiveRatingWidget } from './rating-widget'

interface InteractiveWidgetRendererProps {
  widget: Widget
  userResponse?: WidgetResponse
  onResponse?: (response: WidgetResponse) => void
  isAuthor?: boolean
  className?: string
  // Additional props for results/analytics
  results?: {
    pollResults?: {
      option: string
      count: number
      percentage: number
    }[]
    averageRating?: number
    totalRatings?: number
  }
}

export function InteractiveWidgetRenderer({ 
  widget, 
  userResponse,
  onResponse,
  isAuthor,
  className,
  results
}: InteractiveWidgetRendererProps) {
  const renderWidget = () => {
    switch (widget.type) {
      case 'poll':
        return (
          <InteractivePollWidget 
            widget={widget}
            userResponse={userResponse as PollResponse | undefined}
            onResponse={onResponse as ((response: PollResponse) => void) | undefined}
            isAuthor={isAuthor}
            results={results?.pollResults}
          />
        )
      
      case 'slider':
        return (
          <InteractiveSliderWidget 
            widget={widget}
            userResponse={userResponse as SliderResponse | undefined}
            onResponse={onResponse as ((response: SliderResponse) => void) | undefined}
            isAuthor={isAuthor}
          />
        )
      
      case 'rating':
        return (
          <InteractiveRatingWidget 
            widget={widget}
            userResponse={userResponse as RatingResponse | undefined}
            onResponse={onResponse as ((response: RatingResponse) => void) | undefined}
            isAuthor={isAuthor}
            averageRating={results?.averageRating}
            totalRatings={results?.totalRatings}
          />
        )
      
      default:
        return (
          <div className="p-4 bg-white/10 rounded-lg border border-white/20">
            <p className="text-white/70 text-center">
              Interactive widget for {widget.type} coming soon...
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

// Export all interactive widgets
export * from './poll-widget'
export * from './slider-widget'
export * from './rating-widget'