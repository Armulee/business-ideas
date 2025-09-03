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
const Content = ({
    control,
    media,
}: {
    control: Control<NewPostSchema>
    media?: File[]
}) => {
    return (
        <FormField
            control={control}
            name='content'
            render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <RichTextEditor
                            placeholder='Describe your business, services, and marketing goals...'
                            onChange={field.onChange}
                            media={media}
                        />
                    </FormControl>
                    <FormDescription className='text-white/60'>
                        Explain your business, target audience, services
                        offered, and what you hope to achieve through marketing
                        partnerships
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default Content
