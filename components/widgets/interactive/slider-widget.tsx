import { useState } from 'react'
import { SliderWidget, SliderResponse } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Sliders, Check } from 'lucide-react'

interface InteractiveSliderWidgetProps {
  widget: SliderWidget
  userResponse?: SliderResponse
  onResponse?: (response: SliderResponse) => void
  isAuthor?: boolean
}

export function InteractiveSliderWidget({ 
  widget, 
  userResponse, 
  onResponse, 
  isAuthor 
}: InteractiveSliderWidgetProps) {
  const min = widget.min || 0
  const max = widget.max || 100
  const step = widget.step || 1
  
  const [value, setValue] = useState<number[]>([
    userResponse?.value || Math.floor((min + max) / 2)
  ])
  const [hasSubmitted, setHasSubmitted] = useState(!!userResponse)

  const handleSubmit = () => {
    if (hasSubmitted) return
    
    setHasSubmitted(true)
    onResponse?.({
      widgetId: widget.id,
      userId: 'current-user',
      value: value[0],
      submittedAt: new Date()
    })
  }

  return (
    <Card className="w-full glassmorphism bg-white/10 border-white/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <Sliders className="w-5 h-5" />
          {widget.question}
          {widget.isRequired && <span className="text-red-400 text-sm">*</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-white/70">
            <span>{min} {widget.unit}</span>
            <span>{max} {widget.unit}</span>
          </div>
          <Slider
            value={value}
            onValueChange={setValue}
            max={max}
            min={min}
            step={step}
            className="w-full"
            disabled={hasSubmitted}
          />
          <div className="text-center">
            <span className="text-2xl font-bold text-white">
              {value[0]} {widget.unit}
            </span>
          </div>
        </div>
        
        {!hasSubmitted && !isAuthor && (
          <Button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Submit Response
          </Button>
        )}
        
        {hasSubmitted && !isAuthor && (
          <div className="flex items-center justify-center gap-2 text-green-400">
            <Check className="w-4 h-4" />
            <span className="text-sm">Response submitted</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}