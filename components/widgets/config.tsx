import { WidgetConfig, WidgetType } from './types'
import { 
  BarChart3, 
  Sliders, 
  Star, 
  Images, 
  Lock, 
  CheckSquare, 
  ArrowLeftRight, 
  ExternalLink, 
  ArrowUpDown, 
  Hash, 
  Share2, 
  UserPlus, 
  List, 
  Target 
} from 'lucide-react'

// Widget configurations for the widget selector
export const WIDGET_CONFIGS: Record<WidgetType, WidgetConfig> = {
  poll: {
    type: 'poll',
    name: 'Poll',
    description: 'Ask users to vote between multiple options',
    icon: BarChart3,
    category: 'engagement'
  },
  slider: {
    type: 'slider',
    name: 'Slider',
    description: 'Get numeric feedback with a slider',
    icon: Sliders,
    category: 'feedback'
  },
  rating: {
    type: 'rating',
    name: 'Rating',
    description: 'Ask users to rate with stars or icons',
    icon: Star,
    category: 'feedback'
  },
  'visual-pick': {
    type: 'visual-pick',
    name: 'Visual Pick',
    description: 'Let users choose between images',
    icon: Images,
    category: 'engagement'
  },
  'private-comment': {
    type: 'private-comment',
    name: 'Private Comment',
    description: 'Collect private feedback from users',
    icon: Lock,
    category: 'feedback'
  },
  checklist: {
    type: 'checklist',
    name: 'Checklist',
    description: 'Multiple choice selection',
    icon: CheckSquare,
    category: 'feedback'
  },
  swiper: {
    type: 'swiper',
    name: 'Swiper',
    description: 'Swipe left or right for quick feedback',
    icon: ArrowLeftRight,
    category: 'engagement'
  },
  cta: {
    type: 'cta',
    name: 'Call to Action',
    description: 'Direct users to take an action',
    icon: ExternalLink,
    category: 'utility'
  },
  reorder: {
    type: 'reorder',
    name: 'Reorder',
    description: 'Let users prioritize items by dragging',
    icon: ArrowUpDown,
    category: 'engagement'
  },
  range: {
    type: 'range',
    name: 'Number Range',
    description: 'Collect numeric input within a range',
    icon: Hash,
    category: 'feedback'
  },
  'social-medias': {
    type: 'social-medias',
    name: 'Social Links',
    description: 'Share your social media profiles',
    icon: Share2,
    category: 'social'
  },
  follow: {
    type: 'follow',
    name: 'Follow Profile',
    description: 'Showcase user profile with follow button',
    icon: UserPlus,
    category: 'social'
  },
  summarizer: {
    type: 'summarizer',
    name: 'Summarizer',
    description: 'Organize key points with bullet lists',
    icon: List,
    category: 'utility'
  },
  milestone: {
    type: 'milestone',
    name: 'Milestone Tracker',
    description: 'Track progress towards a goal',
    icon: Target,
    category: 'utility'
  }
}

// Widget categories for organization
export const WIDGET_CATEGORIES = {
  engagement: {
    name: 'Engagement',
    description: 'Interactive widgets to engage your audience',
    color: 'blue'
  },
  feedback: {
    name: 'Feedback',
    description: 'Collect opinions and ratings from users',
    color: 'green'
  },
  social: {
    name: 'Social',
    description: 'Connect with your audience socially',
    color: 'purple'
  },
  utility: {
    name: 'Utility',
    description: 'Useful tools and organizational widgets',
    color: 'orange'
  }
} as const