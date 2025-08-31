"use client"

import { useEffect, useState } from "react"
import { PostCardSkeleton } from "./post-card-skeleton"

export const ResponsivePostListSkeletons = ({
    className,
}: {
    className?: string
}) => {
    const [showThird, setShowThird] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            setShowThird(window.innerWidth >= 1350)
        }

        handleResize()

        window.addEventListener("resize", handleResize)

        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <div className={`${className} w-[90%] mx-auto flex gap-5`}>
            <PostCardSkeleton className='flex-1' />
            <PostCardSkeleton className='hidden md:block flex-1' />
            {showThird && <PostCardSkeleton className='flex-1' />}
        </div>
    )
}