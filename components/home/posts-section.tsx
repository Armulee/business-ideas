import { IPostPopulated } from "@/database/Post"
import PostCard from "@/components/post-card"
import PostsCarousel from "./posts-carousel"
import ServerPostsContent from "./server-posts-content"
import { ResponsivePostListSkeletons } from "@/components/skeletons"

interface PostsSectionProps {
    topVotedPosts: IPostPopulated[]
    latestPosts: IPostPopulated[]
}

export default function PostsSection({ topVotedPosts, latestPosts }: PostsSectionProps) {
    // Server-rendered post cards for carousel
    const trendingPostCards = topVotedPosts.map((post, index) => (
        <PostCard
            key={`trending-${post._id}-${index}`}
            className='text-start h-full'
            post={post}
        />
    ))

    const latestPostCards = latestPosts.map((post, index) => (
        <PostCard
            key={`latest-${post._id}-${index}`}
            className='text-start'
            post={post}
        />
    ))

    return (
        <section className='relative z-10 py-12'>
            {/* Server-side content for SEO/crawlers */}
            <ServerPostsContent 
                topVotedPosts={topVotedPosts} 
                latestPosts={latestPosts} 
            />

            {/* Visual carousel with server-rendered content */}
            {topVotedPosts.length ? (
                <PostsCarousel
                    title="Trending Businesses"
                    className='!h-[250px]'
                    carouselConfig={{
                        scrollbar: false,
                        speed: 40000,
                        slidesPerView: 1,
                        className: 'w-[100%] h-[250px]',
                        mousewheel: { forceToAxis: true },
                        direction: 'horizontal',
                        breakpoint: {
                            640: { slidesPerView: 1, spaceBetween: 20 },
                            768: { slidesPerView: 2, spaceBetween: 20 },
                            1350: { slidesPerView: 3, spaceBetween: 20 },
                        }
                    }}
                >
                    {trendingPostCards}
                </PostsCarousel>
            ) : (
                <ResponsivePostListSkeletons />
            )}

            {latestPosts.length ? (
                <PostsCarousel
                    title="Latest Businesses"
                    className='!h-[95%] relative'
                    carouselConfig={{
                        scrollbar: false,
                        speed: 30000,
                        slidesPerView: 1,
                        className: 'w-[100%] h-full mb-4',
                        mousewheel: { forceToAxis: true },
                        direction: 'horizontal',
                        breakpoint: {
                            640: { slidesPerView: 1, spaceBetween: 20 },
                            768: { slidesPerView: 2, spaceBetween: 20 },
                            1350: { slidesPerView: 3, spaceBetween: 20 },
                        }
                    }}
                >
                    {latestPostCards}
                </PostsCarousel>
            ) : (
                <ResponsivePostListSkeletons />
            )}
        </section>
    )
}