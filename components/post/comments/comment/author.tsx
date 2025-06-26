import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ICommentPopulated } from "@/database/Comment"
import { formatDate } from "@/utils/format-date"
import Link from "next/link"

export default function Author({ comment }: { comment: ICommentPopulated }) {
    return (
        <div className='flex items-center gap-2 mb-3'>
            <Link
                className='flex items-center gap-2'
                href={`/profile/${comment.author.profileId}/${comment.author.name}`}
            >
                <Avatar className='h-8 w-8'>
                    <AvatarImage
                        src={comment.author.avatar}
                        alt={comment.author.name}
                    />
                    <AvatarFallback className='bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium'>
                        {comment.author.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                    <span className='font-semibold text-sm text-white'>
                        {comment.author.name}
                    </span>
                    <span className='text-[11px] text-white/70'>
                        {formatDate(comment.createdAt)}
                    </span>
                </div>
            </Link>
        </div>
    )
}
