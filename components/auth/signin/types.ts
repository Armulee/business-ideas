import { z } from "zod"

export const formSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().optional(),
    consent: z.boolean().refine((value) => value === true, {
        message: "You must agree to the terms and conditions",
    }),
})

export type FormValues = z.infer<typeof formSchema>
