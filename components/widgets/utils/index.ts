import { Widget, WidgetType, WidgetResponse } from '../types'
import { WIDGET_CONFIGS } from '../config'
import { HelpCircle } from 'lucide-react'

// Generate unique widget ID
export const generateWidgetId = (): string => {
  return `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Create default widget based on type
export const createDefaultWidget = (type: WidgetType): Widget => {
  const baseWidget = {
    id: generateWidgetId(),
    type,
    question: '',
    isRequired: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  switch (type) {
    case 'poll':
      return {
        ...baseWidget,
        type: 'poll',
        options: ['Option 1', 'Option 2']
      }
    
    case 'slider':
      return {
        ...baseWidget,
        type: 'slider',
        min: 0,
        max: 100,
        step: 1,
        unit: ''
      }
    
    case 'rating':
      return {
        ...baseWidget,
        type: 'rating',
        maxRating: 5,
        iconType: 'fire'
      }
    
    case 'visual-pick':
      return {
        ...baseWidget,
        type: 'visual-pick',
        images: []
      }
    
    case 'private-comment':
      return {
        ...baseWidget,
        type: 'private-comment',
        placeholder: 'Share your thoughts privately...'
      }
    
    case 'checklist':
      return {
        ...baseWidget,
        type: 'checklist',
        options: ['Option 1', 'Option 2'],
        allowMultiple: true
      }
    
    case 'swiper':
      return {
        ...baseWidget,
        type: 'swiper',
        description: 'Swipe to give your feedback',
        leftAction: { text: 'No', icon: 'X' },
        rightAction: { text: 'Yes', icon: 'Check' }
      }
    
    case 'cta':
      return {
        ...baseWidget,
        type: 'cta',
        buttonText: 'Click Here',
        buttonLink: '#',
        description: 'Take action now!'
      }
    
    case 'reorder':
      return {
        ...baseWidget,
        type: 'reorder',
        items: ['Item 1', 'Item 2', 'Item 3']
      }
    
    case 'range':
      return {
        ...baseWidget,
        type: 'range',
        allowNegative: false,
        min: 0,
        max: 100,
        unit: ''
      }
    
    case 'social-medias':
      return {
        ...baseWidget,
        type: 'social-medias',
        platforms: []
      }
    
    case 'follow':
      return {
        ...baseWidget,
        type: 'follow',
        userId: '',
        showStats: true
      }
    
    case 'summarizer':
      return {
        ...baseWidget,
        type: 'summarizer',
        topic: '',
        bulletPoints: ['Key point 1', 'Key point 2']
      }
    
    case 'milestone':
      return {
        ...baseWidget,
        type: 'milestone',
        topic: '',
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        description: '',
        currentProgress: 0
      }
    
    default:
      throw new Error(`Unknown widget type: ${type}`)
  }
}

// Validate widget data
export const validateWidget = (widget: Widget): string[] => {
  const errors: string[] = []
  
  if (!widget.question.trim()) {
    errors.push('Question is required')
  }

  switch (widget.type) {
    case 'poll':
      if (widget.options.length < 2) {
        errors.push('Poll must have at least 2 options')
      }
      if (widget.options.length > 4) {
        errors.push('Poll can have maximum 4 options')
      }
      break
    
    case 'checklist':
      if (widget.options.length < 2) {
        errors.push('Checklist must have at least 2 options')
      }
      if (widget.options.length > 6) {
        errors.push('Checklist can have maximum 6 options')
      }
      break
    
    case 'summarizer':
      if (widget.bulletPoints.length > 8) {
        errors.push('Summarizer can have maximum 8 bullet points')
      }
      break
    
    case 'cta':
      if (!widget.buttonText.trim()) {
        errors.push('Button text is required')
      }
      if (!widget.buttonLink.trim()) {
        errors.push('Button link is required')
      }
      break
    
    case 'visual-pick':
      if (widget.images.length === 0) {
        errors.push('Visual pick must have at least 1 image')
      }
      break
  }

  return errors
}

// Get widget display name
export const getWidgetDisplayName = (type: WidgetType): string => {
  return WIDGET_CONFIGS[type]?.name || type
}

// Get widget icon
export const getWidgetIcon = (type: WidgetType): React.ComponentType<{ className?: string }> => {
  return WIDGET_CONFIGS[type]?.icon || HelpCircle
}

// Check if widget has responses
export const hasWidgetResponses = (responses: WidgetResponse[]): boolean => {
  return responses.length > 0
}

// Format widget response for display
export const formatWidgetResponse = (response: WidgetResponse): string => {
  switch (response.widgetId) {
    // This would be expanded based on specific response types
    default:
      return JSON.stringify(response)
  }
}

// Calculate widget completion rate
export const calculateCompletionRate = (
  totalViews: number, 
  totalResponses: number
): number => {
  if (totalViews === 0) return 0
  return Math.round((totalResponses / totalViews) * 100)
}