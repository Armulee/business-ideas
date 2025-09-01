"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Calendar, FileText, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import Link from "next/link"
import { format } from "date-fns"

interface Author {
    _id: string
    profileId: number
    name: string
    email: string
    avatar?: string
}

interface Post {
    _id: string
    postId: number
    title: string
    author: Author
    content: string
    status: "draft" | "published" | "archived" | "restrict"
    createdAt: string
    updatedAt?: string
    publishedAt?: string
    categories: string[]
    tags?: string[]
    slug: string
    community: string
    viewCount?: number
    upvoteCount?: number
    downvoteCount?: number
    commentCount?: number
}

export default function AdminPostsPage() {
    const [posts, setPosts] = useState<Post[]>([])
    const [allPosts, setAllPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [searchTarget, setSearchTarget] = useState("title")
    const [startDate, setStartDate] = useState<Date>()
    const [endDate, setEndDate] = useState<Date>()
    const [startDateInput, setStartDateInput] = useState("")
    const [endDateInput, setEndDateInput] = useState("")
    const [hasMore, setHasMore] = useState(true)
    const [page, setPage] = useState(1)
    const [loadingMore, setLoadingMore] = useState(false)

    const fetchPosts = useCallback(async (pageNum: number) => {
        try {
            const response = await fetch(
                `/api/admin/post?page=${pageNum}&limit=50`
            )
            if (!response.ok) throw new Error("Failed to fetch posts")

            const data = await response.json()

            if (pageNum === 1) {
                setAllPosts(data.posts)
                setPosts(data.posts)
            } else {
                setAllPosts((prev) => [...prev, ...data.posts])
                setPosts((prev) => [...prev, ...data.posts])
            }

            setHasMore(data.hasMore)
        } catch (error) {
            console.error("Error fetching posts:", error)
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }, [])

    useEffect(() => {
        setLoading(true)
        setPage(1)
        fetchPosts(1)
    }, [fetchPosts])

    // Helper function to check if text starts with search term
    const matchesExactKeyword = (text: string, searchTerm: string): boolean => {
        const normalizedText = text.toLowerCase().trim()
        const normalizedSearch = searchTerm.toLowerCase().trim()
        
        if (!normalizedSearch) return false
        
        // Check if the text starts with the search term (as a phrase)
        return normalizedText.startsWith(normalizedSearch)
    }

    // Helper function to format input with automatic slashes
    const formatDateInput = (value: string, previousValue: string = ''): string => {
        // Check if user is backspacing (deleting)
        const isDeleting = value.length < previousValue.length
        
        // If deleting and the last character was a slash, remove the digit before it too
        if (isDeleting && previousValue.endsWith('/')) {
            const withoutSlash = previousValue.slice(0, -1)
            return withoutSlash.slice(0, -1)
        }
        
        // Remove all non-numeric characters
        const numericOnly = value.replace(/\D/g, '')
        
        // Add slashes automatically - show slash immediately after 2 digits
        if (numericOnly.length <= 1) {
            return numericOnly
        } else if (numericOnly.length === 2) {
            return `${numericOnly}/`
        } else if (numericOnly.length === 3) {
            return `${numericOnly.slice(0, 2)}/${numericOnly.slice(2)}`
        } else if (numericOnly.length === 4) {
            return `${numericOnly.slice(0, 2)}/${numericOnly.slice(2)}/`
        } else if (numericOnly.length >= 5) {
            return `${numericOnly.slice(0, 2)}/${numericOnly.slice(2, 4)}/${numericOnly.slice(4, 8)}`
        }
        return numericOnly
    }

    // Helper function to parse date from DD/MM/YY or DD/MM/YYYY format
    const parseDate = (dateStr: string): Date | null => {
        if (!dateStr.trim()) return null
        
        const parts = dateStr.split('/')
        if (parts.length !== 3) return null
        
        const day = parseInt(parts[0])
        const month = parseInt(parts[1]) - 1 // Month is 0-indexed
        let year = parseInt(parts[2])
        
        // Handle 2-digit years
        if (year < 100) {
            year += year < 50 ? 2000 : 1900
        }
        
        const date = new Date(year, month, day)
        if (isNaN(date.getTime())) return null
        
        return date
    }

    // Update date states when input changes
    useEffect(() => {
        const parsedStart = parseDate(startDateInput)
        if (parsedStart) setStartDate(parsedStart)
    }, [startDateInput])

    useEffect(() => {
        const parsedEnd = parseDate(endDateInput)
        if (parsedEnd) setEndDate(parsedEnd)
    }, [endDateInput])

    // Filter posts client-side based on search term and target
    useEffect(() => {
        if (searchTarget === "date" && (startDate || endDate)) {
            const filtered = allPosts.filter((post) => {
                const postDate = new Date(post.createdAt)
                
                if (startDate && endDate) {
                    return postDate >= startDate && postDate <= endDate
                } else if (startDate) {
                    return postDate >= startDate
                } else if (endDate) {
                    return postDate <= endDate
                }
                return true
            })
            setPosts(filtered)
        } else if (!searchTerm.trim()) {
            setPosts(allPosts)
        } else {
            const filtered = allPosts.filter((post) => {
                switch (searchTarget) {
                    case "title":
                        return matchesExactKeyword(post.title, searchTerm)
                    case "author":
                        return matchesExactKeyword(post.author.name, searchTerm)
                    case "id":
                        return post.postId.toString().startsWith(searchTerm)
                    case "category":
                        return post.categories.some((cat) =>
                            matchesExactKeyword(cat, searchTerm)
                        )
                    default:
                        return (
                            matchesExactKeyword(post.title, searchTerm) ||
                            matchesExactKeyword(post.author.name, searchTerm) ||
                            post.postId.toString().startsWith(searchTerm) ||
                            post.categories.some((cat) =>
                                matchesExactKeyword(cat, searchTerm)
                            ) ||
                            post.tags?.some((tag) =>
                                matchesExactKeyword(tag, searchTerm)
                            )
                        )
                }
            })
            setPosts(filtered)
        }
    }, [searchTerm, searchTarget, startDate, endDate, allPosts])

    const handleLoadMore = useCallback(() => {
        if (!loadingMore && hasMore) {
            setLoadingMore(true)
            const nextPage = page + 1
            setPage(nextPage)
            fetchPosts(nextPage)
        }
    }, [fetchPosts, hasMore, loadingMore, page])

    const handleScroll = useCallback(() => {
        if (
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 100
        ) {
            handleLoadMore()
        }
    }, [handleLoadMore])

    useEffect(() => {
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [handleScroll])

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-96'>
                <Loader2 className='w-8 h-8 animate-spin' />
            </div>
        )
    }

    return (
        <div className='p-6 space-y-6'>
            <div className='flex items-center justify-between'>
                <h1 className='text-2xl font-bold text-white'>
                    Posts Management
                </h1>
            </div>

            <div className='flex gap-4'>
                <div className='flex-1'>
                    <div className='flex gap-2'>
                        {searchTarget === "date" ? (
                            <div className='flex flex-1 gap-2'>
                                <div className='flex-1 relative'>
                                    <Popover>
                                        <Input
                                            placeholder='Start date (DD/MM/YY)'
                                            value={startDateInput}
                                            onChange={(e) => {
                                                const formatted = formatDateInput(e.target.value, startDateInput)
                                                setStartDateInput(formatted)
                                            }}
                                            className='flex-1 input border-white/20 bg-white/5 focus:border-purple-500/50 pr-10'
                                            onClick={(e) => {
                                                // Focus on input first for typing
                                                e.currentTarget.focus()
                                                // Also trigger popover
                                                setTimeout(() => {
                                                    const trigger = document.querySelector('[data-start-date-trigger]') as HTMLButtonElement
                                                    if (trigger) trigger.click()
                                                }, 0)
                                            }}
                                            onFocus={() => {
                                                // Show popover when input gets focus
                                                const trigger = document.querySelector('[data-start-date-trigger]') as HTMLButtonElement
                                                if (trigger) trigger.click()
                                            }}
                                            maxLength={8}
                                        />
                                        <PopoverTrigger asChild>
                                            <button
                                                data-start-date-trigger
                                                className='absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/10 rounded'
                                            >
                                                <CalendarIcon className='h-4 w-4 text-gray-400' />
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent className='w-auto p-0'>
                                            <CalendarComponent
                                                mode='single'
                                                selected={startDate}
                                                onSelect={(date) => {
                                                    setStartDate(date)
                                                    if (date) {
                                                        setStartDateInput(format(date, "dd/MM/yy"))
                                                    }
                                                }}
                                                defaultMonth={startDate || new Date()}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className='flex-1 relative'>
                                    <Popover>
                                        <Input
                                            placeholder='End date (DD/MM/YY)'
                                            value={endDateInput}
                                            onChange={(e) => {
                                                const formatted = formatDateInput(e.target.value, endDateInput)
                                                setEndDateInput(formatted)
                                            }}
                                            className='flex-1 input border-white/20 bg-white/5 focus:border-purple-500/50 pr-10'
                                            onClick={(e) => {
                                                // Focus on input first for typing
                                                e.currentTarget.focus()
                                                // Also trigger popover
                                                setTimeout(() => {
                                                    const trigger = document.querySelector('[data-end-date-trigger]') as HTMLButtonElement
                                                    if (trigger) trigger.click()
                                                }, 0)
                                            }}
                                            onFocus={() => {
                                                // Show popover when input gets focus
                                                const trigger = document.querySelector('[data-end-date-trigger]') as HTMLButtonElement
                                                if (trigger) trigger.click()
                                            }}
                                            maxLength={8}
                                        />
                                        <PopoverTrigger asChild>
                                            <button
                                                data-end-date-trigger
                                                className='absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/10 rounded'
                                            >
                                                <CalendarIcon className='h-4 w-4 text-gray-400' />
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent className='w-auto p-0'>
                                            <CalendarComponent
                                                mode='single'
                                                selected={endDate}
                                                onSelect={(date) => {
                                                    setEndDate(date)
                                                    if (date) {
                                                        setEndDateInput(format(date, "dd/MM/yy"))
                                                    }
                                                }}
                                                defaultMonth={endDate || new Date()}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        ) : (
                            <div className='relative flex-1'>
                                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                                <Input
                                    placeholder={`Search by ${searchTarget}...`}
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className='pl-10 input border-white/20 bg-white/5 focus:border-purple-500/50'
                                />
                            </div>
                        )}

                        <Select
                            value={searchTarget}
                            onValueChange={setSearchTarget}
                        >
                            <SelectTrigger className='w-28 select focus:border-purple-500/50'>
                                <SelectValue placeholder='Search by' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='title'>Title</SelectItem>
                                <SelectItem value='author'>Author</SelectItem>
                                <SelectItem value='id'>ID</SelectItem>
                                <SelectItem value='category'>
                                    Category
                                </SelectItem>
                                <SelectItem value='date'>Date</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {posts.map((post) => (
                    <Link
                        key={post._id}
                        href={`/admin/post/${post.postId}`}
                        className='block group h-full'
                    >
                        <Card className='h-full bg-white/10 backdrop-blur-md border-white/20 hover:shadow-md transition-shadow'>
                            <CardContent className='p-6'>
                                <div className='flex items-start justify-between gap-4'>
                                    <div className='flex-1 min-w-0'>
                                        <div className='flex items-center justify-between mb-3'>
                                            <Badge
                                                variant='outline'
                                                className='text-xs text-white border-white/20'
                                            >
                                                {post.community}
                                            </Badge>

                                            <div className='flex items-center gap-2 text-white'>
                                                {post.updatedAt ? (
                                                    <div className='flex items-center gap-1'>
                                                        <FileText className='h-4 w-4' />
                                                        <span className='text-[10px]'>
                                                            Updated{" "}
                                                            {format(
                                                                new Date(
                                                                    post.updatedAt
                                                                ),
                                                                "MMM dd, yyyy"
                                                            )}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className='flex items-center gap-1'>
                                                        <Calendar className='h-4 w-4' />
                                                        <span className='text-[10px]'>
                                                            {format(
                                                                new Date(
                                                                    post.createdAt
                                                                ),
                                                                "MMM dd, yyyy"
                                                            )}
                                                        </span>
                                                    </div>
                                                )}

                                                {post.viewCount !==
                                                    undefined && (
                                                    <span className='text-[11px]'>
                                                        {post.viewCount} views
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <h3 className='text-lg font-semibold text-white group-hover:text-blue-400 transition-colors mb-1 line-clamp-2'>
                                            {post.title}
                                        </h3>

                                        <div className='flex items-center gap-4 text-sm text-gray-300 mb-4'>
                                            <div className='flex items-center gap-2'>
                                                <Avatar className='h-6 w-6'>
                                                    <AvatarImage
                                                        src={post.author.avatar}
                                                    />
                                                    <AvatarFallback className='text-xs bg-white/20'>
                                                        {post.author.name
                                                            ?.charAt(0)
                                                            ?.toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className='hover:text-blue-400 transition-colors'>
                                                    {post.author.name}
                                                </span>
                                            </div>
                                        </div>

                                        <div className='flex flex-wrap gap-1'>
                                            {post.categories.map(
                                                (category, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant='secondary'
                                                        className='text-xs bg-white/10 text-white border-white/20'
                                                    >
                                                        {category}
                                                    </Badge>
                                                )
                                            )}
                                            {post.tags?.map((tag, index) => (
                                                <Badge
                                                    key={index}
                                                    variant='outline'
                                                    className='text-xs text-gray-300 border-gray-300'
                                                >
                                                    #{tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {loadingMore && (
                <div className='flex justify-center py-4'>
                    <Loader2 className='w-8 h-8 animate-spin text-white' />
                </div>
            )}

            {!hasMore && posts.length > 0 && (
                <div className='text-center py-4 text-gray-400'>
                    No more posts to load
                </div>
            )}

            {posts.length === 0 && !loading && (
                <div className='text-center py-8 text-gray-400'>
                    No published posts found
                </div>
            )}
        </div>
    )
}
