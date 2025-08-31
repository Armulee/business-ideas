import { Skeleton } from "@/components/ui/skeleton"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export function EditProfileSkeleton() {
    return (
        <div className='container mx-auto max-w-xl px-4 pt-24 pb-32'>
            <div className='mx-auto'>
                <Card className='glassmorphism bg-transparent'>
                    <CardHeader>
                        <CardTitle>
                            <Skeleton className='h-6 w-1/3' />
                        </CardTitle>
                        <CardDescription>
                            <Skeleton className='h-4 w-2/3 mt-2' />
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-6'>
                            <div className='flex gap-1'>
                                <Skeleton className='h-10 w-full rounded-md' />
                                <Skeleton className='h-10 w-full rounded-md' />
                            </div>
                            <div className='flex gap-1'>
                                <Skeleton className='min-h-24 min-w-24 rounded-full' />{" "}
                                <div className='w-full flex flex-col gap-2'>
                                    <Skeleton className='h-5 w-1/3 rounded-full' />{" "}
                                    <Skeleton className='h-10 w-full rounded-md' />{" "}
                                    <Skeleton className='h-5 w-full rounded-md' />{" "}
                                </div>
                            </div>
                            <Skeleton className='h-10 w-full rounded-md' />{" "}
                            <Skeleton className='h-10 w-full rounded-md' />{" "}
                            <Skeleton className='h-10 w-full rounded-md' />{" "}
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