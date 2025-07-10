import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
    return (
        <div className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {[...Array(8)].map((_, i) => (
                    <Card
                        key={i}
                        className='bg-white/5 border-white/10 animate-pulse'
                    >
                        <CardContent className='p-6'>
                            <div className='h-4 bg-white/10 rounded mb-2'></div>
                            <div className='h-8 bg-white/10 rounded'></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
