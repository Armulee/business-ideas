import { IPostPopulated } from "@/database/Post"
import PostCard from "@/components/post-card"

interface ServerPostsContentProps {
    topVotedPosts: IPostPopulated[]
    latestPosts: IPostPopulated[]
}

export default function ServerPostsContent({ topVotedPosts, latestPosts }: ServerPostsContentProps) {
    return (
        <>
            {/* Server-rendered content for SEO - Hidden from visual display but accessible to crawlers */}
            <div className="sr-only" aria-label="Posts content for search engines">
                {/* Top Voted Posts */}
                <section aria-label="Trending Businesses">
                    <h2>Trending Businesses</h2>
                    {topVotedPosts.map((post, index) => (
                        <PostCard
                            key={`trending-seo-${post._id}-${index}`}
                            post={post}
                        />
                    ))}
                </section>

                {/* Latest Posts */}
                <section aria-label="Latest Businesses">
                    <h2>Latest Businesses</h2>
                    {latestPosts.map((post, index) => (
                        <PostCard
                            key={`latest-seo-${post._id}-${index}`}
                            post={post}
                        />
                    ))}
                </section>
            </div>
        </>
    )
}