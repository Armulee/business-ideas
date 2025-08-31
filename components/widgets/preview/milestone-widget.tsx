import { MilestoneWidget } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Target, Calendar } from 'lucide-react'

interface PreviewMilestoneWidgetProps {
  widget: MilestoneWidget
}

export function PreviewMilestoneWidget({ widget }: PreviewMilestoneWidgetProps) {
  const progress = widget.currentProgress || 65
  const targetDate = new Date(widget.targetDate)
  const now = new Date()
  const daysRemaining = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Card className="w-full glassmorphism bg-white/10 border-white/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <Target className="w-5 h-5" />
          {widget.question || widget.topic || 'Milestone Progress'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-white/80 text-sm">Progress</span>
            <span className="text-white font-semibold">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="flex items-center gap-2 text-white/70">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">
            {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Target date passed'}
          </span>
        </div>

        {widget.description && (
          <p className="text-white/80 text-sm bg-white/5 p-3 rounded">
            {widget.description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}