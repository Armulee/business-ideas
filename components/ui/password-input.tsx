"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "./input"
import { cn } from "@/lib/utils"

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string
}

export const PasswordInput = ({ className, ...props }: PasswordInputProps) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="relative">
            <Input
                {...props}
                type={showPassword ? "text" : "password"}
                className={cn("pr-10", className)}
            />
            <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 z-10"
                tabIndex={-1}
            >
                {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                )}
            </button>
        </div>
    )
}