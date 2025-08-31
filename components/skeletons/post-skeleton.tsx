import { Skeleton } from "@/components/ui/skeleton"
import { CommentsSkeleton } from "./comments-skeleton"
import { WidgetsSkeleton } from "./widgets-skeleton"
import { RelatedPostsSkeleton } from "./related-posts-skeleton"

export function PostSkeleton() {
    return (
        <section className='min-h-screen pt-20 pb-32 px-4 max-w-7xl mx-auto'>
            <div className='flex flex-col md:flex-row gap-4'>
                <main className='flex-1 w-full'>
                    <div className='glassmorphism p-6 mb-6'>
                        <Skeleton className='h-8 w-20 mb-4' />
                        <div className='flex gap-2 mb-4'>
                            <Skeleton className='h-6 w-3/4 rounded-full' />
                        </div>
                        <div className='flex items-center gap-4 mb-4'>
                            <Skeleton className='h-10 w-10 rounded-full' />
                            <div className='flex-1'>
                                <Skeleton className='h-4 w-32 mb-2' />
                                <Skeleton className='h-3 w-24' />
                            </div>
                        </div>
                    </div>

                    <div className='glassmorphism p-6 mb-6'>
                        <Skeleton className='h-4 w-full mb-3' />
                        <Skeleton className='h-4 w-5/6 mb-3' />
                        <Skeleton className='h-4 w-4/5 mb-3' />
                        <Skeleton className='h-4 w-full mb-3' />
                        <Skeleton className='h-4 w-3/4 mb-6' />

                        <Skeleton className='h-4 w-full mb-3' />
                        <Skeleton className='h-4 w-4/5 mb-3' />
                        <Skeleton className='h-4 w-5/6 mb-6' />

                        <div className='flex items-center justify-between mb-4'>
                            <div className='flex gap-4'>
                                <Skeleton className='h-8 w-16' />
                                <Skeleton className='h-8 w-16' />
                                <Skeleton className='h-8 w-24' />
                                <Skeleton className='h-8 w-16' />
                                <Skeleton className='h-8 w-16' />
                                <Skeleton className='h-8 w-16' />
                            </div>
                        </div>
                        <div className='flex items-center justify-between'>
                            <div className='flex gap-4'>
                                <Skeleton className='h-8 w-8' />
                                <Skeleton className='h-8 w-8' />
                                <Skeleton className='h-8 w-8' />
                                <Skeleton className='h-8 w-8' />
                                <Skeleton className='h-8 w-8' />
                                <Skeleton className='h-8 w-8' />
                            </div>
                        </div>
                    </div>

                    <div className='my-6 md:hidden'>
                        <WidgetsSkeleton />
                    </div>

                    <CommentsSkeleton />

                    <div className='mt-6 md:hidden'>
                        <RelatedPostsSkeleton />
                    </div>
                </main>

                <aside className='hidden md:block w-72'>
                    <div className='sticky top-20'>
                        <div className='h-screen pb-28 overflow-y-scroll'>
                            <RelatedPostsSkeleton />
                        </div>
                    </div>
                </aside>
            </div>
        </section>
    )
}