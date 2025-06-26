import { useEffect, useState } from "react"

export default function RateLimitNotice({
    initialSeconds,
}: {
    initialSeconds: number
}) {
    const [secondsLeft, setSecondsLeft] = useState(initialSeconds)

    useEffect(() => {
        if (secondsLeft <= 0) return

        const timer = setInterval(() => {
            setSecondsLeft((secs) => Math.max(secs - 1, 0))
        }, 1000)

        return () => clearInterval(timer)
    }, [secondsLeft])

    const minutes = Math.floor(secondsLeft / 60)
    const seconds = secondsLeft % 60
    const pad = (n: number) => n.toString().padStart(2, "0")

    return (
        <div className='max-w-sm mx-auto text-center p-4 bg-red-100 rounded'>
            <p className='text-lg font-medium text-yellow-800'>
                Too many login attempts.
            </p>
            <p className='mt-2 text-sm text-yellow-700'>
                Please try again in {pad(minutes)} minutes {pad(seconds)}{" "}
                seconds.
            </p>
        </div>
    )
}
