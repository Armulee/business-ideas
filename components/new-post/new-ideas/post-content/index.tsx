// import { Bookmark, Repeat2, Share } from "lucide-react"
// import { PiArrowFatDown, PiArrowFatUp } from "react-icons/pi"
import Content from "./content"
import { Control } from "react-hook-form"
import { NewPostSchema } from "../types"
import Tags from "./tags"

const PostDescription = ({ control }: { control: Control<NewPostSchema> }) => {
    return (
        <div className='glassmorphism p-6 mb-4'>
            <Content control={control} />
            <Tags control={control} />
        </div>
    )
}

export default PostDescription
