import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control } from "react-hook-form"
import { ProfileFormValues } from "../types"

const EditWebsite = ({ control }: { control: Control<ProfileFormValues> }) => {
    return (
        <FormField
            control={control}
            name='website'
            render={({ field }) => (
                <FormItem>
                    <FormLabel className='text-white'>Website</FormLabel>
                    <FormControl>
                        <Input
                            placeholder='https://yourwebsite.com'
                            {...field}
                            className='bg-white bg-opacity-5 text-white border-white/50 placeholder:text-white/50 focus:border-blue-500'
                        />
                    </FormControl>
                    <FormDescription className='text-white'>
                        Your personal or professional website.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default EditWebsite
