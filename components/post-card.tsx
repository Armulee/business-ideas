import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Edit, Ellipsis, MessageSquare, Trash } from "lucide-react"
import { IPostPopulated } from "@/database/Post"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { formatDate } from "@/utils/format-date"
import parse from "html-react-parser"
import { PiArrowFatDown, PiArrowFatUp } from "react-icons/pi"
import { Badge } from "./ui/badge"
import { useSession } from "next-auth/react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import axios from "axios"
import { PostCardSkeleton } from "./skeletons"
import { LoadingLink } from "./loading-link"

export default function PostCard({
    post,
    className = "",
    showMoreButton = true,
}: {
    post?: IPostPopulated
    className?: string
    showMoreButton?: boolean
}) {
    const router = useRouter()
    const { data: session } = useSession()

    // deect permission
    const permission = session?.user.profile === post?.author.profileId || false

    if (!post) {
        return <PostCardSkeleton />
    }

    const votes = (post.upvoteCount ?? 0) - (post.downvoteCount ?? 0)

    // handle editing post
    const handleEdit = (e: React.MouseEvent<HTMLLIElement>) => {
        e.preventDefault()
        e.stopPropagation()
        router.push(`${post.postLink}?editing`)
    }

    // handle delete post
    const handleDelete = async (e: React.MouseEvent<HTMLLIElement>) => {
        e.preventDefault()
        e.stopPropagation()
        const confirmation = confirm(
            "Are you sure you want to delete this post, this action cannot be undone."
        )
        if (confirmation) {
            const response = await axios.delete(`/api/post/${post?._id}`)

            if (response.status === 200) {
                setTimeout(() => router.push("/post"))
            }
        }
    }

    return (
        <LoadingLink href={post.postLink}>
            <Card
                className={`${className} border-0 glassmorphism bg-transparent max-w-full text-white shadow-lg hover:bg-blue-900 cursor-pointer transition duration-500 relative`}
            >
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
                        <div className='flex items-center gap-2'>
                            <span
                                className={`text-xs text-white/50 ${
                                    permission && showMoreButton
                                        ? "mr-[1.5rem]"
                                        : ""
                                }`}
                            >
                                {post.viewCount} Views
                            </span>

                            {permission && showMoreButton ? (
                                <Popover>
                                    <PopoverTrigger
                                        onClick={(e) => {
                                            e.stopPropagation()
                                        }}
                                        asChild
                                        className='bg-transparent rounded-full absolute top-5 right-3 border-0 hover:bg-white/20 hover:text-white transition duration-500'
                                    >
                                        <Button
                                            type='button'
                                            size={"icon"}
                                            variant='outline'
                                        >
                                            <Ellipsis />
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent className='w-52 glassmorphism bg-black/20 p-2 border !border-white/50'>
                                        <ul className='grid gap-1'>
                                            <li
                                                className='w-full text-sm flex justify-start items-center gap-4 px-4 py-2 cursor-pointer hover:bg-white/20 rounded text-white transition duration-500'
                                                onClick={handleEdit}
                                            >
                                                <span>Edit</span>
                                                <Edit size={18} />
                                            </li>
                                            <li
                                                className='w-full text-sm flex justify-start items-center gap-4 px-4 py-2 cursor-pointer bg-red-500 hover:bg-red-600 hover:text-red-100 transition duration-500 rounded text-white'
                                                onClick={handleDelete}
                                            >
                                                <span>Delete</span>
                                                <Trash size={18} />
                                            </li>
                                        </ul>
                                    </PopoverContent>
                                </Popover>
                            ) : null}
                        </div>
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
            </Card>
        </LoadingLink>
    )
}
