import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"

export function PostSkeleton() {
    return (
        <section className='min-h-screen pt-20 pb-32 px-4 max-w-7xl mx-auto'>
            <div className='flex flex-col md:flex-row gap-4'>
                {/* Main content - left side on desktop, top on mobile */}
                <main className='flex-1'>
                    {/* Post Title Skeleton */}
                    <div className='glassmorphism p-6 mb-6'>
                        <Skeleton className='h-8 w-3/4 mb-4' />
                        <div className='flex items-center gap-4 mb-4'>
                            <Skeleton className='h-10 w-10 rounded-full' />
                            <div className='flex-1'>
                                <Skeleton className='h-4 w-32 mb-2' />
                                <Skeleton className='h-3 w-24' />
                            </div>
                        </div>
                        <div className='flex gap-2 mb-4'>
                            <Skeleton className='h-6 w-16 rounded-full' />
                            <Skeleton className='h-6 w-20 rounded-full' />
                            <Skeleton className='h-6 w-14 rounded-full' />
                        </div>
                    </div>

                    {/* Post Content Skeleton */}
                    <div className='glassmorphism p-6 mb-6'>
                        <Skeleton className='h-4 w-full mb-3' />
                        <Skeleton className='h-4 w-5/6 mb-3' />
                        <Skeleton className='h-4 w-4/5 mb-3' />
                        <Skeleton className='h-4 w-full mb-3' />
                        <Skeleton className='h-4 w-3/4 mb-6' />

                        <Skeleton className='h-40 w-full mb-4' />

                        <Skeleton className='h-4 w-full mb-3' />
                        <Skeleton className='h-4 w-4/5 mb-3' />
                        <Skeleton className='h-4 w-5/6' />
                    </div>

                    {/* Engagements Skeleton */}
                    <div className='glassmorphism p-4 mb-6'>
                        <div className='flex items-center justify-between'>
                            <div className='flex gap-4'>
                                <Skeleton className='h-8 w-16' />
                                <Skeleton className='h-8 w-16' />
                                <Skeleton className='h-8 w-16' />
                            </div>
                            <div className='flex gap-2'>
                                <Skeleton className='h-8 w-8 rounded-full' />
                                <Skeleton className='h-8 w-8 rounded-full' />
                            </div>
                        </div>
                    </div>

                    {/* only on mobile */}
                    <div className='my-6 md:hidden'>
                        <WidgetsSkeleton />
                    </div>

                    <CommentsSkeleton />

                    <div className='mt-6 md:hidden'>
                        <RelatedPostsSkeleton />
                    </div>
                </main>

                {/* Sidebar - right side on desktop, hidden on mobile */}
                <aside className='hidden md:block w-72'>
                    <div className='sticky top-20'>
                        <div className='h-screen pb-28 overflow-y-scroll'>
                            <WidgetsSkeleton />
                            <RelatedPostsSkeleton />
                        </div>
                    </div>
                </aside>
            </div>
        </section>
    )
}

export function CommentsSkeleton() {
    return (
        <div className='space-y-6'>
            {/* Comments header */}
            <Skeleton className='h-6 w-24' />

            {/* Comment skeletons */}
            {Array.from({ length: 3 }).map((_, i) => (
                <CommentSkeleton key={i} />
            ))}
        </div>
    )
}

