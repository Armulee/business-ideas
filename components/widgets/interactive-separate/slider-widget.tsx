import { useState } from 'react'
import { SliderWidget, SliderResponse } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
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
  onResponse
}: InteractiveSliderWidgetProps) {
  const [value, setValue] = useState<number[]>(
    userResponse ? [userResponse.value] : [((widget.min || 0) + (widget.max || 100)) / 2]
  )
  const [hasSubmitted, setHasSubmitted] = useState(!!userResponse)

  const handleSubmit = () => {
    if (hasSubmitted) return
    
    const response: SliderResponse = {
      widgetId: widget.id,
      userId: 'current-user', // This would come from auth context
      value: value[0],
      submittedAt: new Date()
    }
    
    setHasSubmitted(true)
    onResponse?.(response)
  }

  const min = widget.min || 0
  const max = widget.max || 100

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sliders className="w-5 h-5" />
          {widget.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>{min}{widget.unit}</span>
            <span className="font-medium">
              {value[0]}{widget.unit}
            </span>
            <span>{max}{widget.unit}</span>
          </div>
          
          <Slider
            value={value}
            onValueChange={setValue}
            max={max}
            min={min}
            step={widget.step || 1}
            className="w-full"
            disabled={hasSubmitted}
          />
        </div>

        {!hasSubmitted && (
          <Button onClick={handleSubmit} className="w-full">
            Submit Response
          </Button>
        )}
        
        {hasSubmitted && (
          <div className="text-center text-sm text-gray-600">
            <Check className="w-4 h-4 inline mr-1" />
            Response submitted: {value[0]}{widget.unit}
          </div>
        )}
      </CardContent>
    </Card>
  )
}