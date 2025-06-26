"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Plus } from "lucide-react"
import { Button } from "../ui/button"
import { useAlert } from "../provider/alert"
// import useMediaQuery from "@/hooks/use-media-query"

export default function NewPostButton() {
    const { data: session } = useSession()
    const router = useRouter()
    const alert = useAlert()

    const handleNewPost = () => {
        if (!session?.user) {
            alert.show({
                title: "Authentication Required",
                description: "Please log in to create new post.",
                cancel: "Cancel",
                action: "Log in",
                onAction: () => {
                    router.push("/auth/signin?callbackUrl=/new-post/new-ideas")
                },
            })
        } else {
            router.push("/new-post/new-ideas")
        }
    }

    return (
        <Button onClick={handleNewPost} className='button'>
            <Plus />
        </Button>
    )
}
