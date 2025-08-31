import { SummarizerWidget } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { List, Plus, Trash2 } from 'lucide-react'

interface EditableSummarizerWidgetProps {
  widget: SummarizerWidget
  onChange: (updatedWidget: SummarizerWidget) => void
  className?: string
}

export function EditableSummarizerWidget({ widget, onChange, className }: EditableSummarizerWidgetProps) {
  const updateWidget = (updates: Partial<SummarizerWidget>) => {
    onChange({ ...widget, ...updates })
  }

  const addPoint = () => {
    const newPoints = [...(widget.bulletPoints || []), `Point ${(widget.bulletPoints || []).length + 1}`]
    updateWidget({ bulletPoints: newPoints })
  }

  const removePoint = (index: number) => {
    const newPoints = (widget.bulletPoints || []).filter((_, i) => i !== index)
    updateWidget({ bulletPoints: newPoints })
  }

  const updatePoint = (index: number, value: string) => {
    const newPoints = [...(widget.bulletPoints || [])]
    newPoints[index] = value
    updateWidget({ bulletPoints: newPoints })
  }

  return (
    <div className={className}>
      <Card className="glassmorphism bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <List className="w-5 h-5" />
            Summarizer Configuration
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <Label className="text-white">Title *</Label>
            <Input
              value={widget.question}
              onChange={(e) => updateWidget({ question: e.target.value })}
              placeholder="Key Points Summary"
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

          <div className="space-y-3">
            <Label className="text-white">Summary Points</Label>
            {(widget.bulletPoints || []).map((point, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={point}
                  onChange={(e) => updatePoint(index, e.target.value)}
                  placeholder={`Point ${index + 1}`}
                  className="bg-white/10 border-white/20 text-white"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removePoint(index)}
                  className="border-red-400 text-red-400 hover:bg-red-400/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={addPoint}
              className="w-full border-white/20 text-white hover:bg-white/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Point
            </Button>
          </div>

          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-white font-medium mb-3">Preview:</h4>
            <h3 className="text-white font-semibold mb-3">{widget.question || 'Key Points Summary'}</h3>
            <ul className="space-y-2">
              {(widget.bulletPoints || ['Point 1', 'Point 2', 'Point 3']).map((point, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-white/60 mt-1">•</span>
                  <span className="text-white/80 text-sm">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}