import { useEffect, useState } from "react"

const useMediaQuery = (media: string) => {
    const [size, setSize] = useState(false)

    useEffect(() => {
        const mediaQuery = window.matchMedia(media)
        setSize(mediaQuery.matches)

        const handleResize = () => setSize(mediaQuery.matches)
        mediaQuery.addEventListener("change", handleResize)

        return () => mediaQuery.removeEventListener("change", handleResize)
    }, [media])

    return size
}

export default useMediaQuery
