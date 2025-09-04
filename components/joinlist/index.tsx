"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { CheckCircle, Mail } from "lucide-react"
import axios from "axios"

interface JoinlistProps {
    type: "business" | "partner"
}

const Joinlist = ({ type }: JoinlistProps) => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { data: session } = useSession()
    const [showDialog, setShowDialog] = useState(false)
    const [marketing, setMarketing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        // Check if URL contains joinlist param and user is authenticated
        const joinlistParam = searchParams.get('joinlist')
        if (joinlistParam === type && session?.user) {
            setShowDialog(true)
        }
    }, [searchParams, session, type])

    const handleProceed = async () => {
        if (!session?.user?.profileId) {
            console.error('No profile ID found')
            return
        }

        try {
            setIsLoading(true)
            
            const response = await axios.post('/api/joinlist', {
                profile: session.user.profileId,
                type,
                marketing
            })
            
            console.log('Joinlist entry created:', response.data)

            // Remove joinlist param from URL
            const currentUrl = new URL(window.location.href)
            currentUrl.searchParams.delete('joinlist')
            router.replace(currentUrl.pathname + currentUrl.search)
            
            setShowDialog(false)
        } catch (error) {
            console.error('Error saving joinlist data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const getDialogContent = () => {
        if (type === "business") {
            return {
                title: "Successfully Enrolled in Business List!",
                description: "Thank you for joining our exclusive business list! Our community partners will now be able to promote your business and help you reach new customers.",
                thankYouText: "We're excited to help grow your business through our community-driven marketing platform."
            }
        } else {
            return {
                title: "Successfully Enrolled in Partner List!",
                description: "Thank you for joining our partner program! You can now start promoting businesses and earning commissions.",
                thankYouText: "We're excited to have you as part of our marketing partner community."
            }
        }
    }

    const content = getDialogContent()

    return (
        <Dialog open={showDialog} onOpenChange={() => {}}>
            <DialogContent 
                className='max-w-md mx-auto bg-gray-800 border-gray-700 text-white'
                hideCloseButton={true}
            >
                <DialogHeader>
                    <div className='flex justify-center mb-4'>
                        <div className='p-3 rounded-full bg-green-500/20 border border-green-500/30'>
                            <CheckCircle className='h-8 w-8 text-green-400' />
                        </div>
                    </div>
                    <DialogTitle className='text-center text-2xl font-bold text-white'>
                        {content.title}
                    </DialogTitle>
                    <DialogDescription className='text-center text-gray-200 mt-2'>
                        {content.description}
                    </DialogDescription>
                </DialogHeader>

                <div className='mt-6 space-y-4'>
                    <p className='text-center text-gray-300 text-sm'>
                        {content.thankYouText}
                    </p>

                    <div className='flex items-center space-x-2 p-4 bg-gray-700/50 rounded-lg border border-gray-600'>
                        <Checkbox
                            id='marketing'
                            checked={marketing}
                            onCheckedChange={(checked) => setMarketing(checked as boolean)}
                            className='border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600'
                        />
                        <Label 
                            htmlFor='marketing' 
                            className='text-sm text-gray-200 cursor-pointer flex items-center gap-2'
                        >
                            <Mail className='h-4 w-4' />
                            We will email marketing you to notify you when the feature is available
                        </Label>
                    </div>

                    <Button
                        onClick={handleProceed}
                        disabled={isLoading}
                        className='w-full button !bg-blue-700 hover:!bg-blue-600'
                    >
                        {isLoading ? "Processing..." : "Proceed"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default Joinlist