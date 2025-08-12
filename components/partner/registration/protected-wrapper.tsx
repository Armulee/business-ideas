"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Loading from "@/components/loading"
import { toast } from "sonner"

interface ProtectedWrapperProps {
    children: React.ReactNode
}

export default function ProtectedWrapper({ children }: ProtectedWrapperProps) {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === "loading") {
            return
        }

        if (!session?.user) {
            toast.error("Access Denied", {
                description: "Please sign in to access partner registration.",
            })
            router.push("/auth/signin?callbackUrl=/partner/registration")
        }
    }, [session, status, router])

    if (status === "loading") {
        return (
            <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center'>
                <Loading />
            </div>
        )
    }

    if (!session?.user) {
        return null
    }

    return <>{children}</>
}
