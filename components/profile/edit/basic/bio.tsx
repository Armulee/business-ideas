import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Control, ControllerRenderProps } from "react-hook-form"
import { ProfileFormValues } from "../types"
import { useState } from "react"

const EditBio = ({
    defaultBio,
    control,
}: {
    defaultBio: string | undefined
    control: Control<ProfileFormValues>
}) => {
    const [charCount, setCharCount] = useState<number | undefined>(
        defaultBio?.length
    )
    const [error, setError] = useState(false)
    // Handle the character count and error state
    const handleBioChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>,
        field: ControllerRenderProps<ProfileFormValues>
    ) => {
        const value = e.target.value
        setCharCount(value.length)

        if (value.length > 250) {
            setError(true)
        } else {
            setError(false)
        }

        field.onChange(e) // Pass the change to react-hook-form
    }
    return (
        <FormField
            control={control}
            name='bio'
            render={({ field }) => (
                <FormItem>
                    <FormLabel className='text-white'>Bio</FormLabel>
                    <FormControl>
                        <Textarea
                            placeholder='Tell us about yourself'
                            {...field}
                            onChange={(e) => handleBioChange(e, field)}
                            className={`bg-white bg-opacity-5 text-white ${
                                error ? "border-red-500" : "border-white/50"
                            } placeholder:text-white/50 resize-none h-24`}
                        />
                    </FormControl>
                    <FormDescription className='text-gray-300'>
                        Brief description for your profile.{" "}
                        <span className={error ? "text-red-500" : ""}>
                            Max {charCount} / 250 characters.
                        </span>
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default EditBio
