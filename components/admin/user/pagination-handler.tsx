/**
 * PaginationHandler component manages infinite scroll and load more functionality
 * 
 * Provides:
 * - Automatic infinite scroll detection
 * - Manual load more button
 * - Pagination status display
 */

import { useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Pagination } from "./types"
import { TIMING_CONSTANTS } from "./mappings"

interface PaginationHandlerProps {
    pagination: Pagination | null
    loading: boolean
    usersCount: number
    onLoadMore: () => void
}

/**
 * Custom hook for handling infinite scroll functionality
 * @param hasNext - Whether there are more pages to load
 * @param loading - Current loading state
 * @param onLoadMore - Function to call when more data should be loaded
 */
function useInfiniteScroll(hasNext: boolean, loading: boolean, onLoadMore: () => void) {
    const handleScroll = useCallback(() => {
        // Check if user scrolled near bottom (within configured threshold)
        if (
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - TIMING_CONSTANTS.SCROLL_THRESHOLD_PX
        ) {
            // Load more users if there are more pages available
            if (hasNext && !loading) {
                onLoadMore()
            }
        }
    }, [hasNext, loading, onLoadMore])

    useEffect(() => {
        // Add scroll event listener
        window.addEventListener("scroll", handleScroll)
        // Cleanup function to remove listener on unmount
        return () => window.removeEventListener("scroll", handleScroll)
    }, [handleScroll])
}

/**
 * PaginationHandler component for managing user list pagination
 */
export function PaginationHandler({
    pagination,
    loading,
    usersCount,
    onLoadMore,
}: PaginationHandlerProps) {
    // Set up infinite scroll functionality
    useInfiniteScroll(pagination?.hasNext ?? false, loading, onLoadMore)

    return (
        <div className="space-y-4">
            {/* Manual load more button (backup for infinite scroll) */}
            {pagination?.hasNext && (
                <div className="text-center pt-4">
                    <Button
                        onClick={onLoadMore}
                        disabled={loading}
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                        {loading ? "Loading..." : "Load More"}
                    </Button>
                </div>
            )}

            {/* Show current pagination status */}
            {pagination && (
                <div className="text-center text-gray-400 text-sm">
                    Showing {usersCount} of {pagination.total} users
                </div>
            )}
        </div>
    )
}