import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bookmark, Heart, MessageCircle, Send, User } from "lucide-react"
import { useSession } from "next-auth/react"

export default function Activity() {
    const { data: session } = useSession()
    return (
        <>
            {session?.user && (
                <Card className='backdrop-blur-sm bg-white/70 border-gray-200'>
                    <CardHeader className='pb-3'>
                        <CardTitle className='text-sm font-medium flex items-center'>
                            <User className='w-4 h-4 mr-2' />
                            Your Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='pt-0'>
                        <div className='space-y-2'>
                            <button className='w-full flex items-center p-2 rounded-lg text-sm hover:bg-gray-50 text-gray-700'>
                                <Bookmark className='w-4 h-4 mr-3' />
                                Bookmarked Ideas
                                <Badge
                                    variant='outline'
                                    className='ml-auto text-xs'
                                >
                                    12
                                </Badge>
                            </button>
                            <button className='w-full flex items-center p-2 rounded-lg text-sm hover:bg-gray-50 text-gray-700'>
                                <Send className='w-4 h-4 mr-3' />
                                Your Submissions
                                <Badge
                                    variant='outline'
                                    className='ml-auto text-xs'
                                >
                                    5
                                </Badge>
                            </button>
                            <button className='w-full flex items-center p-2 rounded-lg text-sm hover:bg-gray-50 text-gray-700'>
                                <Heart className='w-4 h-4 mr-3' />
                                Ideas You Liked
                                <Badge
                                    variant='outline'
                                    className='ml-auto text-xs'
                                >
                                    28
                                </Badge>
                            </button>
                            <button className='w-full flex items-center p-2 rounded-lg text-sm hover:bg-gray-50 text-gray-700'>
                                <MessageCircle className='w-4 h-4 mr-3' />
                                Your Comments
                                <Badge
                                    variant='outline'
                                    className='ml-auto text-xs'
                                >
                                    15
                                </Badge>
                            </button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </>
    )
}
