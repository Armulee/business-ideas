"use client"

import axios from "axios"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import PostCard from "../post-card"
import FeedsSidebar from "./sidebar"
import type { IPostPopulated } from "@/database/Post"
import Filter from "./sidebar/filter"
import Tags from "./sidebar/tags"
import Contributors from "./sidebar/contributors"
import Announcements from "./sidebar/annoucements"
import mongoose from "mongoose"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useDebounce } from "use-debounce"
import { useSearchParams } from "next/navigation"
import Loading from "../loading"
import { PostCardSkeleton } from "@/components/skeletons"

export type PopularTags = {
    tag: string
    count: number
}[]

export type TopContributors = {
    profile: {
        _id: mongoose.Types.ObjectId
        name: string
        email: string
        avatar?: string
        profileId: number
    }
    count: number
}[]

export type SortBy = "recent" | "mostUpvote" | "mostViewed" | "mostDiscussed"

const Feeds = () => {
    const [posts, setPosts] = useState<IPostPopulated[]>([])
    // const [filteredPosts, setFilteredPosts] = useState<IPostPopulated[]>([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(true)

    const [searchKeyword, setSearchKeyword] = useState<string>("")
    // debounce the keyword so we only hit the API once the user pauses
    const [debouncedKeyword] = useDebounce(searchKeyword, 600)

    const [sortBy, setSortBy] = useState<SortBy>("recent")
    const [category, setCategory] = useState<string>("")

    // Initial loading for beautiful ui loading
    const [initialLoading, setInitialLoading] = useState(true)
    useEffect(() => {
        setTimeout(() => setInitialLoading(false), 1000)
    }, [])

    // Handle head text change
    const headText = useMemo(() => {
        // 1) Keyword takes highest precedence
        if (searchKeyword) {
            return category
                ? `"${searchKeyword}" in ${category} ideas`
                : `"${searchKeyword}"`
        }
        // 2) Next, if only category
        if (category) {
            return `${category} Ideas`
        }
        // 3) Finally, fallback to sort-by text
        const headTextMapWith = {
            recent: "Latest Posts",
            mostUpvote: "Most Trending Posts",
            mostViewed: "Most Viewed Posts",
            mostDiscussed: "Most Discussed Posts",
        } as const

        return headTextMapWith[sortBy] ?? headTextMapWith.recent
    }, [searchKeyword, category, sortBy])

    // Handle sub-head text change
    const subHeadText = useMemo(() => {
        // 1) Keyword or category takes highest precedence
        if (searchKeyword || category) {
            return posts.length === 0
                ? "No results found"
                : `Showing ${posts.length} ideas`
        }
        // 2) Finally, fallback to sort-by text
        const subHeadTextMapWith = {
            recent: "Discover the latest innovative ideas from our community",
            mostUpvote: "Discover the most upvoted ideas of our community",
            mostViewed: "Discover the most viewed ideas in our community",
            mostDiscussed: "Discover the most discussed ideas in our community",
        } as const

        return subHeadTextMapWith[sortBy] ?? subHeadTextMapWith.recent
    }, [searchKeyword, category, sortBy, posts.length])

    // unified fetch: if there's a debouncedKeyword, call /api/search,
    // otherwise fall back to /api/posts
    const fetchData = useCallback(
        async (pageNum: number) => {
            setLoading(true)
            const params = new URLSearchParams({
                query: debouncedKeyword,
                category: category || "All",
                sortBy,
                page: String(pageNum),
            })

            try {
                const { data } = await axios.get<IPostPopulated[]>(
                    `/api/search?${params.toString()}`
                )
                // set pagination flags
                setHasMore(data.length === 10) // or your page-size check
                if (pageNum === 1) setPosts(data)
                else setPosts((prev) => [...prev, ...data])
            } catch (err) {
                console.error("Failed to load posts:", err)
            } finally {
                setLoading(false)
            }
        },
        [debouncedKeyword, category, sortBy]
    )

    // whenever debouncedKeyword, category, sortBy change, reload page 1
    useEffect(() => {
        setPage(1)
        fetchData(1)
    }, [debouncedKeyword, category, sortBy, fetchData])

    // Load more page
    const loadMore = () => {
        const next = page + 1
        setPage(next)
        fetchData(next)
    }

    const goBack = () => {
        if (page === 1) return
        const prev = page - 1
        setPage(prev)
        fetchData(prev)
    }

    // Get stats for side bar
    const [popularTags, setPopularTags] = useState<PopularTags>([])
    const [topContributors, setTopContributors] = useState<TopContributors>([])
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get("/api/sidebar")
                setPopularTags(data.popularTags)
                setTopContributors(data.topContributors)
            } catch (err) {
                console.error("Failed to fetch stats:", err)
            }
        }
        fetchStats()
    }, [])

    // Hidden Announcement
    const hiddenAnnoucement = true

    // Focus on the search input if found the params search
    const searchRef = useRef<HTMLInputElement>(null)
    const searchParams = useSearchParams()
    const search = searchParams.get("search")
    useEffect(() => {
        if (search !== null && searchRef.current) {
            searchRef.current.focus()
        }
    }, [search])
    // On blur, drop the “search” param and replace the URL
    const handleBlur = () => {
        if (search === null) return // nothing to remove

        // strip ?search
        const params = new URLSearchParams(window.location.search)
        params.delete("search")

        // rebuild path + any remaining params
        const newUrl =
            window.location.pathname +
            (params.toString() ? `?${params.toString()}` : "")

        // replace the current history entry (no reload, no new entry)
        window.history.replaceState(null, "", newUrl)
    }

    return (
        <>
            {!initialLoading ? (
                <div className='min-h-screen pt-24 pb-36 relative'>
                    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                        <div className='flex gap-4'>
                            {/* Main Content */}
                            <main className='flex-1 relative'>
                                <section>
                                    {/* RESULT */}
                                    <div className='mb-3'>
                                        <h2 className='text-2xl font-bold text-white mb-2'>
                                            {headText}
                                        </h2>
                                        <p className='text-white/80'>
                                            {subHeadText}
                                        </p>
                                    </div>
                                    {/* SEACRH */}
                                    <div className='w-full mb-10 glassmorphism p-4'>
                                        <Input
                                            ref={searchRef}
                                            onBlur={handleBlur}
                                            onChange={(e) =>
                                                setSearchKeyword(e.target.value)
                                            }
                                            className='input'
                                            placeholder='Enter searching keywords...'
                                        />
                                        <Filter
                                            sortBy={sortBy}
                                            setSortBy={setSortBy}
                                            category={category}
                                            setCategory={setCategory}
                                        />
                                    </div>

                                    {/* POSTS */}
                                    {!loading ? (
                                        <div className='space-y-4'>
                                            {posts.map((post) => (
                                                <PostCard
                                                    className='mb-4'
                                                    key={post._id.toString()}
                                                    post={post}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <PostCardSkeleton />
                                    )}

                                    {!posts.length ? null : (
                                        <div className='flex justify-around items-center mt-6'>
                                            <ChevronLeft
                                                className={`cursor-pointer ${
                                                    page === 1
                                                        ? "opacity-20 pointer-events-none"
                                                        : ""
                                                }`}
                                                onClick={goBack}
                                            />

                                            <Button className='button'>
                                                {page}
                                            </Button>

                                            <ChevronRight
                                                className={`cursor-pointer ${
                                                    !hasMore
                                                        ? "opacity-20 pointer-events-none"
                                                        : ""
                                                }`}
                                                onClick={loadMore}
                                            />
                                        </div>
                                    )}
                                </section>

                                {/* Mobile Sidebar */}
                                <div className='block md:hidden space-y-4 mt-6'>
                                    <Tags popularTags={popularTags} />
                                    <Contributors
                                        topContributors={topContributors}
                                    />
                                    <Announcements hidden={hiddenAnnoucement} />
                                </div>
                            </main>

                            {/* Desktop Sidebar */}
                            <aside className='hidden md:block w-80'>
                                <div className='sticky top-24'>
                                    <div className='h-screen space-y-4 overflow-y-scroll pb-32'>
                                        <FeedsSidebar
                                            popularTags={popularTags}
                                            topContributors={topContributors}
                                            hiddenAnnoucement={
                                                hiddenAnnoucement
                                            }
                                        />
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            ) : (
                <Loading />
            )}
        </>
    )
}

export default Feeds
