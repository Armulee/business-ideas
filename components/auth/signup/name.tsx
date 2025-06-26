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

const Name = ({ control }: { control: Control<FormValues> }) => {
    return (
        <FormField
            control={control}
            name='name'
            render={({ field }) => (
                <FormItem>
                    <FormLabel className='sr-only'>Name</FormLabel>
                    <FormControl>
                        <Input
                            type='text'
                            className='input'
                            placeholder='Username'
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default Name
