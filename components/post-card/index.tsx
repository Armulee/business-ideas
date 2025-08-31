import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { MessageSquare } from "lucide-react"
import { IPostPopulated } from "@/database/Post"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { formatDate } from "@/utils/format-date"
import parse from "html-react-parser"
import { PiArrowFatDown, PiArrowFatUp } from "react-icons/pi"
import { Badge } from "../ui/badge"
import { PostCardSkeleton } from "@/components/skeletons"
import { LoadingLink } from "../loading-link"
import { PostCardActions } from "./post-card-actions"

export default function PostCard({
    post,
    className = "",
    showMoreButton = true,
}: {
    post?: IPostPopulated
    className?: string
    showMoreButton?: boolean
}) {
    if (!post) {
        return <PostCardSkeleton />
    }

    const votes = (post.upvoteCount ?? 0) - (post.downvoteCount ?? 0)

    return (
        <Card
            className={`${className} relative border-0 glassmorphism bg-transparent max-w-full text-white shadow-lg hover:bg-blue-900 cursor-pointer transition duration-500 relative`}
        >
            <LoadingLink href={post.postLink}>
                <CardHeader className='border-0 border-b border-white/10 pb-2 mb-2 h-[100px]'>
                    <div className='flex justify-between items-center mb-2'>
                        {post.categories?.length ? (
                            post.categories.map((category, index) => (
                                <Badge
                                    key={index}
                                    className='text-xs font-normal px-3 py-1 text-white bg-transparent glassmorphism w-fit cursor-pointer hover:bg-white/30'
                                >
                                    {category}
                                </Badge>
                            ))
                        ) : (
                            <Badge className='text-xs font-normal px-3 py-1 text-white bg-transparent glassmorphism w-fit cursor-pointer hover:bg-white/30'>
                                Uncategorized
                            </Badge>
                        )}
                    </div>

                    <CardTitle className='text-xl flex items-center h-[28px] line-clamp-1'>
                        {post.title}
                    </CardTitle>
                </CardHeader>

                <CardContent className='pt-2 h-[85px]'>
                    <div className='text-sm description line-clamp-3'>
                        {parse(post.content ?? "")}
                    </div>
                </CardContent>

                <CardFooter className='flex justify-between items-center'>
                    <div className='flex gap-3 items-center mb-2'>
                        <Avatar className='h-10 w-10'>
                            <AvatarImage
                                src={post.author.avatar}
                                alt={post.author.name}
                            />
                            <AvatarFallback>
                                {post.author.name?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>

                        <div className='flex flex-col justify-center items-start'>
                            <span className='text-sm text-white font-bold'>
                                {post.author.name}
                            </span>
                            <span className='text-xs text-white/70'>
                                {formatDate(post.createdAt)}
                            </span>
                        </div>
                    </div>
                    <div className='flex items-center gap-4'>
                        <div className='flex items-center gap-2 text-sm'>
                            <MessageSquare className='w-4 h-4' />
                            <span>{post.commentCount}</span>
                        </div>
                        <div className='flex items-center gap-2 text-sm'>
                            {votes >= 0 ? (
                                <PiArrowFatUp className='h-4 w-4' />
                            ) : (
                                <PiArrowFatDown className='h-4 w-4' />
                            )}
                            <span>{votes}</span>
                        </div>
                    </div>
                </CardFooter>
            </LoadingLink>

            <div className='flex items-center gap-1 absolute top-5 right-3'>
                <span className={`text-xs text-white/50`}>
                    {post.viewCount} Views
                </span>

                {showMoreButton && (
                    <PostCardActions post={post} />
                )}
            </div>
        </Card>
    )
}