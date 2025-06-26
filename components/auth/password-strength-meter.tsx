"use client"

import { useEffect, useState } from "react"
import zxcvbn from "zxcvbn"

interface StrengthMeterProps {
    password: string
}

const labels = ["Very Weak", "Weak", "Medium", "Good", "Strong"]
const colors = ["#f7847c", "#e3a776", "#d1b838", "#8fd138", "#44bd39"]

export default function PasswordStrengthMeter({
    password,
}: StrengthMeterProps) {
    const [score, setScore] = useState(0)

    useEffect(() => {
        if (password) {
            const { score } = zxcvbn(password)
            setScore(score)
        } else {
            setScore(0)
        }
    }, [password])

    const pct = (score / (labels.length - 1)) * 100

    return (
        <div className='mt-2'>
            <div className='w-full h-2 bg-gray-200 rounded overflow-hidden'>
                <div
                    className='h-full rounded'
                    style={{
                        width: `${pct}%`,
                        backgroundColor: colors[score],
                        transition: "width 0.3s ease",
                    }}
                />
            </div>
            <div
                className='mt-1 text-xs font-medium'
                style={{ color: colors[score] }}
            >
                {labels[score]}
            </div>
        </div>
    )
}
