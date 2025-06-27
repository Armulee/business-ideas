import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Hash } from "lucide-react"
import { PopularTags } from ".."
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export default function Tags({ popularTags }: { popularTags: PopularTags }) {
    return (
        <>
            {popularTags.length ? (
                <Card className='glassmorphism bg-transparent'>
                    <CardHeader className='pb-3'>
                        <CardTitle className='text-sm font-medium text-white flex items-center'>
                            <Hash className='w-4 h-4 mr-2' />
                            Popular Tags
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='pt-0'>
                        <div className='flex flex-wrap gap-2'>
                            {popularTags.map(({ tag, count }) => (
                                <Button
                                    key={tag}
                                    className='px-2 py-1 glassmorphism bg-transparent text-white text-xs rounded-full hover:bg-white hover:text-blue-800 transition-colors group'
                                >
                                    {tag}{" "}
                                    <Badge className='glassmorphism bg-transparent group-hover:bg-black/10 group-hover:text-blue-800'>
                                        {count}
                                    </Badge>
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <TagsSkeleton />
            )}
        </>
    )
}

function TagsSkeleton() {
    return (
        <Card className='glassmorphism bg-transparent animate-pulse'>
            <CardHeader className='pb-3'>
                <CardTitle className='text-sm font-medium text-white flex items-center'>
                    <Hash className='w-4 h-4 mr-2 opacity-50' />
                    Popular Tags
                </CardTitle>
            </CardHeader>
            <CardContent className='pt-0'>
                <div className='flex flex-wrap gap-2'>
                    <Skeleton className='glassmorphism h-6 w-16 rounded-full' />
                    <Skeleton className='glassmorphism h-6 w-36 rounded-full' />
                    <Skeleton className='glassmorphism h-6 w-28 rounded-full' />
                    <Skeleton className='glassmorphism h-6 w-16 rounded-full' />
                    <Skeleton className='glassmorphism h-6 w-32 rounded-full' />
                    <Skeleton className='glassmorphism h-6 w-20 rounded-full' />
                    <Skeleton className='glassmorphism h-6 w-36 rounded-full' />
                </div>
            </CardContent>
        </Card>
    )
}
