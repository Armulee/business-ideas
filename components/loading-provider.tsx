"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Loading from "./loading"

const LoadingContext = createContext<{
    isLoading: boolean
    setIsLoading: (loading: boolean) => void
}>({
    isLoading: false,
    setIsLoading: () => {},
})

export const useLoading = () => useContext(LoadingContext)

export function LoadingProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true) // Start with loading true to prevent layout shift
    const [isInitialized, setIsInitialized] = useState(false)
    const pathname = usePathname()

    // Initialize loading state on mount
    useEffect(() => {
        // Small delay to allow page to settle, then hide loading
        const timer = setTimeout(() => {
            setIsLoading(false)
            setIsInitialized(true)
        }, 300)

        return () => clearTimeout(timer)
    }, [])

    // Clear loading when route changes (only after initialization)
    useEffect(() => {
        if (isInitialized) {
            setIsLoading(false)
        }
    }, [pathname, isInitialized])

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {isLoading ? <Loading /> : children}
        </LoadingContext.Provider>
    )
}
