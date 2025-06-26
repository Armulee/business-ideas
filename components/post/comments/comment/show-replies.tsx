import { ChevronDown, ChevronUp } from "lucide-react"
import React from "react"

interface ShowRepliesProps {
    repliesLength: number
    setShowReplies: React.Dispatch<React.SetStateAction<boolean>>
    showReplies: boolean
}

export default function ShowReplies({
    repliesLength,
    setShowReplies,
    showReplies,
}: ShowRepliesProps) {
    return (
        <div
            onClick={() => setShowReplies((prev) => !prev)}
            className={`w-fit flex items-center gap-1 underline underline-offset-4 bg-transparent text-white/70 hover:bg-transparent hover:text-white text-xs px-1 mt-3 cursor-pointer group`}
        >
            {showReplies
                ? `Hide ${repliesLength > 1 ? "replies" : "reply"}`
                : `View ${repliesLength} ${
                      repliesLength > 1 ? "replies" : "reply"
                  }`}

            {showReplies ? (
                <ChevronUp className='opacity-80 w-4 h-4 group-hover:opacity-100' />
            ) : (
                <ChevronDown className='opacity-80 w-4 h-4 group-hover:opacity-100' />
            )}
        </div>
    )
}
