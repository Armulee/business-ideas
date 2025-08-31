import { MilestoneWidget } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Target } from 'lucide-react'

interface EditableMilestoneWidgetProps {
  widget: MilestoneWidget
  onChange: (updatedWidget: MilestoneWidget) => void
  className?: string
}

export function EditableMilestoneWidget({ widget, onChange, className }: EditableMilestoneWidgetProps) {
  const updateWidget = (updates: Partial<MilestoneWidget>) => {
    onChange({ ...widget, ...updates })
  }

  return (
    <div className={className}>
      <Card className="glassmorphism bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5" />
            Milestone Configuration
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <Label className="text-white">Title *</Label>
            <Input
              value={widget.question}
              onChange={(e) => updateWidget({ question: e.target.value })}
              placeholder="What milestone are you tracking?"
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
            <Label className="text-white">Topic/Goal</Label>
            <Input
              value={widget.topic || ''}
              onChange={(e) => updateWidget({ topic: e.target.value })}
              placeholder="What are you working towards?"
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div>
            <Label className="text-white">Target Date</Label>
            <Input
              type="date"
              value={widget.targetDate ? new Date(widget.targetDate).toISOString().split('T')[0] : ''}
              onChange={(e) => updateWidget({ targetDate: new Date(e.target.value) })}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div>
            <Label className="text-white">Description</Label>
            <Textarea
              value={widget.description || ''}
              onChange={(e) => updateWidget({ description: e.target.value })}
              placeholder="Describe what you want to achieve"
              className="bg-white/10 border-white/20 text-white"
              rows={2}
            />
          </div>

          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-white font-medium mb-3">Preview:</h4>
            <div className="space-y-3">
              <h3 className="text-white text-lg font-semibold">{widget.question || 'Your milestone title'}</h3>
              {widget.topic && (
                <p className="text-blue-400 text-sm font-medium">Goal: {widget.topic}</p>
              )}
              {widget.description && (
                <p className="text-white/70 text-sm">{widget.description}</p>
              )}
              {widget.targetDate && (
                <p className="text-yellow-400 text-sm">
                  Target: {new Date(widget.targetDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}