import { CTAWidget } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { MousePointerClick } from 'lucide-react'

interface EditableCTAWidgetProps {
  widget: CTAWidget
  onChange: (updatedWidget: CTAWidget) => void
  className?: string
}

export function EditableCTAWidget({ widget, onChange, className }: EditableCTAWidgetProps) {
  const updateWidget = (updates: Partial<CTAWidget>) => {
    onChange({ ...widget, ...updates })
  }

  return (
    <div className={className}>
      <Card className="glassmorphism bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MousePointerClick className="w-5 h-5" />
            Call-to-Action Configuration
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <Label className="text-white">Title *</Label>
            <Input
              value={widget.question}
              onChange={(e) => updateWidget({ question: e.target.value })}
              placeholder="What's your call to action?"
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
            <Label className="text-white">Button Text</Label>
            <Input
              value={widget.buttonText || ''}
              onChange={(e) => updateWidget({ buttonText: e.target.value })}
              placeholder="Click Here"
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div>
            <Label className="text-white">Button Link</Label>
            <Input
              value={widget.buttonLink || ''}
              onChange={(e) => updateWidget({ buttonLink: e.target.value })}
              placeholder="https://example.com"
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div>
            <Label className="text-white">Description (optional)</Label>
            <Textarea
              value={widget.description || ''}
              onChange={(e) => updateWidget({ description: e.target.value })}
              placeholder="Additional context for your call-to-action"
              className="bg-white/10 border-white/20 text-white"
              rows={2}
            />
          </div>

          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-white font-medium mb-3">Preview:</h4>
            <div className="space-y-3 text-center">
              <h3 className="text-white text-lg font-semibold">{widget.question || 'Your call to action title'}</h3>
              {widget.description && (
                <p className="text-white/70 text-sm">{widget.description}</p>
              )}
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                {widget.buttonText || 'Click Here'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}