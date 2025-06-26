import { Control } from "react-hook-form"
import { NewPostSchema } from "../types"
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { RichTextEditor } from "@/components/rich-text-editor"

/* Description Field */
const Content = ({ control }: { control: Control<NewPostSchema> }) => {
    return (
        <FormField
            control={control}
            name='content'
            render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <RichTextEditor
                            placeholder='Enter your description...'
                            onChange={field.onChange}
                        />
                    </FormControl>
                    <FormDescription className='text-white/60'>
                        Explain the problem your idea solves, target audience,
                        and potential business model
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default Content
