"use client"

import { Control, useWatch, ControllerRenderProps } from "react-hook-form"
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { NewPostSchema } from "../types"
import { categories } from "@/components/store"

interface CategorySelectionProps {
    control: Control<NewPostSchema>
}

export default function CategorySelection({ control }: CategorySelectionProps) {
    const watchedCategories =
        useWatch({
            control,
            name: "categories",
        }) || []

    // Always ensure we have at least one empty category for initial state
    const selectedCategories =
        watchedCategories.length === 0 ? [""] : watchedCategories

    const removeCategory = (
        index: number,
        field: ControllerRenderProps<NewPostSchema, "categories">
    ) => {
        if (selectedCategories.length > 1) {
            const newCategories = selectedCategories.filter(
                (_, i) => i !== index
            )
            // Filter out empty strings from the result
            const filteredCategories = newCategories.filter((cat) => cat !== "")
            // Ensure we always have at least one empty category if all are filled
            const finalCategories =
                filteredCategories.length === newCategories.length &&
                newCategories.length < 3
                    ? [...filteredCategories, ""]
                    : filteredCategories.length === 0
                      ? [""]
                      : newCategories
            field.onChange(finalCategories)
        }
    }

    const updateCategory = (
        index: number,
        value: string,
        field: ControllerRenderProps<NewPostSchema, "categories">
    ) => {
        const newCategories = [...selectedCategories]
        newCategories[index] = value

        // If this is the last category and it's not empty, add another empty category (max 3)
        if (
            index === selectedCategories.length - 1 &&
            value &&
            selectedCategories.length < 3
        ) {
            newCategories.push("")
        }

        field.onChange(newCategories)
    }

    const getAvailableCategories = (currentIndex: number) => {
        const usedCategories = selectedCategories.filter(
            (cat, index) => index !== currentIndex && cat !== ""
        )
        return categories.filter((cat) => !usedCategories.includes(cat))
    }

    return (
        <div className='flex flex-wrap items-center gap-3 mb-4'>
            <FormField
                control={control}
                name='categories'
                render={({ field }) => {
                    return (
                        <FormItem>
                            <div className='flex flex-wrap items-center gap-3'>
                                {selectedCategories.map((category, index) => (
                                    <div
                                        key={`category-${index}-${category}`}
                                        className='relative'
                                    >
                                        <Select
                                            value={category}
                                            onValueChange={(value) =>
                                                updateCategory(
                                                    index,
                                                    value,
                                                    field
                                                )
                                            }
                                            required={index === 0} // First category is required
                                        >
                                            <FormControl>
                                                <SelectTrigger className='w-fit h-[30px] text-xs select'>
                                                    <SelectValue
                                                        className='text-black'
                                                        placeholder='Select a category'
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {getAvailableCategories(
                                                    index
                                                ).map((cat) => (
                                                    <SelectItem
                                                        className='text-black'
                                                        key={`categories-select-${cat}`}
                                                        value={cat}
                                                    >
                                                        {cat}
                                                    </SelectItem>
                                                ))}
                                                <SelectItem value='other'>
                                                    Other
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {selectedCategories.length > 1 &&
                                            category && (
                                                <Button
                                                    type='button'
                                                    variant='ghost'
                                                    size='sm'
                                                    onClick={() =>
                                                        removeCategory(
                                                            index,
                                                            field
                                                        )
                                                    }
                                                    className='absolute -top-1 -right-1 h-4 w-4 p-0 text-white hover:text-red-300 bg-transparent hover:bg-transparent rounded-full z-10'
                                                >
                                                    <X className='h-2 w-2' />
                                                </Button>
                                            )}
                                    </div>
                                ))}
                            </div>
                            <FormDescription className='text-white/60'>
                                Choose the category that best fits your idea
                                <br />
                                (You can choose up to 3 categories)
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )
                }}
            />
        </div>
    )
}
