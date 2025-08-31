import { PrivateCommentWidget } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { MessageSquare } from 'lucide-react'

interface EditablePrivateCommentWidgetProps {
  widget: PrivateCommentWidget
  onChange: (updatedWidget: PrivateCommentWidget) => void
  className?: string
}

export function EditablePrivateCommentWidget({ widget, onChange, className }: EditablePrivateCommentWidgetProps) {
  const updateWidget = (updates: Partial<PrivateCommentWidget>) => {
    onChange({ ...widget, ...updates })
  }

  return (
    <div className={className}>
      <Card className="glassmorphism bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Private Comment Configuration
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <Label className="text-white">Question *</Label>
            <Input
              value={widget.question}
              onChange={(e) => updateWidget({ question: e.target.value })}
              placeholder="What do you want to ask privately?"
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

          <div>
            <Label className="text-white">Placeholder Text</Label>
            <Input
              value={widget.placeholder || ''}
              onChange={(e) => updateWidget({ placeholder: e.target.value })}
              placeholder="Enter placeholder text..."
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-white font-medium mb-3">Preview:</h4>
            <p className="text-white text-sm mb-3">{widget.question || 'Your question will appear here'}</p>
            <div className="bg-white/10 border border-white/20 rounded p-3">
              <p className="text-white/50 text-sm">{widget.placeholder || 'Enter your private comment...'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}