export function CommentSkeleton() {
    return (
        <div className='glassmorphism p-4 mb-4'>
            <div className='flex items-start gap-3'>
                <Skeleton className='h-8 w-8 rounded-full flex-shrink-0' />
                <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-2'>
                        <Skeleton className='h-4 w-20' />
                        <Skeleton className='h-3 w-16' />
                    </div>
                    <Skeleton className='h-4 w-full mb-2' />
                    <Skeleton className='h-4 w-4/5 mb-3' />

                    <div className='flex items-center gap-4'>
                        <Skeleton className='h-6 w-12' />
                        <Skeleton className='h-6 w-12' />
                        <Skeleton className='h-6 w-12' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export function ReplySkeleton() {
    return (
        <div className='glassmorphism p-3'>
            <div className='flex items-start gap-3'>
                <Skeleton className='h-6 w-6 rounded-full flex-shrink-0' />
                <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-2'>
                        <Skeleton className='h-3 w-16' />
                        <Skeleton className='h-3 w-12' />
                    </div>
                    <Skeleton className='h-3 w-full mb-1' />
                    <Skeleton className='h-3 w-3/4 mb-2' />

                    <div className='flex items-center gap-3'>
                        <Skeleton className='h-5 w-10' />
                        <Skeleton className='h-5 w-10' />
                        <Skeleton className='h-5 w-10' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export function WidgetsSkeleton() {
    return (
        <div className='space-y-4 mb-6'>
            <div className='glassmorphism p-4'>
                <Skeleton className='h-5 w-20 mb-3' />
                <Skeleton className='h-4 w-full mb-2' />
                <Skeleton className='h-4 w-4/5' />
            </div>

            <div className='glassmorphism p-4'>
                <div className='flex items-center gap-3 mb-3'>
                    <Skeleton className='h-12 w-12 rounded-full' />
                    <div className='flex-1'>
                        <Skeleton className='h-4 w-24 mb-1' />
                        <Skeleton className='h-3 w-16' />
                    </div>
                </div>
                <Skeleton className='h-3 w-full mb-2' />
                <Skeleton className='h-3 w-3/4' />
            </div>
        </div>
    )
}

export function RelatedPostsSkeleton() {
    return (
        <div className='glassmorphism p-4'>
            <Skeleton className='h-5 w-28 mb-4' />
            <div className='space-y-3'>
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className='flex gap-3'>
                        <Skeleton className='h-16 w-16 rounded-lg flex-shrink-0' />
                        <div className='flex-1'>
                            <Skeleton className='h-4 w-full mb-2' />
                            <Skeleton className='h-3 w-3/4 mb-1' />
                            <Skeleton className='h-3 w-1/2' />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function ProfileSkeleton() {
    return (
        <section className='min-h-screen pt-20 pb-32 px-4 max-w-7xl mx-auto'>
            {/* Profile Header Skeleton */}
            <div className='glassmorphism p-6 mb-6'>
                <div className='flex flex-col md:flex-row gap-6'>
                    <Skeleton className='h-32 w-32 rounded-full mx-auto md:mx-0' />
                    <div className='flex-1 text-center md:text-left'>
                        <Skeleton className='h-8 w-48 mb-3 mx-auto md:mx-0' />
                        <Skeleton className='h-4 w-32 mb-4 mx-auto md:mx-0' />
                        <Skeleton className='h-4 w-full mb-2' />
                        <Skeleton className='h-4 w-3/4 mb-4 mx-auto md:mx-0' />

                        <div className='flex gap-4 justify-center md:justify-start mb-4'>
                            <Skeleton className='h-8 w-20' />
                            <Skeleton className='h-8 w-20' />
                            <Skeleton className='h-8 w-20' />
                        </div>

                        <Skeleton className='h-10 w-32 mx-auto md:mx-0' />
                    </div>
                </div>
            </div>

            {/* Profile Stats Skeleton */}
            <div className='glassmorphism p-4 mb-6'>
                <div className='grid grid-cols-3 gap-4'>
                    <div className='text-center'>
                        <Skeleton className='h-6 w-12 mb-1 mx-auto' />
                        <Skeleton className='h-4 w-16 mx-auto' />
                    </div>
                    <div className='text-center'>
                        <Skeleton className='h-6 w-12 mb-1 mx-auto' />
                        <Skeleton className='h-4 w-16 mx-auto' />
                    </div>
                    <div className='text-center'>
                        <Skeleton className='h-6 w-12 mb-1 mx-auto' />
                        <Skeleton className='h-4 w-16 mx-auto' />
                    </div>
                </div>
            </div>

            {/* Profile Tabs Skeleton */}
            <div className='glassmorphism p-4'>
                <div className='flex gap-2 mb-6'>
                    <Skeleton className='h-8 w-16' />
                    <Skeleton className='h-8 w-20' />
                    <Skeleton className='h-8 w-16' />
                </div>

                <div className='space-y-4'>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className='glassmorphism p-4'>
                            <Skeleton className='h-6 w-3/4 mb-3' />
                            <Skeleton className='h-4 w-full mb-2' />
                            <Skeleton className='h-4 w-4/5 mb-3' />
                            <div className='flex gap-2'>
                                <Skeleton className='h-6 w-12 rounded-full' />
                                <Skeleton className='h-6 w-16 rounded-full' />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export function PostCardSkeleton({ className = "" }: { className?: string }) {
    return (
        <Card
            className={`${className} border-0 glassmorphism bg-transparent max-w-full text-white shadow-lg relative`}
        >
            <CardHeader>
                {/* Category badge skeleton */}
                <Skeleton className='h-6 w-24 bg-white/10 mb-3' />

                {/* Title skeleton */}
                <Skeleton className='h-8 w-full bg-white/10' />
            </CardHeader>

            <CardContent>
                {/* Description skeleton - 3 lines */}
                <div className='space-y-2'>
                    <Skeleton className='h-4 w-full bg-white/10' />
                    <Skeleton className='h-4 w-full bg-white/10' />
                    <Skeleton className='h-4 w-3/4 bg-white/10' />
                </div>
            </CardContent>

            <CardFooter className='flex justify-between items-center'>
                <div className='flex gap-2 items-center'>
                    {/* Avatar skeleton */}
                    <Skeleton className='h-8 w-8 rounded-full bg-white/10' />
                    <div className='flex flex-col'>
                        {/* Date skeleton */}
                        <Skeleton className='h-4 w-24 bg-white/10' />
                    </div>
                </div>
                <div className='flex items-center gap-4'>
                    {/* Comments count skeleton */}
                    <Skeleton className='h-4 w-6 bg-white/10' />

                    {/* Votes count skeleton */}
                    <Skeleton className='h-4 w-6 bg-white/10' />
                </div>
            </CardFooter>
        </Card>
    )
}
