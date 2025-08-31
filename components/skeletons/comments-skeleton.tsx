import { Skeleton } from "@/components/ui/skeleton"
import { CommentSkeleton } from "./comment-skeleton"

export function CommentsSkeleton() {
    return (
        <div className='space-y-6'>
            <Skeleton className='h-6 w-24' />

            {Array.from({ length: 3 }).map((_, i) => (
                <CommentSkeleton key={i} />
            ))}
        </div>
    )
}