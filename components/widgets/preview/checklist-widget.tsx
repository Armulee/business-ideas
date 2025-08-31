import { ChecklistWidget } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckSquare, Square } from 'lucide-react'

interface PreviewChecklistWidgetProps {
  widget: ChecklistWidget
}

export function PreviewChecklistWidget({ widget }: PreviewChecklistWidgetProps) {
  const options = widget.options.length > 0 ? widget.options : ['Option 1', 'Option 2', 'Option 3']

  return (
    <Card className="w-full glassmorphism bg-white/10 border-white/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <CheckSquare className="w-5 h-5" />
          {widget.question || 'Select all that apply'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {options.map((option, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-2 rounded hover:bg-white/5 cursor-pointer"
          >
            {index === 0 || index === 2 ? (
              <CheckSquare className="w-5 h-5 text-blue-400" />
            ) : (
              <Square className="w-5 h-5 text-white/40" />
            )}
            <span className={`text-white ${index === 0 || index === 2 ? 'font-medium' : 'text-white/70'}`}>
              {option}
            </span>
          </div>
        ))}
        {widget.allowMultiple && (
          <p className="text-xs text-white/60 mt-3">
            Multiple selections allowed
          </p>
        )}
      </CardContent>
    </Card>
  )
}