import { CTAWidget } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

interface PreviewCTAWidgetProps {
  widget: CTAWidget
}

export function PreviewCTAWidget({ widget }: PreviewCTAWidgetProps) {
  return (
    <Card className="w-full glassmorphism bg-white/10 border-white/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <ExternalLink className="w-5 h-5" />
          {widget.question || 'Ready to take action?'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {widget.description && (
          <p className="text-white/80 text-sm">
            {widget.description}
          </p>
        )}
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          {widget.buttonText || 'Click Here'}
        </Button>
      </CardContent>
    </Card>
  )
}