import { IPostPopulated } from "@/database/Post"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export default function useRepost(post: IPostPopulated | null | undefined) {
    const { data: session } = useSession()
    const handleRepost = async () => {
        try {
            const { status } = await axios.patch("/api/repost", {
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
    const [reposted, setReposted] = useState<boolean | null>(null)
    useEffect(() => {
        if (session?.user && reposted !== null) {
            async function detectRepost() {
                try {
                    const { data } = await axios.get(
                        `/api/repost/${session?.user.id}`
                    )

                    setReposted(data.includes(post?._id))
                } catch (err) {
                    console.error(err)
                }
            }

            detectRepost()
        }
    }, [session, post, reposted])

    return { reposted, handleRepost }
}
