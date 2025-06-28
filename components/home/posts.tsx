import { IPostPopulated } from "@/database/Post"
import FlowCarousel from "../ui/flow-carousel"
import { SwiperSlide } from "swiper/react"
import PostCard from "../post-card"
import { PostCardSkeleton } from "../post/skeletons"

const Posts = ({
    // title,
    // description,
    // bullets,
    latestPosts,
    topVotedPosts,
}: {
    // title: string
    // description: string
    // bullets: string[]
    latestPosts: IPostPopulated[]
    topVotedPosts: IPostPopulated[]
}) => {
    return (
        <>
            {/* Top Voted Posts */}
            <div className='mt-6 mb-2 text-2xl font-bold w-[80%] mx-auto'>
                Trending Posts
            </div>
            {topVotedPosts.length ? (
                <FlowCarousel
                    scrollbar={false}
                    speed={40000}
                    slidesPerView={1}
                    className='w-[90%] h-[250px]'
                    mousewheel={{ forceToAxis: true }}
                    direction='horizontal'
                    breakpoint={{
                        640: { slidesPerView: 1, spaceBetween: 20 },
                        768: { slidesPerView: 2, spaceBetween: 20 },
                        // 860: { slidesPerView: 2, spaceBetween: 20 },
                        1350: { slidesPerView: 3, spaceBetween: 20 },
                    }}
                >
                    {topVotedPosts.map((post, index) => (
                        <SwiperSlide
                            className='!h-[250px]'
                            key={`top-post-for-hero-section-${index + 1}`}
                        >
                            <PostCard
                                className='text-start h-full'
                                post={post}
                            />
                        </SwiperSlide>
                    ))}
                </FlowCarousel>
            ) : (
                <PostCardSkeleton className='w-[90%] mx-auto' />
            )}

            {/* Recent Posts */}
            <div className='mt-6 mb-2 text-2xl font-bold w-[80%] mx-auto'>
                Latest Posts
            </div>
            {latestPosts.length ? (
                <FlowCarousel
                    scrollbar={false}
                    speed={30000}
                    slidesPerView={1}
                    className='w-[90%] h-full mb-4'
                    mousewheel={{ forceToAxis: true }}
                    direction='horizontal'
                    breakpoint={{
                        640: { slidesPerView: 1, spaceBetween: 20 },
                        768: { slidesPerView: 2, spaceBetween: 20 },
                        // 860: { slidesPerView: 2, spaceBetween: 20 },
                        1350: { slidesPerView: 3, spaceBetween: 20 },
                    }}
                >
                    {latestPosts.map((post, index) => (
                        <SwiperSlide
                            className='!h-[95%] relative'
                            key={`latest-post-for-hero-section-${index + 1}`}
                        >
                            <PostCard className='text-start' post={post} />
                        </SwiperSlide>
                    ))}
                </FlowCarousel>
            ) : (
                <PostCardSkeleton className='w-[90%] mx-auto' />
            )}
        </>
    )
}
export default Posts
