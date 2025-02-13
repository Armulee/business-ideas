import { Swiper } from "swiper/react"
import { Autoplay, FreeMode, Scrollbar } from "swiper/modules"
const FlowCarousel = ({
    children,
    className,
    breakpoint,
    slidesPerView = 1,
    scrollbar,
    speed = 15000,
    spaceBetween = 10,
    loop = false,
    disableOnInteraction = true,
}: {
    children: React.ReactNode
    className?: string
    slidesPerView?: number | "auto"
    scrollbar?: boolean
    speed?: number
    spaceBetween?: number
    loop?: boolean
    breakpoint?: {
        [x: number]: { slidesPerView: number; spaceBetween: number }
    }
    disableOnInteraction?: boolean
}) => {
    return (
        <Swiper
            className={`${className}`}
            slidesPerView={slidesPerView}
            breakpoints={breakpoint}
            spaceBetween={spaceBetween}
            freeMode={true}
            scrollbar={scrollbar}
            autoplay={{ disableOnInteraction: disableOnInteraction, delay: 0 }}
            modules={[Autoplay, FreeMode, Scrollbar]}
            loop={loop}
            speed={speed}
        >
            {children}
        </Swiper>
    )
}

export default FlowCarousel
