import { Control } from "react-hook-form"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../ui/form"
import { Input } from "@/components/ui/input"
import { FormValues } from "./types"

const Email = ({ control }: { control: Control<FormValues> }) => {
    return (
        <FormField
            control={control}
            name='email'
            render={({ field }) => (
                <FormItem>
                    <FormLabel className='sr-only'>Email address</FormLabel>
                    <FormControl>
                        <Input
                            type='email'
                            autoComplete='email'
                            required
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
