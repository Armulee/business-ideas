"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import JoinlistSuccessDialog from "./success-dialog"
import { toast } from "sonner"

export default function JoinlistWrapper() {
    const searchParams = useSearchParams()
    const { data: session } = useSession()
    const [showSuccessDialog, setShowSuccessDialog] = useState(false)


    useEffect(() => {
        // Check if user came from joinlist authentication
        const joinlistAuth = searchParams.get('joinlist_auth')
        const isAuthenticated = session?.user

        if (joinlistAuth === 'true' && isAuthenticated) {
            setShowSuccessDialog(true)
        }
    }, [searchParams, session])

    const handleSave = async (marketing: boolean) => {
        if (!session?.user?.id) {
            toast.error("User session not found")
            return
        }


        try {
            const response = await fetch('/api/joinlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    profileId: session.user.id,
                    type: 'business',
                    marketing,
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to save joinlist data')
            }

            toast.success("Successfully joined the list!")
            setShowSuccessDialog(false)
            
            // Clean up URL parameters
            const url = new URL(window.location.href)
            url.searchParams.delete('joinlist_auth')
            window.history.replaceState({}, '', url.toString())
        } catch (error) {
            console.error('Error saving joinlist data:', error)
            toast.error("Failed to save. Please try again.")
        }
    }

    return (
        <JoinlistSuccessDialog
            open={showSuccessDialog}
            onSave={handleSave}
        />
    )
}