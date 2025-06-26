import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control } from "react-hook-form"
import { FormValues } from "./types"

const Email = ({ control }: { control: Control<FormValues> }) => {
    return (
        <FormField
            control={control}
            name='email'
            render={({ field }) => (
                <FormItem>
                    <FormLabel className='sr-only'>Email</FormLabel>
                    <FormControl>
                        <Input
                            type='email'
                            autoComplete='email'
                            className='input'
                            placeholder='Email address'
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default Email
