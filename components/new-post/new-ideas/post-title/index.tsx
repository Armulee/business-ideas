import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar"
import { useSession } from "next-auth/react"
import { Control } from "react-hook-form"
import { NewPostSchema } from "../types"
import Title from "./title"
import CategorySelection from "./category-selection"
import RegionSelection from "./region-selection"

const PostTitle = ({ control }: { control: Control<NewPostSchema> }) => {
    const { data: session } = useSession()
    // const textareaRef = useRef<HTMLTextAreaElement>(null)
    return (
        <div className='glassmorphism p-6 mb-4'>
            <CategorySelection control={control} />
            <Title control={control} />
            <RegionSelection control={control} />

            <div className='flex items-center mt-2'>
                <Avatar className='h-10 w-10 mr-4'>
                    <AvatarImage
                        src={session?.user.image || ""}
                        alt={session?.user.name || ""}
                    />
                    <AvatarFallback className='bg-cyan-600 text-white'>
                        {session?.user.name?.charAt(0)}
                    </AvatarFallback>
                </Avatar>

                <div className='flex flex-col'>
                    <span className='text-white'>{session?.user.name}</span>
                </div>
            </div>
        </div>
    )
}

export default PostTitle
