import { Swiper } from "swiper/react"
import { Autoplay, FreeMode, Mousewheel, Scrollbar } from "swiper/modules"
import { MousewheelOptions } from "swiper/types"
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
    mousewheel = true,
    direction = undefined,
}: {
    children: React.ReactNode
    className?: string
    slidesPerView?: number | "auto"
    scrollbar?: boolean
    speed?: number
    spaceBetween?: number
    loop?: boolean
    mousewheel?: boolean | MousewheelOptions
    breakpoint?: {
        [x: number]: { slidesPerView: number; spaceBetween: number }
    }
    disableOnInteraction?: boolean
    direction: "vertical" | "horizontal" | undefined
}) => {
    return (
        <Swiper
            className={`${className}`}
            slidesPerView={slidesPerView}
            breakpoints={breakpoint}
            spaceBetween={spaceBetween}
            freeMode={true}
            scrollbar={scrollbar}
            mousewheel={mousewheel}
            direction={direction}
            autoplay={{ disableOnInteraction: disableOnInteraction, delay: 0 }}
            modules={[Autoplay, FreeMode, Scrollbar, Mousewheel]}
            loop={loop}
            speed={speed}
        >
            {children}
        </Swiper>
    )
}

export default FlowCarousel
