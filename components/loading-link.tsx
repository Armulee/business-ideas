"use client"

import Link, { LinkProps } from "next/link"
import { useLoading } from "./loading-provider"
import { useRouter } from "next/navigation"
import { MouseEvent } from "react"

interface LoadingLinkProps extends LinkProps {
    children: React.ReactNode
    className?: string
}

export function LoadingLink({ children, className, href, ...props }: LoadingLinkProps) {
    const { setIsLoading } = useLoading()
    const router = useRouter()

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        // Check if it's an external link or same page
        const url = href.toString()
        if (url.startsWith('http') || url.startsWith('#') || window.location.pathname === url) {
            return
        }

        // Show loading for internal navigation
        setIsLoading(true)
        
        // Small delay to ensure loading shows before navigation
        setTimeout(() => {
            router.push(url)
        }, 50)
        
        e.preventDefault()
    }

    return (
        <Link 
            href={href} 
            className={className} 
            onClick={handleClick}
            {...props}
        >
            {children}
        </Link>
    )
}