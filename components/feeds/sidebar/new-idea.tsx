import { useAlert } from "@/components/provider/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function NewIdea() {
    const router = useRouter()
    const { data: session } = useSession()
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
        <Card className='glassmorphism bg-transparent'>
            <CardContent className='p-4'>
                <Button
                    className='w-full glassmorphism bg-transparent hover:bg-white hover:text-blue-800 text-white font-medium'
                    onClick={handleNewPost}
                >
                    <Plus className='w-4 h-4 mr-2' />
                    Submit New Idea
                </Button>

                <p className='text-xs text-white/60 mt-2 text-center'>
                    Share your innovative ideas with the community
                </p>
            </CardContent>
        </Card>
    )
}
