import { Control } from "react-hook-form"
import { NewPostSchema } from "../types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormControl, FormField, FormItem } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { X } from "lucide-react"

const Tags = ({
    control,
    tags,
    setTags,
}: {
    control: Control<NewPostSchema>
    tags: string[]
    setTags: React.Dispatch<React.SetStateAction<string[]>>
}) => {
    const [currentTag, setCurrentTag] = useState<string>("")

    // Handle adding tags
    const addTag = () => {
        const newTags = currentTag
            .split(",") // Split by commas and spacebar
            .map((tag) => tag.replace(/\s/g, "").toLowerCase().trim()) // Remove extra spaces and make it lower case
            .filter((tag) => tag.length > 0 && !tags.includes(tag)) // Remove empty and duplicate tags

        if (newTags.length > 0) {
            setTags([...tags, ...newTags])
            setCurrentTag("")
        }
    }

    // Remove a tag by index
    const removeTag = (index: number) => {
        setTags(tags.filter((_, i) => i !== index))
    }
    return (
        <>
            <FormField
                control={control}
                name='tags'
                render={() => (
                    <FormItem>
                        <FormControl>
                            <div className='w-full flex items-center gap-2 mb-4 mt-4'>
                                <Label htmlFor='tags'>Tags:</Label>
                                <div className='w-full flex space-x-2'>
                                    <Input
                                        id='tags'
                                        placeholder='Add tags'
                                        value={currentTag}
                                        onChange={(e) =>
                                            setCurrentTag(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            e.key === "Enter" &&
                                            (e.preventDefault(), addTag())
                                        }
                                        className='input max-w-36'
                                    />
                                    <Button
                                        className='glassmorphism bg-transparent hover:bg-white hover:text-blue-800'
                                        type='button'
                                        onClick={addTag}
                                    >
                                        Add
                                    </Button>
                                </div>
                            </div>
                        </FormControl>
                    </FormItem>
                )}
            />

            {tags.length ? (
                <ul className='flex flex-wrap gap-2 mb-4'>
                    {tags.map((tag, index) => (
                        <li
                            key={`tag-${index}`}
                            className='glassmorphism bg-transparent text-white px-4 py-2 rounded-full text-xs cursor-pointer'
                        >
                            {tag}
                            <button
                                type='button'
                                onClick={() => removeTag(index)}
                                className='ml-2 text-white/50 hover:text-white'
                            >
                                <X className='h-3 w-3' />
                            </button>
                        </li>
                    ))}
                </ul>
            ) : null}
        </>
    )
}

export default Tags
