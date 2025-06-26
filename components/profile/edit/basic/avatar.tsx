import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Camera, X } from "lucide-react"
import { Control, UseFormSetError } from "react-hook-form"
import { ProfileFormValues } from "../types"
import { useRef, useState } from "react"

const MAXIMUM_AVATAR_SIZE_MB = 2

interface AvatarFormFieldProps {
    formError: UseFormSetError<ProfileFormValues>
    control: Control<ProfileFormValues>
    defaultAvatar: string | undefined
    defaultName: string | undefined
}

/* Avatar Upload */
const EditAvatar = ({
    formError,
    control,
    defaultAvatar,
    defaultName,
}: AvatarFormFieldProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [avatarName, setAvatarName] = useState<string>("")
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

    // Handle avatar file selection
    const handleAvatarChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        onChange: (value: File | undefined) => void
    ) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            if (file.size > MAXIMUM_AVATAR_SIZE_MB * 1024 * 1024) {
                formError("avatar", { message: "Maximum 2 MB" })
            }
            setAvatarName(file.name)
            // setAvatarFile(file)

            // Create a preview URL
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string)
            }
            reader.readAsDataURL(file)

            // Update form value
            onChange(file)
            // form.setValue("avatar", file)
        }
    }

    // Remove selected avatar
    const removeAvatar = (onChange: (value: File | undefined) => void) => {
        setAvatarName("")
        setAvatarPreview(null)
        onChange(undefined)
        // form.setValue("avatar", undefined)
    }

    return (
        <FormField
            control={control}
            name='avatar'
            render={({ field }) => (
                <FormItem>
                    <div className='flex items-center flex-row items-start gap-6'>
                        <div className='relative'>
                            <Avatar className='h-24 w-24'>
                                <AvatarImage
                                    src={avatarPreview || defaultAvatar}
                                    alt={defaultName}
                                />
                                <AvatarFallback>
                                    {defaultName?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            {avatarPreview && (
                                <Button
                                    type='button'
                                    variant='destructive'
                                    size='icon'
                                    className='absolute -top-2 -right-2 h-6 w-6 rounded-full'
                                    onClick={() => removeAvatar(field.onChange)}
                                >
                                    <X className='h-3 w-3' />
                                </Button>
                            )}
                        </div>
                        <div className='flex flex-col gap-2'>
                            <FormLabel className='text-white flex items-center min-w-0'>
                                Profile Picture
                            </FormLabel>
                            {avatarName && (
                                <p className='text-xs text-white line-clamp-1'>
                                    Image name:{" "}
                                    <span
                                        onClick={() =>
                                            inputRef.current?.click()
                                        }
                                        className='font-bold underline underline-offset-2 cursor-pointer hover:text-blue-200 transition duration-300'
                                    >
                                        {avatarName}
                                    </span>
                                </p>
                            )}
                            <FormControl>
                                <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    className='text-white'
                                    asChild
                                >
                                    <label className='input'>
                                        <Camera className='h-4 w-4 mr-2' />
                                        Change
                                        <input
                                            ref={inputRef}
                                            type='file'
                                            accept='image/*'
                                            className='hidden'
                                            onChange={(e) =>
                                                handleAvatarChange(
                                                    e,
                                                    field.onChange
                                                )
                                            }
                                        />
                                    </label>
                                </Button>
                            </FormControl>
                            <FormDescription className='text-gray-300 text-xs'>
                                Recommended: Square JPG or PNG, at least 500x500
                                pixels and maximum 2 MB.
                            </FormDescription>
                            <FormMessage />
                        </div>
                    </div>
                </FormItem>
            )}
        />
    )
}

export default EditAvatar
