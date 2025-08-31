"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
    Star,
    User,
    Calendar,
    ArrowLeft,
    MessageSquare,
    ChevronLeft,
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface FeedbackDetails {
    _id: string
    user?: {
        _id: string
        name: string
        avatar?: string
        profileId: number
    }
    question1: { rating: number; comment?: string }
    question2: { rating: number; comment?: string }
    question3: { rating: number; comment?: string }
    question4: { rating: number; comment?: string }
    question5: { rating: number; comment?: string }
    question6: { rating: number; comment?: string }
    question7?: string
    question8?: string
    question9?: string
    question10?: string
    createdAt: string
    updatedAt: string
}

const questionTexts = [
    "BlueBizHub is easy to use and navigate.",
    "The idea sharing and feedback features are helpful to me.",
    "The market validation tools are reliable and trustworthy.",
    "Using BlueBizHub increases my chances of business success.",
    "I receive useful advice and information through BlueBizHub.",
    "The platform is stable and free from frequent bugs or issues.",
]

const openTextQuestions = [
    "What features would you like BlueBizHub to develop or improve?",
    "Are there any features you rarely use or find unnecessary?",
    "What additional support would you like BlueBizHub to offer? (e.g., marketing help, customer acquisition, business management)",
    "Have you encountered any issues while using BlueBizHub that you'd like us to fix?",
]

