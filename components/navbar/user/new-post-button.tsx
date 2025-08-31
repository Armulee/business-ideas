"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Plus, ChevronDown, FileText, Trash2 } from "lucide-react"
import { Button } from "../../ui/button"
import { useAlert } from "../../provider/alert"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "../../ui/dropdown-menu"
import { useState, useEffect, useCallback, useRef } from "react"
import axios from "axios"

interface Draft {
    _id: string
    title: string
    community: string
    lastSavedAt: string
    createdAt: string
}

export default function NewPostButton() {
    const { data: session } = useSession()
    const router = useRouter()
    const alert = useAlert()
    const [drafts, setDrafts] = useState<Draft[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const hasFetchedRef = useRef(false)

    const fetchDrafts = useCallback(async () => {
        try {
            setIsLoading(true)
            const { data } = await axios.get("/api/post/draft")
            setDrafts(data.drafts || [])
            console.log("Fetched drafts:", data.drafts?.length || 0)
        } catch (error) {
            console.error("Failed to fetch drafts:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Fetch drafts when user is authenticated (only once)
    useEffect(() => {
        if (session?.user && !hasFetchedRef.current) {
            hasFetchedRef.current = true
            fetchDrafts()
        }
    }, [session?.user, fetchDrafts])

    const handleNewPost = () => {
        if (!session?.user) {
            alert.show({
                title: "Authentication Required",
                description: "Please log in to create new post.",
                cancel: "Cancel",
                action: "Log in",
                onAction: () => {
                    router.push("/auth/signin?callbackUrl=/new-post/new-ideas")
                },
            })
        } else {
            router.push("/new-post/new-ideas")
        }
    }

    const handleDraftClick = (draftId: string) => {
        router.push(`/new-post/new-ideas?draft=${draftId}`)
    }

    const handleDeleteDraft = async (draftId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        try {
            await axios.delete(`/api/post/draft?id=${draftId}`)
            setDrafts(drafts.filter((draft) => draft._id !== draftId))
            alert.show({
                title: "Draft Deleted",
                description: "Draft has been successfully deleted.",
                action: "OK",
            })
        } catch (error) {
            console.error("Failed to delete draft:", error)
            alert.show({
                title: "Error",
                description: "Failed to delete draft. Please try again.",
                action: "OK",
            })
        }
    }

    // Add a method to refresh drafts (can be called from other components)
    const refreshDrafts = useCallback(() => {
        if (session?.user) {
            fetchDrafts()
        }
    }, [session?.user, fetchDrafts])

    // Expose refreshDrafts method globally (optional)
    useEffect(() => {
        ;(
            window as typeof window & { refreshNewPostButton?: () => void }
        ).refreshNewPostButton = refreshDrafts
        return () => {
            delete (
                window as typeof window & { refreshNewPostButton?: () => void }
            ).refreshNewPostButton
        }
    }, [refreshDrafts])

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const minutes = Math.floor(diff / 60000)

        if (minutes < 1) return "Just now"
        if (minutes < 60) return `${minutes}m ago`

        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours}h ago`

        const days = Math.floor(hours / 24)
        if (days < 7) return `${days}d ago`

        return date.toLocaleDateString()
    }

    // If user is not authenticated, show simple button
    if (!session?.user) {
        return (
            <Button onClick={handleNewPost} className='button'>
                <Plus />
            </Button>
        )
    }

    // If still loading drafts, show simple button to prevent immediate redirect
    if (isLoading) {
        return (
            <Button disabled className='button'>
                <Plus />
            </Button>
        )
    }

    // If user has no drafts, show simple button
    if (drafts.length === 0) {
        return (
            <Button onClick={handleNewPost} className='button'>
                <Plus />
            </Button>
        )
    }

    // Show dropdown with drafts for authenticated users with saved drafts
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className='button flex items-center gap-1 relative'>
                    <Plus className='w-4 h-4' />
                    <ChevronDown className='w-3 h-3' />
                    {drafts.length > 0 && (
                        <span className='absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center'>
                            {drafts.length > 9 ? "9+" : drafts.length}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='center' className='w-80'>
                <DropdownMenuItem
                    onClick={handleNewPost}
                    className='font-medium'
                >
                    <Plus className='w-4 h-4 mr-2' />
                    Create New Post
                </DropdownMenuItem>
                {drafts.length > 0 && (
                    <>
                        <DropdownMenuSeparator />
                        <div className='px-2 py-1 text-xs font-medium text-gray-500'>
                            Saved Drafts ({drafts.length})
                        </div>
                        {drafts.map((draft) => (
                            <DropdownMenuItem
                                key={draft._id}
                                onClick={() => handleDraftClick(draft._id)}
                                className='flex items-center justify-between p-3 hover:bg-gray-50'
                            >
                                <div className='flex items-start gap-2 flex-1 min-w-0'>
                                    <FileText className='w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0' />
                                    <div className='flex-1 min-w-0'>
                                        <div className='font-medium text-sm truncate'>
                                            {draft.title || "Untitled Draft"}
                                        </div>
                                        <div className='text-xs text-gray-500'>
                                            {formatDate(draft.lastSavedAt)}
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={(e) =>
                                        handleDeleteDraft(draft._id, e)
                                    }
                                    className='h-6 w-6 p-0 text-gray-400 hover:text-red-500'
                                >
                                    <Trash2 className='w-3 h-3' />
                                </Button>
                            </DropdownMenuItem>
                        ))}
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
