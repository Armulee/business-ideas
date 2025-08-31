"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import Loading from "@/components/loading"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        if (status === "loading") {
            // Still loading session data, show loading component
            return
        }

        if (session?.user) {
            // User is authenticated, redirect them away from auth pages
            const callbackUrl = searchParams.get("callbackUrl") || "/"

            toast("Already signed in", {
                description:
                    "You are already signed in. Please log out before accessing this page.",
            })

            router.push(callbackUrl)
        }
    }, [session, status, router, searchParams])

    // Show loading while session is being checked
    if (status === "loading" || session?.user) {
        return (
            <div className='w-[90%] mx-auto mt-12 mb-10'>
                <Loading />
            </div>
        )
    }

    // User is not authenticated, show the auth form with original layout styling
    return (
        <div className='pt-10 overflow-y-hidden'>
            <div className='w-[90%] mx-auto'>{children}</div>
        </div>
    )
}
