"use client"

import { Edit, Ellipsis, Trash } from "lucide-react"
import { IPostPopulated } from "@/database/Post"
import { useSession } from "next-auth/react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import axios from "axios"

export function PostCardActions({ post }: { post: IPostPopulated }) {
    const router = useRouter()
    const { data: session } = useSession()

    const permission = session?.user.profile === post?.author.profileId || false

    const handleEdit = (e: React.MouseEvent<HTMLLIElement>) => {
        e.preventDefault()
        e.stopPropagation()
        router.push(`${post.postLink}?editing`)
    }

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

    if (!permission) {
        return null
    }

    return (
        <Popover>
            <PopoverTrigger
                onClick={(e) => {
                    e.stopPropagation()
                }}
                asChild
                className='bg-transparent rounded-full border-0 hover:bg-white/20 hover:text-white transition duration-500'
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
    )
}