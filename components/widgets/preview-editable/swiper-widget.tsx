import { SwiperWidget } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ArrowLeftRight } from 'lucide-react'

interface EditableSwiperWidgetProps {
  widget: SwiperWidget
  onChange: (updatedWidget: SwiperWidget) => void
  className?: string
}

export function EditableSwiperWidget({ widget, onChange, className }: EditableSwiperWidgetProps) {
  const updateWidget = (updates: Partial<SwiperWidget>) => {
    onChange({ ...widget, ...updates })
  }

  return (
    <div className={className}>
      <Card className="glassmorphism bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5" />
            Swiper Configuration
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <Label className="text-white">Question *</Label>
            <Input
              value={widget.question}
              onChange={(e) => updateWidget({ question: e.target.value })}
              placeholder="What do you want users to swipe on?"
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
            <Label className="text-white">Description</Label>
            <Textarea
              value={widget.description || ''}
              onChange={(e) => updateWidget({ description: e.target.value })}
              placeholder="Describe what users are swiping on"
              className="bg-white/10 border-white/20 text-white"
              rows={2}
            />
          </div>

          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-white font-medium mb-3">Preview:</h4>
            <div className="text-center space-y-3">
              <p className="text-white text-sm">{widget.question || 'Your question will appear here'}</p>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-white/70 text-sm">{widget.description || 'Swipe content here'}</p>
                <div className="flex justify-between mt-3 text-xs text-white/50">
                  <span>← Left Action</span>
                  <span>Right Action →</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}