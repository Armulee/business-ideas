// Main widget system exports
export * from './types'
export * from './config'
export * from './utils'

// Widget components
export * from './preview'
export * from './interactive'
export { WidgetSelector } from './widget-selector'
export { AddWidgetButton } from './add-widget-button'
export { PreviewEditableRenderer } from './preview-editable'
export { InteractiveSeparateRenderer } from './interactive-separate'

// Widget renderer that automatically selects preview vs interactive
import { Widget, WidgetResponse, WidgetMode } from './types'
import { PreviewWidgetRenderer } from './preview'
import { InteractiveWidgetRenderer } from './interactive'

interface WidgetRendererProps {
  widget: Widget
  mode: WidgetMode
  userResponse?: WidgetResponse
  onResponse?: (response: WidgetResponse) => void
  isAuthor?: boolean
  className?: string
  results?: {
    pollResults?: { option: string; count: number; percentage: number }[]
    averageRating?: number
    totalRatings?: number
  }
}

export function WidgetRenderer({
  widget,
  mode,
  userResponse,
  onResponse,
  isAuthor,
  className,
  results
}: WidgetRendererProps) {
  if (mode === 'preview') {
    return (
      <PreviewWidgetRenderer
        widget={widget}
        className={className}
      />
    )
  }

  return (
    <InteractiveWidgetRenderer
      widget={widget}
      userResponse={userResponse}
      onResponse={onResponse}
      isAuthor={isAuthor}
      className={className}
      results={results}
    />
  )
}