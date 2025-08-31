import { ReorderWidget } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { ArrowUpDown, Plus, Trash2, GripVertical } from 'lucide-react'

interface EditableReorderWidgetProps {
  widget: ReorderWidget
  onChange: (updatedWidget: ReorderWidget) => void
  className?: string
}

export function EditableReorderWidget({ widget, onChange, className }: EditableReorderWidgetProps) {
  const updateWidget = (updates: Partial<ReorderWidget>) => {
    onChange({ ...widget, ...updates })
  }

  const addItem = () => {
    const newItems = [...(widget.items || []), `Item ${(widget.items || []).length + 1}`]
    updateWidget({ items: newItems })
  }

  const removeItem = (index: number) => {
    const newItems = (widget.items || []).filter((_, i) => i !== index)
    updateWidget({ items: newItems })
  }

  const updateItem = (index: number, value: string) => {
    const newItems = [...(widget.items || [])]
    newItems[index] = value
    updateWidget({ items: newItems })
  }

  return (
    <div className={className}>
      <Card className="glassmorphism bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ArrowUpDown className="w-5 h-5" />
            Reorder Configuration
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <Label className="text-white">Question *</Label>
            <Input
              value={widget.question}
              onChange={(e) => updateWidget({ question: e.target.value })}
              placeholder="What do you want users to prioritize?"
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
            <Label className="text-white">Items to Reorder</Label>
            {(widget.items || []).map((item, index) => (
              <div key={index} className="flex gap-2 items-center">
                <GripVertical className="w-4 h-4 text-white/50" />
                <Input
                  value={item}
                  onChange={(e) => updateItem(index, e.target.value)}
                  placeholder={`Item ${index + 1}`}
                  className="bg-white/10 border-white/20 text-white flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeItem(index)}
                  className="border-red-400 text-red-400 hover:bg-red-400/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={addItem}
              className="w-full border-white/20 text-white hover:bg-white/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>

          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-white font-medium mb-3">Preview:</h4>
            <p className="text-white text-sm mb-3">{widget.question || 'Your question will appear here'}</p>
            <div className="space-y-2">
              {(widget.items || ['Item 1', 'Item 2', 'Item 3']).map((item, index) => (
                <div key={index} className="flex items-center gap-2 bg-white/10 p-2 rounded">
                  <GripVertical className="w-4 h-4 text-white/50" />
                  <span className="text-white/80 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}