import { PollWidget } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { BarChart3, Plus, Trash2 } from 'lucide-react'

interface EditablePollWidgetProps {
  widget: PollWidget
  onChange: (updatedWidget: PollWidget) => void
  className?: string
}

export function EditablePollWidget({ widget, onChange, className }: EditablePollWidgetProps) {
  const updateWidget = (updates: Partial<PollWidget>) => {
    onChange({ ...widget, ...updates })
  }

  const addOption = () => {
    if (widget.options.length < 4) {
      const newOptions = [...widget.options, `Option ${widget.options.length + 1}`]
      updateWidget({ options: newOptions })
    }
  }

  const removeOption = (index: number) => {
    if (widget.options.length > 2) {
      const newOptions = widget.options.filter((_, i) => i !== index)
      updateWidget({ options: newOptions })
    }
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...widget.options]
    newOptions[index] = value
    updateWidget({ options: newOptions })
  }

  return (
    <div className={className}>
      <Card className="glassmorphism bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Poll Configuration
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

          {/* Options */}
          <div className="space-y-3">
            <Label className="text-white">Poll Options (Max 4)</Label>
            {widget.options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="bg-white/10 border-white/20 text-white"
                />
                {widget.options.length > 2 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeOption(index)}
                    className="border-red-400 text-red-400 hover:bg-red-400/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            {widget.options.length < 4 && (
              <Button
                variant="outline"
                onClick={addOption}
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Option
              </Button>
            )}
          </div>

          {/* Preview */}
          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-white font-medium mb-3">Preview:</h4>
            <div className="space-y-2">
              <p className="text-white text-sm">{widget.question || 'Your question will appear here'}</p>
              {widget.options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border border-white/30"></div>
                  <span className="text-white/80 text-sm">{option}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}