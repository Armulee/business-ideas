"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import axios from "axios"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sparkles, Users, Lightbulb, MessageSquare } from "lucide-react"
import { Logo } from "./logo"

export default function WelcomeDialog() {
    const { data: session, status } = useSession()
    const [isOpen, setIsOpen] = useState(false)
    const [step, setStep] = useState(1)

    useEffect(() => {
        // Only check for authenticated users
        if (status === "authenticated" && session?.user?.email) {
            checkWelcomeStatus()
        }
    }, [session, status])

    const checkWelcomeStatus = async () => {
        try {
            const response = await axios.get(`/api/profile/welcome-status`)
            const { hasSeenWelcome } = response.data

            if (!hasSeenWelcome) {
                setIsOpen(true)
            }
        } catch (error) {
            console.error("Failed to check welcome status:", error)
        }
    }

    const markWelcomeAsSeen = async () => {
        try {
            await axios.patch(`/api/profile/mark-welcome-seen`)
        } catch (error) {
            console.error("Failed to mark welcome as seen:", error)
        }
    }

    const handleClose = async () => {
        setIsOpen(false)
        await markWelcomeAsSeen()
    }

    const nextStep = () => {
        if (step < 3) {
            setStep(step + 1)
        } else {
            handleClose()
        }
    }

    const features = [
        {
            icon: Lightbulb,
            title: "Share Your Ideas",
            description:
                "Post your innovative business ideas and get feedback from the community",
        },
        {
            icon: Users,
            title: "Connect & Collaborate",
            description:
                "Follow other entrepreneurs and build meaningful connections",
        },
        {
            icon: MessageSquare,
            title: "Engage & Discuss",
            description:
                "Comment, vote, and participate in meaningful discussions",
        },
    ]

    if (status !== "authenticated") {
        return null
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className='sm:max-w-md glassmorphism bg-gray-900/95 border-white/20'>
                <DialogHeader className='text-center space-y-4'>
                    <div className='flex justify-center'>
                        <Logo className='text-center' />
                    </div>

                    {step === 1 && (
                        <>
                            <DialogTitle className='text-2xl font-bold text-white flex items-center justify-center gap-2'>
                                <Sparkles className='w-6 h-6 text-yellow-400' />
                                Welcome to BlueBizHub!
                            </DialogTitle>
                            <DialogDescription className='text-white/80 text-center'>
                                Thank you for joining our community of
                                entrepreneurs and innovators. Let&apos;s get you
                                started on your journey!
                            </DialogDescription>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <DialogTitle className='text-xl font-bold text-white'>
                                Discover What You Can Do
                            </DialogTitle>
                            <div className='space-y-4'>
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className='flex items-start gap-3 text-left'
                                    >
                                        <div className='bg-blue-600/20 p-2 rounded-lg'>
                                            <feature.icon className='w-5 h-5 text-blue-400' />
                                        </div>
                                        <div>
                                            <h4 className='font-semibold text-white'>
                                                {feature.title}
                                            </h4>
                                            <p className='text-sm text-white/70'>
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <DialogTitle className='text-xl font-bold text-white'>
                                Ready to Get Started?
                            </DialogTitle>
                            <DialogDescription className='text-white/80'>
                                Your profile has been created successfully. You
                                can now:
                                <ul className='mt-3 space-y-2 text-left'>
                                    <li className='flex items-center gap-2'>
                                        <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
                                        Share your first business idea
                                    </li>
                                    <li className='flex items-center gap-2'>
                                        <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
                                        Complete your profile information
                                    </li>
                                    <li className='flex items-center gap-2'>
                                        <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
                                        Explore ideas from other entrepreneurs
                                    </li>
                                </ul>
                            </DialogDescription>
                        </>
                    )}
                </DialogHeader>

                <div className='flex justify-between items-center pt-4'>
                    <div className='flex space-x-1'>
                        {[1, 2, 3].map((num) => (
                            <div
                                key={num}
                                className={`w-2 h-2 rounded-full ${
                                    num <= step ? "bg-blue-400" : "bg-white/20"
                                }`}
                            />
                        ))}
                    </div>

                    <div className='flex gap-2'>
                        <Button
                            variant='ghost'
                            onClick={handleClose}
                            className='text-white/70 hover:text-white hover:bg-white/10'
                        >
                            Skip
                        </Button>
                        <Button
                            onClick={nextStep}
                            className='bg-blue-600 hover:bg-blue-700 text-white'
                        >
                            {step < 3 ? "Next" : "Get Started"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
