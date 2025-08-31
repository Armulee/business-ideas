import { Skeleton } from "@/components/ui/skeleton"

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