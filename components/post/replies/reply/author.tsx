import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IProfile } from "@/database/Profile"
import { formatDate } from "@/utils/format-date"
import Link from "next/link"

interface AuthorProps {
    author: IProfile
    createdAt?: Date
}

export default function Author({ author, createdAt }: AuthorProps) {
    return (
        <div className='flex items-center gap-2 mb-3 min-w-0'>
            <Link
                className='flex items-center gap-2'
                href={`/profile/${author.profileId}/${author.name}`}
            >
                <Avatar className='h-8 w-8'>
                    <AvatarImage src={author.avatar} alt={author.name} />
                    <AvatarFallback className='bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium'>
                        {author.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className='flex flex-col flex-1 min-w-0'>
                    <span className='truncate font-semibold text-sm text-white'>
                        {author.name}
                    </span>
                    {createdAt && (
                        <span className='text-[11px] text-white/70'>
                            {formatDate(createdAt)}
                        </span>
                    )}
                </div>
            </Link>
        </div>
    )
}
