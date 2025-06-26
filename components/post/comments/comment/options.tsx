import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import axios from "axios"
import { Edit, Ellipsis, Flag, Trash } from "lucide-react"
import { usePostData } from "../.."
import { ICommentPopulated } from "@/database/Comment"
import { useSession } from "next-auth/react"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import ReportForm from "../../report-form"
import { useState } from "react"

interface CommentOptionsProps {
    comment: ICommentPopulated
    isEditing: boolean
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
}

const CommentOptions = ({
    comment,
    isEditing,
    setIsEditing,
}: CommentOptionsProps) => {
    const { data: session } = useSession()
    const { showButton } = usePostData()

    const permission = session?.user.id === comment.author._id.toString()

    const handleEdit = () => setIsEditing(true)
    const handleDelete = async () => {
        const confirmation = confirm(
            "Are you sure you want to delete this comment, this action cannot be undone."
        )
        if (confirmation) {
            const response = await axios.delete(
                `/api/comment/${comment._id.toString()}`
            )

            if (response.status === 200) {
                setTimeout(() => location.reload())
            }
        }
    }

    // open report form
    const [openReportForm, setOpenReportForm] = useState<boolean>(false)
    return (
        <>
            {isEditing || !showButton ? null : (
                <Popover>
                    <PopoverTrigger
                        className='bg-transparent rounded-full border-0 absolute top-3 right-3 hover:bg-white/20 hover:text-white transition duration-500'
                        asChild
                    >
                        <Button type='button' size={"icon"} variant='outline'>
                            <Ellipsis />
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className='w-52 glassmorphism bg-black/10 text-white p-2 border-0'>
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
                                        className='w-full text-sm flex justify-start items-center gap-4 px-4 py-2 cursor-pointer bg-red-500 hover:bg-white/20 hover:text-red-600 transition duration-500 rounded text-white'
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
                                        targetId={comment?._id.toString()}
                                        targetType='Comment'
                                        setOpen={setOpenReportForm}
                                    />
                                </Dialog>
                            )}
                        </ul>
                    </PopoverContent>
                </Popover>
            )}
        </>
    )
}

export default CommentOptions
