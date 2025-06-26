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

const EditName = ({ control }: { control: Control<ProfileFormValues> }) => {
    return (
        <FormField
            control={control}
            name='name'
            render={({ field }) => (
                <FormItem>
                    <FormLabel className='text-white'>Name</FormLabel>
                    <FormControl>
                        <Input
                            placeholder='Your name'
                            {...field}
                            className='bg-white bg-opacity-5 text-white border-white/50 focus:border-blue-500 placeholder:text-white/50'
                        />
                    </FormControl>
                    <FormDescription className='text-gray-300'>
                        This is your public display name.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default EditName
