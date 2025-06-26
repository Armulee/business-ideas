import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Control, ControllerRenderProps } from "react-hook-form"
import { ProfileFormValues } from "../types"
import { useState } from "react"
import AutoHeightTextarea from "@/components/ui/auto-height-textarea"

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
                        <AutoHeightTextarea
                            {...field}
                            className={`text-white ${
                                error && "border !border-red-400 !bg-red-400/50"
                            }`}
                            onChange={(e) => handleBioChange(e, field)}
                            placeholder='Tell us about yourself'
                        />
                    </FormControl>
                    <FormDescription className='text-white/70'>
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
