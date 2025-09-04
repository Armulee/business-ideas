"use client"

import { useEffect, useRef } from 'react'

interface ScrollAnimatorProps {
    children: React.ReactNode
    className?: string
    threshold?: number
    rootMargin?: string
}

export default function ScrollAnimator({ 
    children, 
    className = "scroll-animate", 
    threshold = 0.1, 
    rootMargin = "0px 0px -50px 0px" 
}: ScrollAnimatorProps) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate')
                }
            },
            {
                threshold,
                rootMargin,
            }
        )

        const currentRef = ref.current
        if (currentRef) {
            observer.observe(currentRef)
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef)
            }
        }
    }, [threshold, rootMargin])

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    )
}
