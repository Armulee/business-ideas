import { IPostPopulated } from "@/database/Post"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export default function useBookmark(post: IPostPopulated | null | undefined) {
    const { data: session } = useSession()
    const handleBookmark = async () => {
        try {
            const { status } = await axios.patch("/api/bookmark", {
                postId: post?._id,
                profileId: session?.user.id,
            })

            if (status === 200) {
                location.reload()
            }
        } catch (err) {
            console.error(err)
        }
    }
    const [bookmarked, setBookmarked] = useState<boolean | null>(null)
    useEffect(() => {
        if (session && bookmarked !== null) {
            async function detectBookmark() {
                try {
                    const { data } = await axios.get(
                        `/api/bookmark/${session?.user.id}`
                    )

                    setBookmarked(data.includes(post?._id))
                } catch (err) {
                    console.error(err)
                }
            }

            detectBookmark()
        }
    }, [session, post, bookmarked])

    return { bookmarked, handleBookmark }
}
