"use client"

import { ReactNode } from "react"
import FlowCarousel from "@/components/ui/flow-carousel"
import { SwiperSlide } from "swiper/react"

interface PostsCarouselProps {
    children: ReactNode[]
    title: string
    className?: string
    carouselConfig: {
        scrollbar: boolean
        speed: number
        slidesPerView: number
        className: string
        mousewheel: { forceToAxis: boolean } | boolean
        direction: "horizontal" | "vertical"
        breakpoint: {
            [key: number]: { slidesPerView: number; spaceBetween: number }
        }
    }
}

export default function PostsCarousel({
    children,
    title,
    className,
    carouselConfig,
}: PostsCarouselProps) {
    return (
        <>
            {/* Section Title */}
            <div className='mt-6 mb-2 text-2xl font-bold w-[80%] mx-auto'>
                {title}
            </div>

            {/* Carousel */}
            <FlowCarousel
                scrollbar={carouselConfig.scrollbar}
                speed={carouselConfig.speed}
                slidesPerView={carouselConfig.slidesPerView}
                className={carouselConfig.className}
                mousewheel={carouselConfig.mousewheel}
                direction={carouselConfig.direction}
                breakpoint={carouselConfig.breakpoint}
            >
                {children.map((child, index) => (
                    <SwiperSlide className={className} key={`slide-${index}`}>
                        {child}
                    </SwiperSlide>
                ))}
            </FlowCarousel>
        </>
    )
}
