import * as z from "zod"

// Form schema for validation
export const profileFormSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    bio: z
        .string()
        .max(160, {
            message: "Bio must not be longer than 160 characters.",
        })
        .optional(),
    location: z.string().optional(),
    website: z
        .string()
        .url({
            message: "Please enter a valid URL.",
        })
        .optional()
        .or(z.literal("")),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    x: z.string().optional(),
    linkedin: z.string().optional(),
    avatar: z.any().optional(), // Add this for the avatar field
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>
