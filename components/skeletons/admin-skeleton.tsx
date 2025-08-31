import { Skeleton } from "@/components/ui/skeleton"
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"

export function AdminSkeleton() {
    return (
        <div className='pt-6 space-y-6'>
            <p className='font-bold text-lg mb-2'>Overview</p>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card
                        key={i}
                        className='bg-white/10 backdrop-blur-md border-white/20 shadow-xl'
                    >
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <Skeleton className='h-4 w-20' />
                            <Skeleton className='h-4 w-4' />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className='h-8 w-16 mb-2' />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <p className='font-bold text-lg mb-2'>Today Activities</p>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card
                        key={i}
                        className='bg-white/10 backdrop-blur-md border-white/20 shadow-xl'
                    >
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <Skeleton className='h-4 w-20' />
                            <Skeleton className='h-4 w-4' />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className='h-8 w-16' />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div>
                <p className='font-bold text-lg mb-2'>Charts</p>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
                    {Array.from({ length: 2 }).map((_, i) => (
                        <Card
                            key={i}
                            className='bg-white/10 backdrop-blur-md border-white/20 shadow-xl'
                        >
                            <CardHeader>
                                <Skeleton className='h-5 w-32' />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className='h-48 w-full' />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    <Card className='bg-white/10 backdrop-blur-md border-white/20 shadow-xl'>
                        <CardHeader>
                            <Skeleton className='h-5 w-36' />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className='h-48 w-full' />
                        </CardContent>
                    </Card>

                    <Card className='bg-white/10 backdrop-blur-md border-white/20 shadow-xl lg:col-span-2'>
                        <CardHeader>
                            <Skeleton className='h-5 w-28' />
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-4'>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className='flex items-center justify-between py-2 border-b border-white/10 last:border-b-0'
                                    >
                                        <div>
                                            <Skeleton className='h-4 w-48 mb-1' />
                                            <Skeleton className='h-3 w-24' />
                                        </div>
                                        <Skeleton className='h-3 w-16' />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}