import * as z from "zod"

const MAX_AVATAR_SIZE_MB = 2 // 2MB

// Form schema for validation
export const profileFormSchema = z.object({
    name: z.string().min(2, {
        message: "Name is required to be at least 2 characters.",
    }),
    bio: z
        .string()
        .max(250, {
            message: "Bio must not be longer than 160 characters.",
        })
        .optional(),
    location: z.string().optional(),
    website: z
        .string()
        .url({
            message: "Please enter a valid URL.",
        })
        .optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    x: z.string().optional(),
    linkedin: z.string().optional(),
    avatar: z
        .any()
        .refine(
            (file) => {
                if (!file || !(file instanceof File)) return true
                return (file as File).size <= MAX_AVATAR_SIZE_MB * 1024 * 1024
            },
            { message: `Max ${MAX_AVATAR_SIZE_MB} MB` }
        )
        .optional(), // Add this for the avatar field
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>
