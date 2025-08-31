import { Skeleton } from "@/components/ui/skeleton"
import { PostCardSkeleton } from "./post-card-skeleton"

export function ProfileSkeleton() {
    return (
        <div className='container mx-auto px-4 pt-24 pb-28'>
            <div className='flex flex-col gap-2 items-start'>
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