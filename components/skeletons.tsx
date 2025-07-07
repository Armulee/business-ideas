import { Skeleton } from "@/components/ui/skeleton"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card"

export function PostSkeleton() {
    return (
        <section className='min-h-screen pt-20 pb-32 px-4 max-w-7xl mx-auto'>
            <div className='flex flex-col md:flex-row gap-4'>
                {/* Main content - left side on desktop, top on mobile */}
                <main className='flex-1 w-full'>
                    {/* Post Title Skeleton */}
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

                    {/* Post Content Skeleton */}
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
                            {/* <WidgetsSkeleton /> */}
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

export function ProfileSkeleton() {
    return (
        <div className='container mx-auto px-4 pt-24 pb-28'>
            <div className='flex flex-col gap-2 items-start'>
                {/* Profile Header Skeleton */}
                <div className='flex gap-6 mb-4 items-center w-full'>
                    <Skeleton className='h-24 w-24 rounded-full' />
                    <div className='flex-1'>
                        <Skeleton className='h-8 w-48 mb-3' />
                        <Skeleton className='h-8 w-24' />
                    </div>
                </div>
                <Skeleton className='h-4 w-full mb-2' />
                <Skeleton className='h-4 w-3/4 mb-4' />
                <div className='flex gap-4'>
                    <Skeleton className='h-8 w-20' />
                    <Skeleton className='h-8 w-20' />
                    <Skeleton className='h-8 w-20' />
                </div>
            </div>

            {/* Profile Stats Skeleton */}
            <div className='w-full grid grid-cols-4 md:gap-4 gap-2 mb-6 mt-6'>
                <div className='w-full text-center glassmorphism p-4'>
                    <div className='w-full text-xs text-gray-200 flex flex-col justify-center items-center shrink-0'>
                        <Skeleton className='h-6 w-6 mb-2' />
                        <Skeleton className='h-3 w-12' />
                    </div>
                    <Skeleton className='h-4 w-8 mx-auto mt-2' />
                </div>
                <div className='w-full text-center glassmorphism p-4'>
                    <div className='w-full text-xs text-gray-200 flex flex-col justify-center items-center shrink-0'>
                        <Skeleton className='h-6 w-6 mb-2' />
                        <Skeleton className='h-3 w-12' />
                    </div>
                    <Skeleton className='h-4 w-8 mx-auto mt-2' />
                </div>
                <div className='w-full text-center glassmorphism p-4'>
                    <div className='w-full text-xs text-gray-200 flex flex-col justify-center items-center shrink-0'>
                        <Skeleton className='h-6 w-6 mb-2' />
                        <Skeleton className='h-3 w-12' />
                    </div>
                    <Skeleton className='h-4 w-8 mx-auto mt-2' />
                </div>
                <div className='w-full text-center glassmorphism p-4'>
                    <div className='w-full text-xs text-gray-200 flex flex-col justify-center items-center shrink-0'>
                        <Skeleton className='h-6 w-6 mb-2' />
                        <Skeleton className='h-3 w-12' />
                    </div>
                    <Skeleton className='h-4 w-8 mx-auto mt-2' />
                </div>
            </div>

            {/* Profile Tabs Skeleton */}
            <div className='w-full flex gap-2 mb-6'>
                <Skeleton className='h-8 w-full' />
                <Skeleton className='h-8 w-full' />
                <Skeleton className='h-8 w-full' />
            </div>

            <div className='space-y-4'>
                {Array.from({ length: 3 }).map((_, i) => (
                    <PostCardSkeleton key={i} />
                ))}
            </div>
        </div>
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

export function EditProfileSkeleton() {
    return (
        <div className='container mx-auto max-w-xl px-4 pt-24 pb-32'>
            <div className='mx-auto'>
                <Card className='glassmorphism bg-transparent'>
                    <CardHeader>
                        <CardTitle>
                            {/* Title skeleton */}
                            <Skeleton className='h-6 w-1/3' />
                        </CardTitle>
                        <CardDescription>
                            {/* Description skeleton */}
                            <Skeleton className='h-4 w-2/3 mt-2' />
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Form field skeletons */}
                        <div className='space-y-6'>
                            {/* Basic Information Tab Skeleton */}
                            <div className='flex gap-1'>
                                <Skeleton className='h-10 w-full rounded-md' />
                                <Skeleton className='h-10 w-full rounded-md' />
                            </div>
                            {/* Avatar */}
                            <div className='flex gap-1'>
                                <Skeleton className='min-h-24 min-w-24 rounded-full' />{" "}
                                <div className='w-full flex flex-col gap-2'>
                                    <Skeleton className='h-5 w-1/3 rounded-full' />{" "}
                                    <Skeleton className='h-10 w-full rounded-md' />{" "}
                                    <Skeleton className='h-5 w-full rounded-md' />{" "}
                                </div>
                            </div>
                            {/* Name */}
                            <Skeleton className='h-10 w-full rounded-md' />{" "}
                            {/* Bio */}
                            <Skeleton className='h-10 w-full rounded-md' />{" "}
                            {/* Location */}
                            <Skeleton className='h-10 w-full rounded-md' />{" "}
                            {/* Action buttons skeleton */}
                            <div className='flex justify-end space-x-4 pt-4'>
                                <Skeleton className='h-10 w-20 rounded-md' />
                                <Skeleton className='h-10 w-24 rounded-md' />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
