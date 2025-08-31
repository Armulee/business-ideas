import { Skeleton } from "@/components/ui/skeleton"
import { PostCardSkeleton } from "./post-card-skeleton"

export function RelatedPostsSkeleton() {
    return (
        <>
            <Skeleton className='h-8 w-28 mb-4' />
            <div className='space-y-3'>
                {Array.from({ length: 5 }).map((_, i) => (
                    <PostCardSkeleton key={i} />
                ))}
            </div>
        </>
    )
}