import { useAlert } from "@/components/provider/alert"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function BecomePartner() {
    const router = useRouter()
    const { data: session } = useSession()
    const alert = useAlert()
    const handleClick = () => {
        if (!session) {
            alert.show({
                title: "Please log in before continuing.",
                description: "You need to log in to become a partner.",
                cancel: "Cancel",
                action: "Log in",
                onAction: () => {
                    router.push(
                        `/auth/signin?callbackUrl=${encodeURIComponent("/partner/registration")}`
                    )
                },
            })
            return
        }

        router.push("/partner/registration")
    }
    return (
        <Button
            size='lg'
            className='button text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 relative !border-white/50 z-0'
            onClick={handleClick}
        >
            <Sparkles className='mr-2 h-5 w-5' />
            Become a Partner
            <ArrowRight className='ml-2 h-5 w-5' />
            <div className='absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-lg opacity-75 animate-pulse -z-10' />
        </Button>
    )
}
