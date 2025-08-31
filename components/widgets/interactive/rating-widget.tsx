import { useState } from 'react'
import { RatingWidget, RatingResponse } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Star, Flame, Heart, Check } from 'lucide-react'

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
  isAuthor,
  averageRating,
  totalRatings 
}: InteractiveRatingWidgetProps) {
  const maxRating = widget.maxRating || 5
  const iconType = widget.iconType || 'fire'
  
  const [rating, setRating] = useState<number>(userResponse?.rating || 0)
  const [hoveredRating, setHoveredRating] = useState<number>(0)
  const [hasSubmitted, setHasSubmitted] = useState(!!userResponse)
  
  const IconComponent = iconType === 'star' ? Star : iconType === 'heart' ? Heart : Flame

  const handleRatingClick = (clickedRating: number) => {
    if (hasSubmitted) return
    
    setRating(clickedRating)
    setHasSubmitted(true)
    
    onResponse?.({
      widgetId: widget.id,
      userId: 'current-user',
      rating: clickedRating,
      submittedAt: new Date()
    })
  }

  const displayRating = hoveredRating || rating

  return (
    <Card className="w-full glassmorphism bg-white/10 border-white/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <IconComponent className="w-5 h-5" />
          {widget.question}
          {widget.isRequired && <span className="text-red-400 text-sm">*</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center gap-2">
          {Array.from({ length: maxRating }, (_, index) => {
            const ratingValue = index + 1
            const isActive = ratingValue <= displayRating
            
            return (
              <button
                key={index}
                className={`p-2 transition-all duration-200 ${
                  !hasSubmitted ? 'hover:scale-110' : ''
                }`}
                onClick={() => handleRatingClick(ratingValue)}
                onMouseEnter={() => !hasSubmitted && setHoveredRating(ratingValue)}
                onMouseLeave={() => !hasSubmitted && setHoveredRating(0)}
                disabled={hasSubmitted}
              >
                <IconComponent 
                  className={`w-8 h-8 transition-colors ${
                    isActive 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-white/40 hover:text-white/60'
                  }`} 
                />
              </button>
            )
          })}
        </div>
        
        {hasSubmitted && !isAuthor && (
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-green-400">
              <Check className="w-4 h-4" />
              <span className="text-sm">You rated: {rating} out of {maxRating}</span>
            </div>
            {averageRating && totalRatings && (
              <p className="text-white/70 text-sm">
                Average: {averageRating.toFixed(1)} ({totalRatings} rating{totalRatings !== 1 ? 's' : ''})
              </p>
            )}
          </div>
        )}
        
        {isAuthor && averageRating && totalRatings && (
          <div className="text-center">
            <p className="text-white/80">
              Average rating: <span className="font-semibold">{averageRating.toFixed(1)}</span>
            </p>
            <p className="text-white/60 text-sm">
              {totalRatings} total rating{totalRatings !== 1 ? 's' : ''}
            </p>
          </div>
        )}
        
        {!hasSubmitted && !isAuthor && rating === 0 && (
          <p className="text-center text-white/60 text-sm">
            Click to rate
          </p>
        )}
      </CardContent>
    </Card>
  )
}