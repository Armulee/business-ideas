import { usePostData } from "."
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"

const Author = () => {
    const { post } = usePostData()
    return (
        <div className='glassmorphism p-6 mb-6'>
            <div className='flex flex-shrink-0 items-center space-x-3'>
                <Avatar className='w-12 h-12'>
                    <AvatarImage
                        src={post?.author.avatar}
                        alt={post?.author.name}
                        className='min-w-12 min-h-12'
                    />
                    <AvatarFallback>
                        {post?.author.name?.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h3 className='font-semibold text-lg'>
                        {post?.author.name}
                    </h3>
                    <p className='text-sm text-white/60'>
                        {post?.author.bio || "No bio available"}
                    </p>
                </div>
            </div>
            <div className='mt-3 text-sm text-white/60'>
                <strong>{post?.author.postCount || 0}</strong> Posts
                <Button className='mt-2 w-full bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600'>
                    Follow
                </Button>
            </div>
        </div>
    )
}

export default Author
