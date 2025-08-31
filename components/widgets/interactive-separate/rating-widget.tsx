import { useState } from 'react'
import { RatingWidget, RatingResponse } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Star, Check } from 'lucide-react'

interface InteractiveRatingWidgetProps {
  widget: RatingWidget
  userResponse?: RatingResponse
  onResponse?: (response: RatingResponse) => void
  isAuthor?: boolean
  averageRating?: number
  totalRatings?: number
}

export function InteractiveRatingWidget({ 
  widget, 
  userResponse, 
  onResponse, 
  averageRating,
  totalRatings
}: InteractiveRatingWidgetProps) {
  const [rating, setRating] = useState<number>(userResponse?.rating || 0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [hasSubmitted, setHasSubmitted] = useState(!!userResponse)

  const maxRating = widget.maxRating || 5
  const iconType = widget.iconType || 'star'

  const handleRatingSelect = (selectedRating: number) => {
    if (hasSubmitted) return
    
    setRating(selectedRating)
    const response: RatingResponse = {
      widgetId: widget.id,
      userId: 'current-user', // This would come from auth context
      rating: selectedRating,
      submittedAt: new Date()
    }
    
    setHasSubmitted(true)
    onResponse?.(response)
  }

  const getIcon = (filled: boolean) => {
    switch (iconType) {
      case 'fire':
        return filled ? '🔥' : '🔥'
      case 'heart':
        return filled ? '❤️' : '🤍'
      default:
        return <Star className={`w-6 h-6 ${filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5" />
          {widget.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center gap-1">
          {Array.from({ length: maxRating }).map((_, index) => {
            const ratingValue = index + 1
            const filled = ratingValue <= (hoverRating || rating)
            
            return (
              <button
                key={index}
                className="transition-transform hover:scale-110 disabled:cursor-not-allowed"
                onMouseEnter={() => !hasSubmitted && setHoverRating(ratingValue)}
                onMouseLeave={() => !hasSubmitted && setHoverRating(0)}
                onClick={() => handleRatingSelect(ratingValue)}
                disabled={hasSubmitted}
              >
                {typeof getIcon(filled) === 'string' ? (
                  <span className="text-2xl">{getIcon(filled)}</span>
                ) : (
                  getIcon(filled)
                )}
              </button>
            )
          })}
        </div>

        {hasSubmitted && (
          <div className="text-center space-y-2">
            <div className="text-sm text-gray-600">
              <Check className="w-4 h-4 inline mr-1" />
              You rated: {rating} out of {maxRating}
            </div>
            {averageRating && totalRatings && (
              <div className="text-xs text-gray-500">
                Average: {averageRating.toFixed(1)} ({totalRatings} ratings)
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}