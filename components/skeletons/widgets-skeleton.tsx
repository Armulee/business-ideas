import { Skeleton } from "@/components/ui/skeleton"

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