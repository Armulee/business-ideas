import { SliderWidget } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Sliders } from 'lucide-react'

interface EditableSliderWidgetProps {
  widget: SliderWidget
  onChange: (updatedWidget: SliderWidget) => void
  className?: string
}

export function EditableSliderWidget({ widget, onChange, className }: EditableSliderWidgetProps) {
  const updateWidget = (updates: Partial<SliderWidget>) => {
    onChange({ ...widget, ...updates })
  }

  const min = widget.min || 0
  const max = widget.max || 100

  return (
    <div className={className}>
      <Card className="glassmorphism bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sliders className="w-5 h-5" />
            Slider Configuration
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

          {/* Range Settings */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-white">Min Value</Label>
              <Input
                type="number"
                value={min}
                onChange={(e) => updateWidget({ min: parseInt(e.target.value) || 0 })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Max Value</Label>
              <Input
                type="number"
                value={max}
                onChange={(e) => updateWidget({ max: parseInt(e.target.value) || 100 })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>

          {/* Unit */}
          <div>
            <Label className="text-white">Unit (optional)</Label>
            <Input
              value={widget.unit || ''}
              onChange={(e) => updateWidget({ unit: e.target.value })}
              placeholder="e.g., %, points, stars"
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          {/* Preview */}
          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-white font-medium mb-3">Preview:</h4>
            <div className="space-y-3">
              <p className="text-white text-sm">{widget.question || 'Your question will appear here'}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-white/60 text-xs">
                  <span>{min}{widget.unit}</span>
                  <span>{max}{widget.unit}</span>
                </div>
                <Slider
                  defaultValue={[(min + max) / 2]}
                  max={max}
                  min={min}
                  step={widget.step || 1}
                  className="w-full"
                  disabled
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}