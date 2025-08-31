import { SliderWidget } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Sliders } from 'lucide-react'

interface PreviewSliderWidgetProps {
  widget: SliderWidget
}

export function PreviewSliderWidget({ widget }: PreviewSliderWidgetProps) {
  const min = widget.min || 0
  const max = widget.max || 100
  const defaultValue = Math.floor((min + max) / 2)

  return (
    <Card className="w-full glassmorphism bg-white/10 border-white/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <Sliders className="w-5 h-5" />
          {widget.question || 'Rate your interest level'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-white/70">
            <span>{min} {widget.unit}</span>
            <span>{max} {widget.unit}</span>
          </div>
          <Slider
            defaultValue={[defaultValue]}
            max={max}
            min={min}
            step={widget.step || 1}
            className="w-full"
            disabled
          />
          <div className="text-center">
            <span className="text-2xl font-bold text-white">
              {defaultValue} {widget.unit}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}