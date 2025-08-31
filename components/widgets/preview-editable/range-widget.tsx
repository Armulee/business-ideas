import { RangeWidget } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Hash } from 'lucide-react'

interface EditableRangeWidgetProps {
  widget: RangeWidget
  onChange: (updatedWidget: RangeWidget) => void
  className?: string
}

export function EditableRangeWidget({ widget, onChange, className }: EditableRangeWidgetProps) {
  const updateWidget = (updates: Partial<RangeWidget>) => {
    onChange({ ...widget, ...updates })
  }

  return (
    <div className={className}>
      <Card className="glassmorphism bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Hash className="w-5 h-5" />
            Range Configuration
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <Label className="text-white">Question *</Label>
            <Input
              value={widget.question}
              onChange={(e) => updateWidget({ question: e.target.value })}
              placeholder="What numeric range do you want?"
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={widget.isRequired || false}
              onCheckedChange={(checked) => updateWidget({ isRequired: checked })}
            />
            <Label className="text-white">Required response</Label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-white">Min Value</Label>
              <Input
                type="number"
                value={widget.min || 0}
                onChange={(e) => updateWidget({ min: parseInt(e.target.value) || 0 })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Max Value</Label>
              <Input
                type="number"
                value={widget.max || 100}
                onChange={(e) => updateWidget({ max: parseInt(e.target.value) || 100 })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-white font-medium mb-3">Preview:</h4>
            <p className="text-white text-sm mb-3">{widget.question || 'Your question will appear here'}</p>
            <Input
              type="number"
              min={widget.min || 0}
              max={widget.max || 100}
              placeholder={`Enter a number between ${widget.min || 0} and ${widget.max || 100}`}
              className="bg-white/10 border-white/20 text-white"
              disabled
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}