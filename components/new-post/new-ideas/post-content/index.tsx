// import { Bookmark, Repeat2, Share } from "lucide-react"
// import { PiArrowFatDown, PiArrowFatUp } from "react-icons/pi"
import Content from "./content"
import { Control } from "react-hook-form"
import { NewPostSchema } from "../types"
import Tags from "./tags"

const PostDescription = ({
    control,
    tags,
    setTags,
}: {
    control: Control<NewPostSchema>
    tags: string[]
    setTags: React.Dispatch<React.SetStateAction<string[]>>
}) => {
    return (
        <div className='glassmorphism p-6 mb-4'>
            <Content control={control} />
            <Tags control={control} tags={tags} setTags={setTags} />
        </div>
    )
}

export default PostDescription
