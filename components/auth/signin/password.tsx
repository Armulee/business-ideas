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
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"

const Password = ({ control }: { control: Control<FormValues> }) => {
    const [show, setShow] = useState(false)
    return (
        <div>
            <FormField
                control={control}
                name='password'
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className='sr-only'>Password</FormLabel>
                        <FormControl>
                            <div className='relative'>
                                <Input
                                    id='password'
                                    type={show ? "text" : "password"}
                                    autoComplete='password'
                                    required
                                    className='input'
                                    placeholder='Password'
                                    {...field}
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
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className='text-left pl-2'>
                <Link
                    className='text-[10px] text-gray-200 hover:text-white underline underline-offset-4'
                    href={"/auth/forget-password"}
                >
                    Forgot your password?
                </Link>
            </div>
        </div>
    )
}

export default Password
