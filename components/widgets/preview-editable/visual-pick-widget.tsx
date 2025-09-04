import { VisualPickWidget } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Image as ImageIcon } from 'lucide-react'

interface EditableVisualPickWidgetProps {
  widget: VisualPickWidget
  onChange: (updatedWidget: VisualPickWidget) => void
  className?: string
}

export function EditableVisualPickWidget({ widget, onChange, className }: EditableVisualPickWidgetProps) {
  const updateWidget = (updates: Partial<VisualPickWidget>) => {
    onChange({ ...widget, ...updates })
  }

  return (
    <div className={className}>
      <Card className="glassmorphism bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Visual Pick Configuration
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <Label className="text-white">Question *</Label>
            <Input
              value={widget.question}
              onChange={(e) => updateWidget({ question: e.target.value })}
              placeholder="What do you want users to choose between?"
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

          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-white font-medium mb-3">Preview:</h4>
            <p className="text-white text-sm mb-3">{widget.question || 'Your question will appear here'}</p>
            <p className="text-white/60 text-sm">Image upload and management coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}