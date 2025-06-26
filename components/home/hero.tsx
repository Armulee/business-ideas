import { motion } from "framer-motion"
import { ArrowUp, Compass, Sparkles } from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"
import { useAlert } from "../provider/alert"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useTypewriter } from "react-simple-typewriter"

export default function Hero() {
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

    // Here headline
    const [text] = useTypewriter({
        words: [
            "Every Billion-Dollar Business Starts With an Idea",
            "Have an Idea? Share, Validate, and Refine!",
            "Discover What People Really Think of Your Business Idea",
            "Turn Your Idea into the Business People Actually Want",
            "Every Great Business Begins with Audience Feedback",
        ],
        loop: true,
        typeSpeed: 50,
        deleteSpeed: 50,
        delaySpeed: 4000, // pause between each word
    })

    return (
        <motion.div
            className='relative z-10 flex flex-col justify-center items-center'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className='w-full max-w-4xl mx-auto px-4 text-center'>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className='inline-block mb-4'
                >
                    <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/10 backdrop-blur-sm text-white'>
                        <Sparkles className='h-4 w-4 mr-2' />
                        Idea, Validate, Refine
                    </span>
                </motion.div>

                <h2 className='text-4xl sm:text-5xl md:text-6xl font-extrabold text-white min-h-[180px] flex justify-center items-center mb-6 leading-tight'>
                    {text}
                </h2>

                <motion.p
                    className='text-sm sm:text-md text-white/80 max-w-2xl mx-auto mb-8'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    Share your business idea, gain feedback from community, and
                    refine it to match your audience.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className='flex sm:flex-row flex-col justify-center items-center gap-2'
                >
                    <Link href='/post'>
                        <Button size='lg' className='button !px-8'>
                            Explore Ideas
                            <Compass className='h-5 w-5' />
                        </Button>
                    </Link>
                    <Button
                        size='lg'
                        onClick={handleNewPost}
                        className='button !px-8'
                    >
                        Share Your Idea
                        <ArrowUp className='h-5 w-5' />
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    )
}
