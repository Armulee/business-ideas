import { Skeleton } from "@/components/ui/skeleton"

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