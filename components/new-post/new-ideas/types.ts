import { PollData, SummaryData, WidgetType } from "@/database/Widget"
import * as z from "zod"

// Define form schema with Zod
export const formSchema = z.object({
    title: z
        .string()
        .min(5, {
            message: "Title must be at least 5 characters.",
        })
        .max(100, {
            message: "Title must not exceed 100 characters.",
        }),
    category: z.string().min(1, {
        message: "Please select a category.",
    }),
    content: z
        .string()
        .min(20, {
            message: "Description must be at least 20 characters.",
        })
        .max(5000, {
            message: "Description must not exceed 5000 characters.",
        }),
    tags: z.array(z.string()).optional(),
    advancedSettings: z.object({
        privacy: z.enum(["public", "private", "followers"]),
        allowComments: z.boolean(),
        hideViewCount: z.boolean(),
        hideVoteCount: z.boolean(),
    }),
})

export type NewPostSchema = z.infer<typeof formSchema>

export interface PostData {
    author?: string
    title: string
    category: string
    content: string
    tags: string[]
    community: string
    advancedSettings: {
        privacy: "public" | "private" | "followers"
        allowComments: boolean
    }
    widgets?: { type: WidgetType; data?: SummaryData[] | PollData | string }[]
}
