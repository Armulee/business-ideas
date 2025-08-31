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
    const response: PollResponse = {
      widgetId: widget.id,
      userId: 'current-user', // This would come from auth context
      selectedOption: option,
      submittedAt: new Date()
    }
    
    setHasSubmitted(true)
    onResponse?.(response)
  }

  const showResults = hasSubmitted || isAuthor

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          {widget.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {widget.options.map((option) => {
          const result = results?.find(r => r.option === option)
          const isSelected = selectedOption === option
          
          return (
            <div key={option} className="space-y-2">
              <Button
                variant={isSelected ? "default" : "outline"}
                className="w-full justify-start relative"
                onClick={() => handleOptionSelect(option)}
                disabled={hasSubmitted}
              >
                {isSelected && <Check className="w-4 h-4 mr-2" />}
                <span className="flex-1 text-left">{option}</span>
                {showResults && result && (
                  <span className="text-sm opacity-75">
                    {result.percentage}% ({result.count})
                  </span>
                )}
              </Button>
              
              {showResults && result && (
                <Progress value={result.percentage} className="h-2" />
              )}
            </div>
          )
        })}
        
        {hasSubmitted && (
          <div className="text-center text-sm text-gray-600 mt-4">
            <Check className="w-4 h-4 inline mr-1" />
            Thanks for voting!
          </div>
        )}
      </CardContent>
    </Card>
  )
}