export default function FeedbackDetailsPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const params = useParams()
    const feedbackId = params.id as string

    const [feedback, setFeedback] = useState<FeedbackDetails | null>(null)
    const [loading, setLoading] = useState(true)

    // Redirect if not admin
    useEffect(() => {
        if (status === "loading") return
        if (!session?.user || session.user.role !== "admin") {
            router.push("/")
            return
        }
    }, [session, status, router])

    // Fetch feedback details
    useEffect(() => {
        const fetchFeedbackDetails = async () => {
            try {
                setLoading(true)
                const response = await axios.get(`/api/feedback/${feedbackId}`)
                setFeedback(response.data)
            } catch (error) {
                console.error("Error fetching feedback details:", error)
                toast.error("Failed to fetch feedback details")
            } finally {
                setLoading(false)
            }
        }

        if (session?.user?.role === "admin" && feedbackId) {
            fetchFeedbackDetails()
        }
    }, [session, feedbackId])

    const calculateAverageRating = (feedback: FeedbackDetails) => {
        const ratings = [
            feedback.question1.rating,
            feedback.question2.rating,
            feedback.question3.rating,
            feedback.question4.rating,
            feedback.question5.rating,
            feedback.question6.rating,
        ]
        const average =
            ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
        return average.toFixed(1)
    }

    const renderStars = (rating: number) => {
        return (
            <div className='flex items-center space-x-1'>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${
                            star <= rating
                                ? "text-yellow-400 fill-current"
                                : "text-white/20"
                        }`}
                    />
                ))}
                <span className='ml-2 text-white'>{rating}/5</span>
            </div>
        )
    }

    if (
        status === "loading" ||
        !session?.user ||
        session.user.role !== "admin"
    ) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                Loading...
            </div>
        )
    }

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                Loading feedback...
            </div>
        )
    }

    if (!feedback) {
        return (
            <div className='container mx-auto py-8 px-4'>
                <div className='text-center'>
                    <h1 className='text-2xl font-bold text-white mb-4'>
                        Feedback Not Found
                    </h1>
                    <Link href='/admin/feedback'>
                        <Button
                            variant='outline'
                            className='border-white/20 text-white hover:bg-white/10'
                        >
                            <ArrowLeft className='w-4 h-4 mr-2' />
                            Back to Feedback List
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className='relative container mx-auto py-8 px-4'>
            <Button
                variant='ghost'
                size='sm'
                className='absolute top-0 left-0 border-white/20 text-white hover:bg-transparent hover:text-white'
                onClick={() => router.back()}
            >
                <ChevronLeft className='w-4 h-4' />
                Back
            </Button>
            {/* Header */}
            <div className='mb-8 flex items-start justify-between'>
                <div>
                    <h1 className='text-2xl font-bold text-white'>
                        Feedback Details
                    </h1>
                    <p className='text-white/70'>
                        Detailed view of user feedback submission
                    </p>
                </div>

                <Badge
                    variant='secondary'
                    className='bg-yellow-500/20 text-yellow-300'
                >
                    <Star className='w-3 h-3 mr-1 fill-current' />
                    {calculateAverageRating(feedback)} Average
                </Badge>
            </div>

            <div className='grid gap-6 lg:grid-cols-3'>
                {/* User Info Sidebar */}
                <div className='lg:col-span-1'>
                    <Card className='glassmorphism bg-white/10 border-white/20'>
                        <CardHeader>
                            <CardTitle className='text-white'>
                                User Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div className='flex items-center space-x-4'>
                                <Avatar className='w-16 h-16'>
                                    <AvatarImage src={feedback.user?.avatar} />
                                    <AvatarFallback className='bg-blue-600 text-xl'>
                                        {feedback.user ? (
                                            feedback.user.name?.charAt(0)
                                        ) : (
                                            <User className='w-8 h-8' />
                                        )}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className='text-white font-semibold text-lg'>
                                        {feedback.user
                                            ? feedback.user.name
                                            : "Anonymous User"}
                                    </h3>
                                    {feedback.user && (
                                        <p className='text-white/70'>
                                            Profile ID:{" "}
                                            {feedback.user.profileId}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <Separator className='bg-white/10' />

                            <div className='space-y-2'>
                                <div className='flex items-center space-x-2 text-white/70'>
                                    <Calendar className='w-4 h-4' />
                                    <span className='text-sm'>
                                        Submitted:{" "}
                                        {new Date(
                                            feedback.createdAt
                                        ).toLocaleString()}
                                    </span>
                                </div>
                                {feedback.updatedAt !== feedback.createdAt && (
                                    <div className='flex items-center space-x-2 text-white/70'>
                                        <Calendar className='w-4 h-4' />
                                        <span className='text-sm'>
                                            Updated:{" "}
                                            {new Date(
                                                feedback.updatedAt
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className='lg:col-span-2 space-y-6'>
                    {/* Rating Questions */}
                    <Card className='glassmorphism bg-white/10 border-white/20'>
                        <CardHeader>
                            <CardTitle className='text-white'>
                                Rating Questions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            {[
                                feedback.question1,
                                feedback.question2,
                                feedback.question3,
                                feedback.question4,
                                feedback.question5,
                                feedback.question6,
                            ].map((question, index) => (
                                <div key={index} className='space-y-3'>
                                    <div className='flex items-start justify-between'>
                                        <div className='flex-1'>
                                            <p className='text-white font-medium mb-2'>
                                                {index + 1}.{" "}
                                                {questionTexts[index]}
                                            </p>
                                            {renderStars(question.rating)}
                                        </div>
                                    </div>

                                    {question.comment && (
                                        <div className='bg-white/5 rounded-lg p-3 border border-white/10'>
                                            <p className='text-white/80 text-sm italic'>
                                                &quot;{question.comment}&quot;
                                            </p>
                                        </div>
                                    )}

                                    {index < 5 && (
                                        <Separator className='bg-white/10' />
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Open Text Questions */}
                    <Card className='glassmorphism bg-white/10 border-white/20'>
                        <CardHeader>
                            <CardTitle className='text-white flex items-center'>
                                <MessageSquare className='w-5 h-5 mr-2' />
                                Additional Comments
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            {[
                                feedback.question7,
                                feedback.question8,
                                feedback.question9,
                                feedback.question10,
                            ].map((answer, index) => (
                                <div key={index}>
                                    <h4 className='text-white font-medium mb-2'>
                                        {index + 7}. {openTextQuestions[index]}
                                    </h4>
                                    <div className='bg-white/5 rounded-lg p-4 border border-white/10 min-h-[60px]'>
                                        <p className='text-white/80'>
                                            {answer || (
                                                <span className='text-white/50 italic'>
                                                    No response provided
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    {index < 3 && (
                                        <Separator className='bg-white/10 mt-4' />
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
