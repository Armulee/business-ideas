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
    categories: z
        .array(z.string())
        .min(1, {
            message: "Please select at least one category.",
        })
        .max(3, {
            message: "You can select up to 3 categories.",
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
        targetRegion: z.string().optional(),
        targetCountry: z.string().optional(),
    }),
})

export type NewPostSchema = z.infer<typeof formSchema>

export interface PostData {
    author?: string
    title: string
    categories: string[]
    content: string
    tags: string[]
    community: string
    status?: "draft" | "published" | "archived"
    advancedSettings: {
        privacy: "public" | "private" | "followers"
        allowComments: boolean
        hideViewCount: boolean
        hideVoteCount: boolean
        targetRegion?: string
        targetCountry?: string
    }
    widgets?: { type: WidgetType; data?: SummaryData[] | PollData | string }[]
}
