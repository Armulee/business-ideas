import { PollWidget } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3 } from 'lucide-react'

interface PreviewPollWidgetProps {
  widget: PollWidget
}

export function PreviewPollWidget({ widget }: PreviewPollWidgetProps) {
  return (
    <Card className="w-full glassmorphism bg-white/10 border-white/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <BarChart3 className="w-5 h-5" />
          {widget.question || 'What do you think about this idea?'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {(widget.options.length > 0 ? widget.options : ['Option 1', 'Option 2', 'Option 3']).map((option, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full justify-start text-left bg-white/5 border-white/20 text-white hover:bg-white/10"
            disabled
          >
            <span className="w-4 h-4 rounded-full border-2 border-white/40 mr-3" />
            {option}
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}