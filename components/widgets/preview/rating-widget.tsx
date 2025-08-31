import { RatingWidget } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Star, Flame, Heart } from 'lucide-react'

interface PreviewRatingWidgetProps {
  widget: RatingWidget
}

export function PreviewRatingWidget({ widget }: PreviewRatingWidgetProps) {
  const maxRating = widget.maxRating || 5
  const iconType = widget.iconType || 'fire'
  
  const IconComponent = iconType === 'star' ? Star : iconType === 'heart' ? Heart : Flame

  return (
    <Card className="w-full glassmorphism bg-white/10 border-white/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <IconComponent className="w-5 h-5" />
          {widget.question || 'How would you rate this?'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center gap-2">
          {Array.from({ length: maxRating }, (_, index) => (
            <button
              key={index}
              className="p-2 hover:scale-110 transition-transform"
              disabled
            >
              <IconComponent 
                className={`w-8 h-8 ${
                  index < 3 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-white/40'
                }`} 
              />
            </button>
          ))}
        </div>
        <p className="text-center mt-3 text-white/70 text-sm">
          3 out of {maxRating}
        </p>
      </CardContent>
    </Card>
  )
}