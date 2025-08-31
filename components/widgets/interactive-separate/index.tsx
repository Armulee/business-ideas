// Export all interactive widgets
export { InteractivePollWidget } from './poll-widget'
export { InteractiveSliderWidget } from './slider-widget'
export { InteractiveRatingWidget } from './rating-widget'

// Placeholder exports for remaining widgets - these will need to be created
import { Widget, WidgetResponse, PollResponse, SliderResponse, RatingResponse } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Simple placeholder component for widgets that haven't been built yet
function PlaceholderWidget({ widget }: { widget: Widget }) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{widget.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-gray-600">
          Interactive {widget.type} widget coming soon...
        </p>
      </CardContent>
    </Card>
  )
}

// Export placeholder components for remaining widgets
export const InteractiveVisualPickWidget = ({ widget }: { widget: Widget }) => <PlaceholderWidget widget={widget} />
export const InteractivePrivateCommentWidget = ({ widget }: { widget: Widget }) => <PlaceholderWidget widget={widget} />
export const InteractiveChecklistWidget = ({ widget }: { widget: Widget }) => <PlaceholderWidget widget={widget} />
export const InteractiveSwiperWidget = ({ widget }: { widget: Widget }) => <PlaceholderWidget widget={widget} />
export const InteractiveCTAWidget = ({ widget }: { widget: Widget }) => <PlaceholderWidget widget={widget} />
export const InteractiveReorderWidget = ({ widget }: { widget: Widget }) => <PlaceholderWidget widget={widget} />
export const InteractiveRangeWidget = ({ widget }: { widget: Widget }) => <PlaceholderWidget widget={widget} />
export const InteractiveSocialMediasWidget = ({ widget }: { widget: Widget }) => <PlaceholderWidget widget={widget} />
export const InteractiveFollowWidget = ({ widget }: { widget: Widget }) => <PlaceholderWidget widget={widget} />
export const InteractiveSummarizerWidget = ({ widget }: { widget: Widget }) => <PlaceholderWidget widget={widget} />
export const InteractiveMilestoneWidget = ({ widget }: { widget: Widget }) => <PlaceholderWidget widget={widget} />

// Main interactive renderer
import { InteractivePollWidget } from './poll-widget'
import { InteractiveSliderWidget } from './slider-widget'  
import { InteractiveRatingWidget } from './rating-widget'

interface InteractiveSeparateRendererProps {
  widget: Widget
  userResponse?: WidgetResponse
  onResponse?: (response: WidgetResponse) => void
  isAuthor?: boolean
  className?: string
  results?: {
    pollResults?: { option: string; count: number; percentage: number }[]
    averageRating?: number
    totalRatings?: number
  }
}

export function InteractiveSeparateRenderer({ 
  widget, 
  userResponse,
  onResponse,
  isAuthor,
  className,
  results
}: InteractiveSeparateRendererProps) {
  const renderWidget = () => {
    switch (widget.type) {
      case 'poll':
        return (
          <InteractivePollWidget 
            widget={widget}
            userResponse={userResponse as PollResponse}
            onResponse={onResponse}
            isAuthor={isAuthor}
            results={results?.pollResults}
          />
        )
      
      case 'slider':
        return (
          <InteractiveSliderWidget 
            widget={widget}
            userResponse={userResponse as SliderResponse}
            onResponse={onResponse}
          />
        )
      
      case 'rating':
        return (
          <InteractiveRatingWidget 
            widget={widget}
            userResponse={userResponse as RatingResponse}
            onResponse={onResponse}
            averageRating={results?.averageRating}
            totalRatings={results?.totalRatings}
          />
        )
      
      default:
        return <PlaceholderWidget widget={widget} />
    }
  }

  return (
    <div className={className}>
      {renderWidget()}
    </div>
  )
}