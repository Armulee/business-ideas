"use client"

import { Loader2 } from "lucide-react"

interface AdminLoadingProps {
    size?: "sm" | "md" | "lg"
    className?: string
}

export default function AdminLoading({
    size = "md",
    className = "",
}: AdminLoadingProps) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8",
    }

    return (
        <div
            className={`flex items-center justify-center min-h-96 ${className}`}
        >
            <Loader2
                className={`${sizeClasses[size]} text-blue-400 animate-spin`}
            />
        </div>
    )
}
