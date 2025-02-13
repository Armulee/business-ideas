import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import React, { ChangeEvent, useEffect, useState } from "react"
import Suggestions from "./suggestions"
import { Idea } from "../Ideas"
import axios from "axios"

export default function SearchBar({
    showSuggestions,
    setShowSuggestions,
}: {
    showSuggestions: boolean
    setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.value) {
            setShowSuggestions(false)
        }
        setQuery(event.target.value)
    }

    const [query, setQuery] = useState<string>("")
    const [suggestions, setSuggestions] = useState<Idea[]>([])

    // fetching logic for searching data for suggestions
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!query) {
                setSuggestions([])
                return
            }
            try {
                const response = await axios.get(
                    `/api/suggestions?value=${query}`
                )

                if (response.data.length) {
                    setShowSuggestions(true)
                    setSuggestions(response.data.map((item: Idea) => item))
                }
            } catch (error) {
                console.error("Error fetching suggestions:", error)
            }
        }

        const debounce = setTimeout(fetchSuggestions, 300) // Debounce to avoid too many requests
        return () => clearTimeout(debounce)
    }, [query, setShowSuggestions])

    return (
        <div className='relative w-[80%] md:w-1/2 mx-auto'>
            <div className='relative mb-5'>
                <Input
                    type='text'
                    value={query}
                    onChange={onChange}
                    // onKeyDown={onKeyDown}
                    placeholder='Search for ideas...'
                    className='w-full pl-10 pr-4 py-2 text-white placeholder:text-white rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Search className='h-5 w-5 text-white' />
                </div>
                <Suggestions
                    suggestions={suggestions}
                    showSuggestions={showSuggestions}
                />
            </div>
        </div>
    )
}
