import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Control } from "react-hook-form"
import { NewPostSchema } from "../types"
import { categories } from "@/components/store"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const Category = ({ control }: { control: Control<NewPostSchema> }) => {
    return (
        <div className='flex flex-wrap items-center gap-3 mb-4'>
            <FormField
                control={control}
                name='category'
                render={({ field }) => (
                    <FormItem>
                        <div className='flex gap-2 items-center'>
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                required
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
                                    {categories.map((category) => (
                                        <SelectItem
                                            className='text-black'
                                            key={`categories-select-${category}`}
                                            value={category}
                                        >
                                            {category}
                                        </SelectItem>
                                    ))}
                                    <SelectItem value='other'>Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <FormDescription className='text-white/60'>
                            Choose the category that best fits your idea
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}

export default Category
