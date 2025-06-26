import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control } from "react-hook-form"
import { ProfileFormValues } from "../types"

const EditFacebook = ({ control }: { control: Control<ProfileFormValues> }) => {
    return (
        <FormField
            control={control}
            name='facebook'
            render={({ field }) => (
                <FormItem>
                    <FormLabel className='text-white'>Facebook</FormLabel>
                    <FormControl>
                        <div className='flex'>
                            <span className='inline-flex items-center px-3 rounded-l-md border border-r-0 border-white/50 bg-white/20 text-white'>
                                facebook.com/
                            </span>
                            <Input
                                className='bg-white bg-opacity-5 text-white border-white/50 focus:border-blue-500 rounded-l-none placeholder:text-white/50'
                                placeholder='username'
                                {...field}
                            />
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default EditFacebook
