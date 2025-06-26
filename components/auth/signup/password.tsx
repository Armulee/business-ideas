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
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

const Password = ({ control }: { control: Control<FormValues> }) => {
    const [show, setShow] = useState<boolean>(false)
    return (
        <div className='relative'>
            <FormField
                control={control}
                name='password'
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className='sr-only'>Password</FormLabel>
                        <FormControl>
                            <Input
                                type={show ? "text" : "password"}
                                autoComplete='password'
                                className='input'
                                placeholder='Password'
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <button
                type='button'
                onClick={() => setShow((prev) => !prev)}
                className='absolute inset-y-0 right-0 flex items-center pr-3 z-10'
                tabIndex={-1}
            >
                {show ? (
                    <EyeOff className='h-5 w-5 text-gray-400' />
                ) : (
                    <Eye className='h-5 w-5 text-gray-400' />
                )}
            </button>
        </div>
    )
}

export default Password
