import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Control } from "react-hook-form"
import { FormValues } from "./types"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

const Consent = ({ control }: { control: Control<FormValues> }) => {
    return (
        <FormField
            control={control}
            name='consent'
            render={({ field }) => (
                <FormItem>
                    <div className='flex items-center gap-2'>
                        <FormControl>
                            <Checkbox
                                className='border-white'
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <FormLabel className='text-sm text-gray-200 !mt-0'>
                            I agree to the{" "}
                            <Link
                                href='/terms'
                                target='_blank'
                                className='text-white hover:text-blue-200 underline'
                            >
                                User agreement
                            </Link>{" "}
                            and{" "}
                            <Link
                                href='/privacy'
                                target='_blank'
                                className='text-white hover:text-blue-200 underline'
                            >
                                Privacy Policy
                            </Link>
                        </FormLabel>
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default Consent
