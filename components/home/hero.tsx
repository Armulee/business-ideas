"use client"
import Typewriter, { Options } from "typewriter-effect"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Hero() {
    // const breakpoint = {
    //     540: { slidesPerView: 3, spaceBetween: 10 },
    //     620: { slidesPerView: 4, spaceBetween: 10 },
    //     780: { slidesPerView: 5, spaceBetween: 10 },
    //     840: { slidesPerView: 6, spaceBetween: 10 },
    //     1024: { slidesPerView: 7, spaceBetween: 10 },
    // }

    // const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
    return (
        <div className='mx-auto pt-40 pb-28 text-center flex flex-col justify-center items-center'>
            <h1 className='w-[80%] mx-auto md:w-3/4 text-3xl sm:text-4xl md:text-5xl font-extrabold min-h-[140px] flex justify-center items-center mb-8'>
                <Typewriter
                    options={{
                        strings: [
                            "The Best Business Ideas Start Here",
                            "From Idea to Impact",
                            "The World Needs Your Idea",
                            "Every Billion-Dollar Business Starts With an Idea",
                            "Lost in Ideas? Organize, Share, and Launch!",
                        ],
                        cursor: "",
                        autoStart: true,
                        loop: true,
                        delay: 50,
                        deleteSpeed: 50,
                        ...({ pauseFor: 4000 } as Partial<Options>),
                    }}
                />
            </h1>
            <p className='text-md sm:text-lg w-[80%] mx-auto'>
                We believe that great businesses start with a spark of
                inspiration.
            </p>
            <Link className='mt-8 glassmorphism' href={"/signin"}>
                <Button
                    variant={"outline"}
                    className='w-full bg-transparent text-white hover:text-blue-700 py-4'
                >
                    Get Started
                </Button>
            </Link>

            {/* <SearchBar
                    showSuggestions={showSuggestions}
                    setShowSuggestions={setShowSuggestions}
                />
                {showSuggestions ? (
                    <div className='h-[300px]' />
                ) : (
                    <div className='w-full'>
                        <span className='mb-2'>Choose by categories:</span>
                        <FlowCarousel
                            disableOnInteraction={false}
                            className='mt-2 mb-6 h-[50px]'
                            slidesPerView={3}
                            breakpoint={breakpoint}
                            speed={4000}
                            loop
                        >
                            {categories.map((category, index) => (
                                <SwiperSlide
                                    key={`${category}-${index}`}
                                    className='text-[7px] sm:text-md'
                                >
                                    <Badge
                                        variant={"secondary"}
                                        className='text-white hover:text-blue-700 bg-white/20 w-full h-full flex items-center justify-center cursor-pointer'
                                    >
                                        {category}
                                    </Badge>
                                </SwiperSlide>
                            ))}
                        </FlowCarousel>
                    </div>
                )} */}
        </div>
    )
}
