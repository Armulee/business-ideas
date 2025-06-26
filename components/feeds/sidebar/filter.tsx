"use client"

import { categories } from "@/components/store"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { SortBy } from ".."

export default function Filter({
    sortBy,
    setSortBy,
    category,
    setCategory,
}: {
    sortBy: SortBy
    setSortBy: React.Dispatch<React.SetStateAction<SortBy>>
    category: string
    setCategory: React.Dispatch<React.SetStateAction<string>>
}) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()

    // On mount (or when searchParams change), sync URL → state
    useEffect(() => {
        const urlCategory = searchParams.get("category") ?? ""
        const match = categories.find(
            (category) => category.toLowerCase() === urlCategory
        )
        setCategory(match ?? "")
    }, [searchParams, setCategory])

    // Helper to push new URL with updated params
    const updateCategoryQuery = (value: string) => {
        const params = new URLSearchParams(Array.from(searchParams.entries()))
        if (value) params.set("category", value.toLowerCase())
        else params.delete("category")
        const queryString = params.toString()
        router.push(`${pathname}${queryString ? "?" + queryString : ""}`)
    }
    return (
        <div className='pt-4 w-full flex items-start gap-3'>
            <div className='w-full'>
                <Select
                    value={sortBy}
                    onValueChange={(value) => setSortBy(value as SortBy)}
                >
                    <SelectTrigger className='w-full select'>
                        <SelectValue placeholder='Sort by' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='recent'>Recent</SelectItem>
                        <SelectItem value='mostUpvote'>Most Upvote</SelectItem>
                        <SelectItem value='mostViewed'>Most Viewed</SelectItem>
                        <SelectItem value='mostDiscussed'>
                            Most Discussed
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className='w-full relative'>
                <Select
                    value={category}
                    onValueChange={(value) => {
                        setCategory(value)
                        updateCategoryQuery(value)
                    }}
                >
                    <SelectTrigger className='w-full select'>
                        <SelectValue placeholder='Filter by category' />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((category) => (
                            <SelectItem
                                value={category}
                                key={`category-${category}`}
                            >
                                {category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {category ? (
                    <div
                        onClick={() => {
                            setCategory("")
                            updateCategoryQuery("")
                        }}
                        className='w-fit ml-auto text-white/80 underline underline-offset-4 text-xs text-right mt-3 hover:text-white cursor-pointer'
                    >
                        Clear Filter
                    </div>
                ) : null}
            </div>
        </div>
    )
}
