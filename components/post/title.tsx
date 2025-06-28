import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { formatDate } from "@/utils/format-date"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Edit, Ellipsis, EyeIcon, Flag, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePostData } from "."
import axios from "axios"
import { useRouter } from "next/navigation"
import { LoadingLink as Link } from "@/components/loading-link"
import { Badge } from "../ui/badge"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Dialog, DialogTrigger } from "../ui/dialog"
import ReportForm from "./report-form"
import { useSWRConfig } from "swr"

const PostTitle = () => {
    const { post, showButton, setShowButton, isEditing, setIsEditing } =
        usePostData()

    const { data: session } = useSession()
    const permission = session?.user.id === post?.author._id.toString()

    const handleEdit = () => {
        setIsEditing(true)
    }

    const router = useRouter()
    const { mutate } = useSWRConfig()
    const handleDelete = async () => {
        const confirmation = confirm(
            "Are you sure you want to delete this post, this action cannot be undone."
        )
        if (confirmation) {
            const response = await axios.delete(`/api/post/${post?._id}`)

            if (response.status === 200) {
                if (session?.user.id) {
                    mutate(`/api/activities/notifications/${session.user.id}`)
                }

                setTimeout(() => router.push("/post"))
            }
        }
    }

    // hide elipsis button (more button) when editing the post
    useEffect(() => {
        if (isEditing) {
            setShowButton(false)
        } else {
            setShowButton(true)
        }
    }, [isEditing, setShowButton])

    // open report form
    const [openReportForm, setOpenReportForm] = useState<boolean>(false)

    return (
        <div className='glassmorphism bg-transparent p-6 mb-4'>
            <div className='flex flex-wrap items-center gap-3 mb-4'>
                <Badge className='text-xs font-normal px-3 py-1 text-white bg-transparent glassmorphism w-fit cursor-pointer hover:bg-white/30'>
                    {post!.category}
                </Badge>
                {post?.advancedSettings.hideViewCount ? null : (
                    <span className='text-sm text-white/40 flex items-center'>
                        <EyeIcon className='h-4 w-4 mr-1' />
                        {post?.viewCount || 0} views
                    </span>
                )}
            </div>
            <h1 className='text-2xl font-bold my-2 text-white w-[90%]'>
                {post!.title}
            </h1>

            <div className='flex items-center'>
                <Link
                    href={`/profile/${
                        post?.author.profileId
                    }/${encodeURIComponent(
                        post?.author.name?.toLowerCase() ?? ""
                    )}`}
                >
                    <Avatar className='h-10 w-10 mr-4'>
                        <AvatarImage
                            src={post?.author.avatar}
                            alt={post?.author.name}
                        />
                        <AvatarFallback className='bg-cyan-600 text-white'>
                            {post?.author.name?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                </Link>
                <div className='flex flex-col'>
                    <Link
                        href={`/profile/${
                            post?.author.profileId
                        }/${encodeURIComponent(
                            post?.author.name?.toLowerCase() ?? ""
                        )}`}
                    >
                        <span className='text-white'>{post?.author.name}</span>
                    </Link>
                    <span className='text-sm text-gray-300'>
                        {formatDate(post!.createdAt)}
                    </span>
                </div>
            </div>

            {showButton ? (
                <Popover>
                    <PopoverTrigger
                        className='bg-transparent rounded-full border-0 absolute top-5 right-5 hover:bg-white/20 hover:text-white transition duration-500'
                        asChild
                    >
                        <Button size={"icon"} variant='outline'>
                            <Ellipsis />
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className='w-52 glassmorphism bg-black/30 p-2 border !border-white/30'>
                        <ul className='grid gap-1'>
                            {permission ? (
                                <>
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
                                </>
                            ) : (
                                <Dialog
                                    open={openReportForm}
                                    onOpenChange={setOpenReportForm}
                                >
                                    <DialogTrigger asChild>
                                        <li className='w-full text-sm flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-white/5 hover:text-yellow-500 rounded text-white transition'>
                                            <Flag size={18} />
                                            <span>Report</span>
                                        </li>
                                    </DialogTrigger>
                                    <ReportForm
                                        targetId={post?._id.toString()}
                                        targetType='Post'
                                        setOpen={setOpenReportForm}
                                    />
                                </Dialog>
                            )}
                        </ul>
                    </PopoverContent>
                </Popover>
            ) : null}
        </div>
    )
}

export default PostTitle
