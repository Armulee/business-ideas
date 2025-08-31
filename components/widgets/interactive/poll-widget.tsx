import { useState } from 'react'
import { PollWidget, PollResponse } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { BarChart3, Check } from 'lucide-react'

interface InteractivePollWidgetProps {
  widget: PollWidget
  userResponse?: PollResponse
  onResponse?: (response: PollResponse) => void
  isAuthor?: boolean
  results?: {
    option: string
    count: number
    percentage: number
  }[]
}

export function InteractivePollWidget({ 
  widget, 
  userResponse, 
  onResponse, 
  isAuthor,
  results 
}: InteractivePollWidgetProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(
    userResponse?.selectedOption || null
  )
  const [hasSubmitted, setHasSubmitted] = useState(!!userResponse)

  const handleOptionSelect = (option: string) => {
    if (hasSubmitted) return
    
    setSelectedOption(option)
    setHasSubmitted(true)
    
    onResponse?.({
      widgetId: widget.id,
      userId: 'current-user', // This would come from auth context
      selectedOption: option,
      submittedAt: new Date()
    })
  }

  const showResults = hasSubmitted || isAuthor

  return (
    <Card className="w-full glassmorphism bg-white/10 border-white/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <BarChart3 className="w-5 h-5" />
          {widget.question}
          {widget.isRequired && <span className="text-red-400 text-sm">*</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!showResults ? (
          // Voting interface
          <>
            {widget.options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start text-left bg-white/5 border-white/20 text-white hover:bg-white/10"
                onClick={() => handleOptionSelect(option)}
              >
                <span className="w-4 h-4 rounded-full border-2 border-white/40 mr-3" />
                {option}
              </Button>
            ))}
          </>
        ) : (
          // Results interface
          <>
            {widget.options.map((option, index) => {
              const result = results?.find(r => r.option === option)
              const isSelected = selectedOption === option
              const count = result?.count || 0
              const percentage = result?.percentage || 0

              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isSelected && <Check className="w-4 h-4 text-green-400" />}
                      <span className={`text-white ${isSelected ? 'font-semibold' : ''}`}>
                        {option}
                      </span>
                    </div>
                    <div className="text-white/70 text-sm">
                      {count} vote{count !== 1 ? 's' : ''} ({percentage}%)
                    </div>
                  </div>
                  <Progress 
                    value={percentage} 
                    className={`h-2 ${isSelected ? 'bg-green-400/20' : ''}`}
                  />
                </div>
              )
            })}
            
            {hasSubmitted && !isAuthor && (
              <p className="text-center text-green-400 text-sm mt-4">
                ✓ Your vote has been recorded
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}