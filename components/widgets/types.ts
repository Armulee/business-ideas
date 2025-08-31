// Widget System Types - Comprehensive definitions for all 15 widget types

export type WidgetType = 
  | 'poll'
  | 'slider' 
  | 'rating'
  | 'visual-pick'
  | 'private-comment'
  | 'checklist'
  | 'swiper'
  | 'cta'
  | 'reorder'
  | 'range'
  | 'social-medias'
  | 'follow'
  | 'summarizer'
  | 'milestone'

// Base widget interface
export interface BaseWidget {
  id: string
  type: WidgetType
  question: string
  isRequired?: boolean
  createdAt?: Date
  updatedAt?: Date
}

// Individual widget data interfaces
export interface PollWidget extends BaseWidget {
  type: 'poll'
  options: string[] // Max 4 options
}

export interface SliderWidget extends BaseWidget {
  type: 'slider'
  min?: number
  max?: number // Default 100
  step?: number
  unit?: string
}

export interface RatingWidget extends BaseWidget {
  type: 'rating'
  maxRating?: number // Default 5
  iconType?: 'fire' | 'star' | 'heart'
}

export interface VisualPickWidget extends BaseWidget {
  type: 'visual-pick'
  images: {
    id: string
    url: string
    alt: string
  }[]
}

export interface PrivateCommentWidget extends BaseWidget {
  type: 'private-comment'
  placeholder?: string
}

export interface ChecklistWidget extends BaseWidget {
  type: 'checklist'
  options: string[] // Max 6 options
  allowMultiple?: boolean
}

export interface SwiperWidget extends BaseWidget {
  type: 'swiper'
  description: string
  leftAction: {
    text: string
    icon: string
  }
  rightAction: {
    text: string
    icon: string
  }
}

export interface CTAWidget extends BaseWidget {
  type: 'cta'
  buttonText: string
  buttonLink: string
  description?: string
}

export interface ReorderWidget extends BaseWidget {
  type: 'reorder'
  items: string[]
}

export interface RangeWidget extends BaseWidget {
  type: 'range'
  allowNegative?: boolean
  min?: number
  max?: number
  unit?: string
}

export interface SocialMediasWidget extends BaseWidget {
  type: 'social-medias'
  platforms: {
    name: string
    url: string
    icon: string
  }[]
}

export interface FollowWidget extends BaseWidget {
  type: 'follow'
  userId: string
  showStats?: boolean
}

export interface SummarizerWidget extends BaseWidget {
  type: 'summarizer'
  topic?: string
  bulletPoints: string[] // Max 8 bullets
}

export interface MilestoneWidget extends BaseWidget {
  type: 'milestone'
  topic?: string
  targetDate: Date
  description: string
  currentProgress?: number // 0-100
}

// Union type for all widgets
export type Widget = 
  | PollWidget 
  | SliderWidget 
  | RatingWidget 
  | VisualPickWidget 
  | PrivateCommentWidget 
  | ChecklistWidget 
  | SwiperWidget 
  | CTAWidget 
  | ReorderWidget 
  | RangeWidget 
  | SocialMediasWidget 
  | FollowWidget 
  | SummarizerWidget 
  | MilestoneWidget

// User interaction/response interfaces
export interface BaseWidgetResponse {
  widgetId: string
  userId: string
  submittedAt: Date
}

export interface PollResponse extends BaseWidgetResponse {
  selectedOption: string
}

export interface SliderResponse extends BaseWidgetResponse {
  value: number
}

export interface RatingResponse extends BaseWidgetResponse {
  rating: number
}

export interface VisualPickResponse extends BaseWidgetResponse {
  selectedImageId: string
}

export interface PrivateCommentResponse extends BaseWidgetResponse {
  comment: string
  isPrivate: true
}

export interface ChecklistResponse extends BaseWidgetResponse {
  selectedOptions: string[]
}

export interface SwiperResponse extends BaseWidgetResponse {
  direction: 'left' | 'right'
  action: string
}

export interface CTAResponse extends BaseWidgetResponse {
  clicked: boolean
  clickedAt: Date
}

export interface ReorderResponse extends BaseWidgetResponse {
  orderedItems: string[]
}

export interface RangeResponse extends BaseWidgetResponse {
  value: number
}

export interface SocialMediasResponse extends BaseWidgetResponse {
  clickedPlatform: string
  clickedAt: Date
}

export interface FollowResponse extends BaseWidgetResponse {
  followed: boolean
}

export interface SummarizerResponse extends BaseWidgetResponse {
  userBulletPoints: string[]
}

export interface MilestoneResponse extends BaseWidgetResponse {
  userProgress?: number
  userComment?: string
}

export type WidgetResponse = 
  | PollResponse 
  | SliderResponse 
  | RatingResponse 
  | VisualPickResponse 
  | PrivateCommentResponse 
  | ChecklistResponse 
  | SwiperResponse 
  | CTAResponse 
  | ReorderResponse 
  | RangeResponse 
  | SocialMediasResponse 
  | FollowResponse 
  | SummarizerResponse 
  | MilestoneResponse

// Widget configuration for new-post creation
export interface WidgetConfig {
  type: WidgetType
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  maxInstances?: number
  category: 'engagement' | 'feedback' | 'social' | 'utility'
}

// Widget display modes
export type WidgetMode = 'preview' | 'interactive' | 'results'

// Widget component props
export interface WidgetProps<T extends Widget = Widget> {
  widget: T
  mode: WidgetMode
  userResponse?: WidgetResponse
  onResponse?: (response: WidgetResponse) => void
  isAuthor?: boolean
}