import { useEffect, useRef } from "react"
import { Textarea } from "./textarea"

export default function AutoHeightTextarea({
    className = "",
    ...props
}: {
    className?: string
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    const ref = useRef<HTMLTextAreaElement>(null)

    // Every time the value changes, reset height then grow to fit content
    useEffect(() => {
        const el = ref.current
        if (!el) return

        // 1) reset to minimum so it can shrink if needed
        el.style.height = `40px`
        // 2) expand to show all text (including wrapped lines)
        el.style.height = `${el.scrollHeight}px`
    }, [props.value])

    return (
        <Textarea
            {...props}
            ref={ref}
            className={`${className} input min-h-[40px] max-h-[500px] resize-none overflow-hidden-x`}
        />
    )
}
