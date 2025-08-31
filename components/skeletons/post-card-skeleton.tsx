import { Skeleton } from "@/components/ui/skeleton"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"

export function PostCardSkeleton({ className = "" }: { className?: string }) {
    return (
        <Card
            className={`${className} border-0 glassmorphism bg-transparent max-w-full text-white shadow-lg relative`}
        >
            <CardHeader>
                <Skeleton className='h-6 w-24 bg-white/10 mb-3' />

                <Skeleton className='h-8 w-full bg-white/10' />
            </CardHeader>

            <CardContent>
                <div className='space-y-2'>
                    <Skeleton className='h-4 w-full bg-white/10' />
                    <Skeleton className='h-4 w-full bg-white/10' />
                    <Skeleton className='h-4 w-3/4 bg-white/10' />
                </div>
            </CardContent>

            <CardFooter className='flex justify-between items-center'>
                <div className='flex gap-2 items-center'>
                    <Skeleton className='h-8 w-8 rounded-full bg-white/10' />
                    <div className='flex flex-col'>
                        <Skeleton className='h-4 w-24 bg-white/10' />
                    </div>
                </div>
                <div className='flex items-center gap-4'>
                    <Skeleton className='h-4 w-6 bg-white/10' />

                    <Skeleton className='h-4 w-6 bg-white/10' />
                </div>
            </CardFooter>
        </Card>
    )
}