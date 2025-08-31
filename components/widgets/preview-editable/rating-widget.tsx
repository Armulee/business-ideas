import { RatingWidget } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Star } from 'lucide-react'

interface EditableRatingWidgetProps {
  widget: RatingWidget
  onChange: (updatedWidget: RatingWidget) => void
  className?: string
}

export function EditableRatingWidget({ widget, onChange, className }: EditableRatingWidgetProps) {
  const updateWidget = (updates: Partial<RatingWidget>) => {
    onChange({ ...widget, ...updates })
  }

  const maxRating = widget.maxRating || 5
  const iconType = widget.iconType || 'star'

  const getIconEmoji = () => {
    switch (iconType) {
      case 'fire': return '🔥'
      case 'heart': return '❤️'
      default: return '⭐'
    }
  }

  return (
    <div className={className}>
      <Card className="glassmorphism bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Star className="w-5 h-5" />
            Rating Configuration
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Question */}
          <div>
            <Label className="text-white">Question *</Label>
            <Input
              value={widget.question}
              onChange={(e) => updateWidget({ question: e.target.value })}
              placeholder="What do you want to ask your readers?"
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          {/* Required toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              checked={widget.isRequired || false}
              onCheckedChange={(checked) => updateWidget({ isRequired: checked })}
            />
            <Label className="text-white">Required response</Label>
          </div>

          {/* Rating Settings */}
          <div>
            <Label className="text-white">Max Rating</Label>
            <Input
              type="number"
              min="3"
              max="10"
              value={maxRating}
              onChange={(e) => updateWidget({ maxRating: parseInt(e.target.value) || 5 })}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          {/* Icon Type */}
          <div>
            <Label className="text-white">Icon Type</Label>
            <select
              value={iconType}
              onChange={(e) => updateWidget({ iconType: e.target.value as 'fire' | 'star' | 'heart' })}
              className="w-full p-2 bg-white/10 border border-white/20 rounded-md text-white"
            >
              <option value="fire">🔥 Fire</option>
              <option value="star">⭐ Star</option>
              <option value="heart">❤️ Heart</option>
            </select>
          </div>

          {/* Preview */}
          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-white font-medium mb-3">Preview:</h4>
            <div className="space-y-3">
              <p className="text-white text-sm">{widget.question || 'Your question will appear here'}</p>
              <div className="flex gap-1">
                {Array.from({ length: maxRating }).map((_, index) => (
                  <span key={index} className="text-xl cursor-pointer hover:opacity-80">
                    {getIconEmoji()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}