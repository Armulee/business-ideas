// components/PasswordRequirements.tsx
"use client"

import { useWatch, Control } from "react-hook-form"
import { CheckCircle, XCircle } from "lucide-react"

interface PasswordRequirementsProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<any>
    className?: string
}

export default function PasswordRequirements({
    control,
    className = "",
}: PasswordRequirementsProps) {
    // grab both fields
    const password = useWatch({ control, name: "password" }) || ""
    const confirmPassword = useWatch({ control, name: "confirmPassword" }) || ""

    // define your rules
    const rules = [
        {
            label: "At least 8 characters",
            isValid: password.length >= 8,
        },
        {
            label: "One uppercase letter",
            isValid: /[A-Z]/.test(password),
        },
        {
            label: "One lowercase letter",
            isValid: /[a-z]/.test(password),
        },
        {
            label: "One digit",
            isValid: /[0-9]/.test(password),
        },
        {
            label: "One special character",
            isValid: /[^A-Za-z0-9]/.test(password),
        },
        {
            label: "Passwords match",
            isValid: password !== "" && password === confirmPassword,
        },
    ]

    return (
        <ul className={`${className} mb-4 space-y-1 text-sm`}>
            {rules.map((rule) => (
                <li key={rule.label} className='flex items-center'>
                    {rule.isValid ? (
                        <CheckCircle className='h-4 w-4 text-green-500 mr-2' />
                    ) : (
                        <XCircle className='h-4 w-4 text-red-500 mr-2' />
                    )}
                    <span
                        className={
                            rule.isValid ? "text-green-400" : "text-red-400"
                        }
                    >
                        {rule.label}
                    </span>
                </li>
            ))}
        </ul>
    )
}
