import { Control } from "react-hook-form"
import { NewPostSchema } from "../types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormControl, FormField, FormItem } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { X } from "lucide-react"

const Tags = ({ control }: { control: Control<NewPostSchema> }) => {
    const [currentTag, setCurrentTag] = useState<string>("")

    // Handle adding tags
    const addTag = (currentTags: string[], setValue: (tags: string[]) => void) => {
        const newTags = currentTag
            .split(",") // Split by commas and spacebar
            .map((tag) => tag.replace(/\s/g, "").toLowerCase().trim()) // Remove extra spaces and make it lower case
            .filter((tag) => tag.length > 0 && !currentTags.includes(tag)) // Remove empty and duplicate tags

        if (newTags.length > 0) {
            setValue([...currentTags, ...newTags])
            setCurrentTag("")
        }
    }

    // Remove a tag by index
    const removeTag = (index: number, currentTags: string[], setValue: (tags: string[]) => void) => {
        setValue(currentTags.filter((_, i) => i !== index))
    }
    return (
        <>
            <FormField
                control={control}
                name='tags'
                render={({ field }) => (
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
                                            (e.preventDefault(), addTag(field.value || [], field.onChange))
                                        }
                                        className='input max-w-36'
                                    />
                                    <Button
                                        className='glassmorphism bg-transparent hover:bg-white hover:text-blue-800'
                                        type='button'
                                        onClick={() => addTag(field.value || [], field.onChange)}
                                    >
                                        Add
                                    </Button>
                                </div>
                            </div>
                        </FormControl>
                        
                        {field.value?.length ? (
                            <ul className='flex flex-wrap gap-2 mb-4'>
                                {field.value.map((tag, index) => (
                                    <li
                                        key={`tag-${index}`}
                                        className='glassmorphism bg-transparent text-white px-4 py-2 rounded-full text-xs cursor-pointer'
                                    >
                                        {tag}
                                        <button
                                            type='button'
                                            onClick={() => removeTag(index, field.value || [], field.onChange)}
                                            className='ml-2 text-white/50 hover:text-white'
                                        >
                                            <X className='h-3 w-3' />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </FormItem>
                )}
            />
        </>
    )
}

export default Tags
