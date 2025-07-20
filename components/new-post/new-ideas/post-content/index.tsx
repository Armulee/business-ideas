// import { Bookmark, Repeat2, Share } from "lucide-react"
// import { PiArrowFatDown, PiArrowFatUp } from "react-icons/pi"
import Content from "./content"
import { Control } from "react-hook-form"
import { NewPostSchema } from "../types"
import Tags from "./tags"
import Dropzone from "react-dropzone"
import { useCallback, useState } from "react"

const PostDescription = ({ control }: { control: Control<NewPostSchema> }) => {
    const [media, setMedia] = useState<File[]>()
    const [isRejected, setIsRejected] = useState(true)
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            setMedia(acceptedFiles)
        }

        setIsRejected(false)
    }, [])
    const onDragEnter = useCallback(() => {
        setIsRejected(true)
    }, [])
    return (
        <Dropzone
            onDrop={onDrop}
            noClick
            noKeyboard
            accept={{ "image/*": [], "video/*": [] }}
            multiple={false}
        >
            {({ getRootProps, getInputProps, isDragAccept, isDragReject }) => (
                <div {...getRootProps({ onDragEnter })}>
                    <input
                        className='hidden pointer-events-none'
                        {...getInputProps()}
                    />
                    <div className={`glassmorphism p-6 mb-4 relative`}>
                        {isDragAccept && (
                            <div className='absolute top-0 left-0 glassmorphism bg-blue-600/20 !border !border-blue-600 w-full h-full flex items-center justify-center z-50'>
                                <span className='text-white glassmorphism bg-blue-600 !rounded-full px-4 py-2'>
                                    Drop a file here
                                </span>
                            </div>
                        )}
                        {isDragReject && isRejected && (
                            <div className='absolute top-0 left-0 glassmorphism bg-red-500/20 !border !border-red-500 w-full h-full flex items-center justify-center z-50'>
                                <span className='text-white glassmorphism bg-red-600 !rounded-full px-4 py-2'>
                                    We accept only image and video format.
                                </span>
                            </div>
                        )}

                        <Content control={control} media={media} />
                        <Tags control={control} />
                    </div>
                </div>
            )}
        </Dropzone>
    )
}

export default PostDescription
