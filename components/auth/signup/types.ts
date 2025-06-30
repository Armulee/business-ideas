import { z } from "zod"

export const formSchema = z.object({
    username: z
        .string()
        .min(1, { message: "Username must be at least 1 character" }),
    email: z.string().email({ message: "Invalid email address" }),
    consent: z.boolean().refine((value) => value === true, {
        message: "You must agree to the terms and conditions",
    }),
})

export type FormValues = z.infer<typeof formSchema>
