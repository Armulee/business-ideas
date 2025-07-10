"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import axios from "axios"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sparkles, Users, Lightbulb, MessageSquare } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"

const slides = [
    {
        title: "Welcome to",
        icon: Sparkles,
        description:
            "Thank you for joining our community of entrepreneurs and innovators. Let's get you started on your journey!",
        type: "welcome",
    },
    {
        title: "Discover What You Can Do",
        type: "features",
        features: [
            {
                icon: Lightbulb,
                title: "Share Your Ideas",
                description:
                    "Post your innovative business ideas and get feedback from the community",
            },
            {
                icon: Users,
                title: "Connect & Collaborate",
                description:
                    "Follow other entrepreneurs and build meaningful connections",
            },
            {
                icon: MessageSquare,
                title: "Engage & Discuss",
                description:
                    "Comment, vote, and participate in meaningful discussions",
            },
        ],
    },
    {
        title: "Ready to Get Started?",
        description: "Your profile has been created successfully. You can now:",
        type: "list",
        items: [
            "Share your first business idea",
            "Complete your profile information",
            "Explore ideas from other entrepreneurs",
        ],
    },
]

export default function WelcomeDialog() {
    const { data: session, status } = useSession()
    const [isOpen, setIsOpen] = useState(false)
    const hasCheckedRef = useRef(false)
    const swiperRef = useRef<SwiperType | null>(null)
    const [swiperHeight, setSwiperHeight] = useState("auto")
    const [currentSlide, setCurrentSlide] = useState(0)

    useEffect(() => {
        // Only check once for authenticated users
        if (
            status === "authenticated" &&
            session?.user?.email &&
            !hasCheckedRef.current
        ) {
            checkWelcomeStatus()
            hasCheckedRef.current = true
        }
    }, [session, status])

    const checkWelcomeStatus = async () => {
        try {
            const response = await axios.get(`/api/profile/welcome-status`)
            const { hasSeenWelcome } = response.data

            if (!hasSeenWelcome) {
                setIsOpen(true)
            }
        } catch (error) {
            console.error("Failed to check welcome status:", error)
        }
    }

    const markWelcomeAsSeen = async () => {
        try {
            await axios.patch(`/api/profile/mark-welcome-seen`)
        } catch (error) {
            console.error("Failed to mark welcome as seen:", error)
        }
    }

    const handleClose = async (open?: boolean) => {
        if (open === false || open === undefined) {
            setIsOpen(false)
            await markWelcomeAsSeen()
        }
    }

    const updateSwiperHeight = () => {
        if (swiperRef.current) {
            const activeSlide =
                swiperRef.current.slides[swiperRef.current.activeIndex]
            if (activeSlide) {
                const slideContent = activeSlide.querySelector(
                    ".slide-content"
                ) as HTMLElement
                if (slideContent) {
                    setSwiperHeight(`${slideContent.offsetHeight}px`)
                }
            }
            setCurrentSlide(swiperRef.current.activeIndex)
        }
    }

    const handleNext = () => {
        if (currentSlide === slides.length - 1) {
            handleClose()
        } else {
            swiperRef.current?.slideNext()
        }
    }

    const handlePrev = () => {
        swiperRef.current?.slidePrev()
    }

    if (status !== "authenticated") {
        return null
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className='sm:max-w-md glassmorphism bg-gray-900/95 border-white/20'>
                <Swiper
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper
                        setTimeout(updateSwiperHeight, 100)
                    }}
                    onSlideChange={updateSwiperHeight}
                    modules={[Pagination]}
                    spaceBetween={30}
                    slidesPerView={1}
                    pagination={false}
                    className='w-full transition-all duration-300 ease-in-out mt-6'
                    style={{ height: swiperHeight }}
                >
                    {slides.map((slide, index) => (
                        <SwiperSlide key={index}>
                            <div className='slide-content flex flex-col items-center justify-center'>
                                <DialogHeader className='text-center space-y-4'>
                                    <DialogTitle
                                        className={`${index === 0 ? "text-2xl" : "text-xl"} font-bold text-white ${index === 0 ? "flex items-center justify-center gap-2" : ""}`}
                                    >
                                        {index === 0 ? (
                                            <div className='flex items-center justify-center gap-2'>
                                                {slide.icon && (
                                                    <slide.icon className='w-6 h-6 text-yellow-400' />
                                                )}
                                                {slide.title}{" "}
                                                <h1 className='font-extrabold'>
                                                    <span className='text-blue-400'>
                                                        Blue
                                                    </span>
                                                    <span className='text-white'>
                                                        BizHub
                                                    </span>
                                                </h1>
                                            </div>
                                        ) : (
                                            <>
                                                {slide.icon && (
                                                    <slide.icon className='w-6 h-6 text-yellow-400' />
                                                )}
                                                {slide.title}
                                            </>
                                        )}
                                    </DialogTitle>
                                    {slide.description && (
                                        <DialogDescription className='text-white/80 text-center'>
                                            {slide.description}
                                        </DialogDescription>
                                    )}
                                </DialogHeader>

                                {slide.type === "features" &&
                                    slide.features && (
                                        <div className='space-y-4 mt-4'>
                                            {slide.features.map(
                                                (feature, featureIndex) => (
                                                    <div
                                                        key={featureIndex}
                                                        className='flex items-start gap-3 text-left'
                                                    >
                                                        <div className='bg-blue-600/20 p-2 rounded-lg'>
                                                            <feature.icon className='w-5 h-5 text-blue-400' />
                                                        </div>
                                                        <div>
                                                            <h4 className='font-semibold text-white'>
                                                                {feature.title}
                                                            </h4>
                                                            <p className='text-sm text-white/70'>
                                                                {
                                                                    feature.description
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}

                                {slide.type === "list" && slide.items && (
                                    <ul className='mt-3 space-y-2 text-left'>
                                        {slide.items.map((item, itemIndex) => (
                                            <li
                                                key={itemIndex}
                                                className='flex items-center gap-2'
                                            >
                                                <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className='flex justify-between items-center pt-4'>
                    <div className='flex space-x-1'>
                        {slides.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                                    index === currentSlide
                                        ? "bg-blue-400"
                                        : "bg-white/20"
                                }`}
                                onClick={() =>
                                    swiperRef.current?.slideTo(index)
                                }
                            />
                        ))}
                    </div>
                    <div className='flex gap-2'>
                        <Button
                            variant='ghost'
                            onClick={handlePrev}
                            className='text-white/70 hover:text-white hover:bg-white/10 px-2 py-1'
                            disabled={currentSlide === 0}
                        >
                            Back
                        </Button>
                        <Button
                            onClick={handleNext}
                            className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-1'
                        >
                            {currentSlide === slides.length - 1
                                ? "Get Started"
                                : "Next"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
