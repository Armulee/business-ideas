"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, User, Calendar, MessageSquare, Trash2 } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import AdminLoading from "@/components/admin/loading"

interface FeedbackItem {
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
}

interface FeedbackResponse {
    feedbacks: FeedbackItem[]
    pagination: {
        page: number
        limit: number
        total: number
        pages: number
    }
}

export default function AdminFeedbackPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
    })

    // Redirect if not admin
    useEffect(() => {
        if (status === "loading") return
        if (!session?.user || session.user.role !== "admin") {
            router.push("/")
            return
        }
    }, [session, status, router])

    // Fetch feedbacks
    useEffect(() => {
        if (session?.user?.role === "admin") {
            fetchFeedbacks(currentPage)
        }
    }, [session, currentPage])

    const fetchFeedbacks = async (page: number) => {
        try {
            setLoading(true)
            const response = await axios.get(
                `/api/feedback?page=${page}&limit=10`
            )
            const data: FeedbackResponse = response.data
            setFeedbacks(data.feedbacks)
            setPagination(data.pagination)
        } catch (error) {
            console.error("Error fetching feedbacks:", error)
            toast.error("Failed to fetch feedbacks")
        } finally {
            setLoading(false)
        }
    }

    const calculateAverageRating = (feedback: FeedbackItem) => {
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

    const handleDelete = async (
        feedbackId: string,
        event: React.MouseEvent
    ) => {
        event.preventDefault() // Prevent navigation from Link
        event.stopPropagation()

        if (!confirm("Are you sure you want to delete this feedback?")) {
            return
        }

        try {
            await axios.delete(`/api/feedback/${feedbackId}`)
            toast.success("Feedback deleted successfully")
            // Remove the feedback from local state
            setFeedbacks(feedbacks.filter((f) => f._id !== feedbackId))
        } catch (error) {
            console.error("Error deleting feedback:", error)
            toast.error("Failed to delete feedback")
        }
    }

    if (
        status === "loading" ||
        !session?.user ||
        session.user.role !== "admin"
    ) {
        return <AdminLoading size='lg' />
    }

    if (loading) {
        return <AdminLoading size='lg' />
    }

    return (
        <div className='container mx-auto py-8 px-4'>
            <div className='mb-8'>
                <h1 className='text-3xl font-bold text-white mb-2'>
                    Feedback Management
                </h1>
                <p className='text-white/70'>
                    View and manage user feedback submissions
                </p>
            </div>

            <div className='grid gap-6'>
                {feedbacks.length === 0 ? (
                    <>
                        <MessageSquare className='w-12 h-12 text-white/50 mx-auto mb-4' />
                        <p className='text-white/70'>
                            No feedback submissions found
                        </p>
                    </>
                ) : (
                    feedbacks.map((feedback) => (
                        <div
                            key={feedback._id}
                            className='glassmorphism bg-transparent hover:bg-blue-600/20 p-4 border-white/20 relative'
                        >
                            <Link
                                href={`/admin/feedback/${feedback._id}`}
                                className='block'
                            >
                                <div className='flex items-center space-x-4'>
                                    <Avatar>
                                        <AvatarImage
                                            src={feedback.user?.avatar}
                                        />
                                        <AvatarFallback className='bg-blue-600'>
                                            {feedback.user ? (
                                                feedback.user.name?.charAt(0)
                                            ) : (
                                                <User className='w-4 h-4' />
                                            )}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className='flex-1'>
                                        <div className='flex items-center gap-2'>
                                            <span className='text-white text-lg'>
                                                {feedback.user
                                                    ? feedback.user.name
                                                    : "Anonymous User"}
                                            </span>
                                            <Badge
                                                variant='secondary'
                                                className='bg-yellow-500/20 text-yellow-300'
                                            >
                                                <Star className='w-3 h-3 mr-1 fill-current' />
                                                {calculateAverageRating(
                                                    feedback
                                                )}
                                            </Badge>
                                        </div>
                                        <div className='flex items-center space-x-4 text-sm text-white/70'>
                                            <div className='flex items-center space-x-1'>
                                                <Calendar className='w-4 h-4' />
                                                <span>
                                                    {new Date(
                                                        feedback.createdAt
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <Button
                                variant='ghost'
                                size='sm'
                                className='absolute top-4 right-4 text-red-400 hover:text-red-300 hover:bg-red-500/10'
                                onClick={(e) => handleDelete(feedback._id, e)}
                            >
                                <Trash2 className='w-4 h-4' />
                            </Button>
                        </div>
                    ))
                )}

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className='flex items-center justify-center space-x-2 mt-6'>
                        <Button
                            variant='outline'
                            size='sm'
                            className='border-white/20 text-white hover:bg-white/10'
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            Previous
                        </Button>

                        <div className='flex items-center space-x-1'>
                            {Array.from(
                                { length: pagination.pages },
                                (_, i) => i + 1
                            ).map((page) => (
                                <Button
                                    key={page}
                                    variant={
                                        page === currentPage
                                            ? "default"
                                            : "outline"
                                    }
                                    size='sm'
                                    className={
                                        page === currentPage
                                            ? "bg-blue-600 hover:bg-blue-700"
                                            : "border-white/20 text-white hover:bg-white/10"
                                    }
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>

                        <Button
                            variant='outline'
                            size='sm'
                            className='border-white/20 text-white hover:bg-white/10'
                            disabled={currentPage === pagination.pages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
