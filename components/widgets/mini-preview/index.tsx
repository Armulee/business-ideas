// Mini Preview Components Index
import { WidgetType } from "../types"
import { PollMiniPreview } from "./poll-preview"
import { SliderMiniPreview } from "./slider-preview"
import { RatingMiniPreview } from "./rating-preview"
import { VisualPickMiniPreview } from "./visual-pick-preview"
import { PrivateCommentMiniPreview } from "./private-comment-preview"
import { ChecklistMiniPreview } from "./checklist-preview"
import { SwiperMiniPreview } from "./swiper-preview"
import { CTAMiniPreview } from "./cta-preview"
import { ReorderMiniPreview } from "./reorder-preview"
import { RangeMiniPreview } from "./range-preview"
import { SocialMediasMiniPreview } from "./social-medias-preview"
import { FollowMiniPreview } from "./follow-preview"
import { SummarizerMiniPreview } from "./summarizer-preview"
import { MilestoneMiniPreview } from "./milestone-preview"

interface MiniPreviewProps {
    type: WidgetType
    isHovered: boolean
}

export function MiniPreview({ type, isHovered }: MiniPreviewProps) {
    const renderPreview = () => {
        switch (type) {
            case 'poll':
                return <PollMiniPreview isHovered={isHovered} />
            case 'slider':
                return <SliderMiniPreview isHovered={isHovered} />
            case 'rating':
                return <RatingMiniPreview isHovered={isHovered} />
            case 'visual-pick':
                return <VisualPickMiniPreview isHovered={isHovered} />
            case 'private-comment':
                return <PrivateCommentMiniPreview isHovered={isHovered} />
            case 'checklist':
                return <ChecklistMiniPreview isHovered={isHovered} />
            case 'swiper':
                return <SwiperMiniPreview isHovered={isHovered} />
            case 'cta':
                return <CTAMiniPreview isHovered={isHovered} />
            case 'reorder':
                return <ReorderMiniPreview isHovered={isHovered} />
            case 'range':
                return <RangeMiniPreview isHovered={isHovered} />
            case 'social-medias':
                return <SocialMediasMiniPreview isHovered={isHovered} />
            case 'follow':
                return <FollowMiniPreview isHovered={isHovered} />
            case 'summarizer':
                return <SummarizerMiniPreview isHovered={isHovered} />
            case 'milestone':
                return <MilestoneMiniPreview isHovered={isHovered} />
            default:
                return (
                    <div className='text-xs text-white/60 text-center py-2'>
                        Preview coming soon...
                    </div>
                )
        }
    }

    return (
        <div className='bg-white/10 rounded-md p-2 border border-white/20'>
            {renderPreview()}
        </div>
    )
}

// Export all individual preview components
export * from "./poll-preview"
export * from "./slider-preview"
export * from "./rating-preview"
export * from "./visual-pick-preview"
export * from "./private-comment-preview"
export * from "./checklist-preview"
export * from "./swiper-preview"
export * from "./cta-preview"
export * from "./reorder-preview"
export * from "./range-preview"
export * from "./social-medias-preview"
export * from "./follow-preview"
export * from "./summarizer-preview"
export * from "./milestone-preview"