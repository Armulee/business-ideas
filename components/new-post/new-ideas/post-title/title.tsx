import { Textarea } from "@/components/ui/textarea"
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Control } from "react-hook-form"
import { NewPostSchema } from "../types"

/* Title Field */
const Title = ({ control }: { control: Control<NewPostSchema> }) => {
    return (
        <FormField
            control={control}
            name='title'
            render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <Textarea
                            placeholder='Enter your business name or title...'
                            className='text-2xl font-bold md:text-2xl text-white placeholder:text-white/50 w-[90%] h-[50px] min-h-[50px] input mb-3 outline-none resize-none overflow-hidden'
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault()
                                    const target =
                                        e.target as HTMLTextAreaElement
                                    // Prevents Enter key from adding a new line
                                    target.blur() // Blurs input when Enter is pressed
                                }
                            }}
                            onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement
                                target.style.height = "50px"
                                target.style.height = `${target.scrollHeight}px`
                            }}
                            {...field}
                        />
                    </FormControl>
                    <FormDescription className='text-white/60'>
                        A clear, compelling business title will attract more
                        marketing partners
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default Title
