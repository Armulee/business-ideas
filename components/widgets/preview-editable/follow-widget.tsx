import { FollowWidget } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'

interface EditableFollowWidgetProps {
  widget: FollowWidget
  onChange: (updatedWidget: FollowWidget) => void
  className?: string
}

export function EditableFollowWidget({ widget, onChange, className }: EditableFollowWidgetProps) {
  const updateWidget = (updates: Partial<FollowWidget>) => {
    onChange({ ...widget, ...updates })
  }

  return (
    <div className={className}>
      <Card className="glassmorphism bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Follow Profile Configuration
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <Label className="text-white">Call to Action *</Label>
            <Input
              value={widget.question}
              onChange={(e) => updateWidget({ question: e.target.value })}
              placeholder="Follow my profile for more content!"
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
            <Label className="text-white">Profile Username</Label>
            <Input
              value={widget.userId || ''}
              onChange={(e) => updateWidget({ userId: e.target.value })}
              placeholder="@username"
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-white font-medium mb-3">Preview:</h4>
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-white/20 rounded-full mx-auto"></div>
              <div>
                <p className="text-white font-medium">{widget.userId || '@username'}</p>
                <p className="text-white/70 text-sm">{widget.question || 'Follow my profile for more content!'}</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <UserPlus className="w-4 h-4 mr-2" />
                Follow
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}