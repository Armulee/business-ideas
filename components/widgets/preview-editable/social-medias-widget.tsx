import { SocialMediasWidget } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Share2 } from 'lucide-react'

interface EditableSocialMediasWidgetProps {
  widget: SocialMediasWidget
  onChange: (updatedWidget: SocialMediasWidget) => void
  className?: string
}

export function EditableSocialMediasWidget({ widget, onChange, className }: EditableSocialMediasWidgetProps) {
  const updateWidget = (updates: Partial<SocialMediasWidget>) => {
    onChange({ ...widget, ...updates })
  }

  return (
    <div className={className}>
      <Card className="glassmorphism bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Social Media Configuration
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <Label className="text-white">Title *</Label>
            <Input
              value={widget.question}
              onChange={(e) => updateWidget({ question: e.target.value })}
              placeholder="Follow me on social media"
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
            <p className="text-white text-sm mb-3">{widget.question || 'Follow me on social media'}</p>
            <div className="flex gap-3 justify-center">
              <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white text-sm">f</div>
              <div className="w-10 h-10 bg-sky-500 rounded flex items-center justify-center text-white text-sm">t</div>
              <div className="w-10 h-10 bg-pink-600 rounded flex items-center justify-center text-white text-sm">ig</div>
              <div className="w-10 h-10 bg-blue-700 rounded flex items-center justify-center text-white text-sm">in</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}