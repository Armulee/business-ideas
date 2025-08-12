"use client"

import { useState } from "react"
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
import { Star } from "lucide-react"
import { toast } from "sonner"
import AutoHeightTextarea from "../ui/auto-height-textarea"

interface FeedbackDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const questions = {
    rating: [
        "BlueBizHub is easy to use and navigate.",
        "The idea sharing and feedback features are helpful to me.",
        "The market validation tools are reliable and trustworthy.",
        "Using BlueBizHub increases my chances of business success.",
        "I receive useful advice and information through BlueBizHub.",
        "The platform is stable and free from frequent bugs or issues.",
    ],
    openText: [
        "What features would you like BlueBizHub to develop or improve?",
        "Are there any features you rarely use or find unnecessary?",
        "What additional support would you like BlueBizHub to offer? (e.g., marketing help, customer acquisition, business management)",
        "Have you encountered any issues while using BlueBizHub that you'd like us to fix?",
    ],
}

interface RatingQuestion {
    rating: number
    comment: string
}

export function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
    const { data: session } = useSession()
    const [loading, setLoading] = useState(false)

    const [ratings, setRatings] = useState<RatingQuestion[]>(
        Array(6)
            .fill(null)
            .map(() => ({
                rating: 0,
                comment: "",
            }))
    )

    const [openTextAnswers, setOpenTextAnswers] = useState<string[]>(
        Array(4).fill("")
    )

    const handleRatingChange = (questionIndex: number, rating: number) => {
        const newRatings = [...ratings]
        newRatings[questionIndex].rating = rating
        setRatings(newRatings)
    }

    const handleCommentChange = (questionIndex: number, comment: string) => {
        const newRatings = [...ratings]
        newRatings[questionIndex].comment = comment
        setRatings(newRatings)
    }

    const handleOpenTextChange = (questionIndex: number, value: string) => {
        const newAnswers = [...openTextAnswers]
        newAnswers[questionIndex] = value
        setOpenTextAnswers(newAnswers)
    }

    // Check if all required ratings are filled
    const allRated = ratings.every((q) => q.rating > 0)

    const handleSubmit = async () => {
        if (!allRated) {
            toast.error("Please rate all questions")
            return
        }

        // Anonymous feedback is now allowed - no login check needed

        setLoading(true)

        try {
            const feedbackData = {
                userId: session?.user?.profile || null,
                question1: {
                    rating: ratings[0].rating,
                    comment: ratings[0].comment,
                },
                question2: {
                    rating: ratings[1].rating,
                    comment: ratings[1].comment,
                },
                question3: {
                    rating: ratings[2].rating,
                    comment: ratings[2].comment,
                },
                question4: {
                    rating: ratings[3].rating,
                    comment: ratings[3].comment,
                },
                question5: {
                    rating: ratings[4].rating,
                    comment: ratings[4].comment,
                },
                question6: {
                    rating: ratings[5].rating,
                    comment: ratings[5].comment,
                },
                question7: openTextAnswers[0],
                question8: openTextAnswers[1],
                question9: openTextAnswers[2],
                question10: openTextAnswers[3],
            }

            await axios.post("/api/feedback", feedbackData)

            toast.success("Thank you for your feedback!")
            onOpenChange(false)
            // Reset form
            setRatings(
                Array(6)
                    .fill(null)
                    .map(() => ({
                        rating: 0,
                        comment: "",
                    }))
            )
            setOpenTextAnswers(Array(4).fill(""))
        } catch (error) {
            console.error("Error submitting feedback:", error)
            toast.error("Failed to submit feedback. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='w-[calc(100%-3rem)] max-w-xl max-h-[70vh] glassmorphism bg-blue-600/20 overflow-y-auto'>
                <DialogHeader className='text-left'>
                    <DialogTitle className='text-xl md:text-2xl'>
                        🌟 We Value Your Feedback!
                    </DialogTitle>
                    <DialogDescription className='text-white/70 text-xs md:text-sm'>
                        Your insights help us make BlueBizHub better for
                        everyone. Please take a moment to share your thoughts
                        and ideas — it only takes a minute — 10 easy questions,
                        and it means a lot to us!
                    </DialogDescription>
                </DialogHeader>

                <div className='space-y-4 py-2'>
                    {/* Rating Questions */}
                    {questions.rating.map((question, index) => (
                        <div key={index} className='space-y-3'>
                            <div className='space-y-2'>
                                <p className='md:text-md text-sm font-medium flex-1 pr-4'>
                                    {index + 1}. {question}
                                </p>
                                <div className='flex items-center space-x-1'>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type='button'
                                            onClick={() =>
                                                handleRatingChange(index, star)
                                            }
                                            className='text-yellow-400 hover:text-yellow-500'
                                        >
                                            <Star
                                                className={`w-5 h-5 ${
                                                    star <=
                                                    ratings[index].rating
                                                        ? "fill-current"
                                                        : ""
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Show comment textarea automatically when rated */}
                            {ratings[index].rating > 0 && (
                                <AutoHeightTextarea
                                    className='text-sm'
                                    placeholder='Additional comments (optional)'
                                    value={ratings[index].comment}
                                    onChange={(e) =>
                                        handleCommentChange(
                                            index,
                                            e.target.value
                                        )
                                    }
                                />
                            )}
                        </div>
                    ))}

                    {/* Open Text Questions */}
                    {questions.openText.map((question, index) => (
                        <div key={index + 6} className='space-y-2'>
                            <label className='text-sm font-medium'>
                                {index + 7}. {question}
                            </label>
                            <AutoHeightTextarea
                                className='text-sm'
                                placeholder='Your answer (optional)'
                                value={openTextAnswers[index]}
                                onChange={(e) =>
                                    handleOpenTextChange(index, e.target.value)
                                }
                            />
                        </div>
                    ))}
                </div>

                <div className='flex justify-end space-x-2 pt-4'>
                    <Button
                        variant='ghost'
                        className='hover:text-white hover:bg-transparent'
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        className={`button ${!allRated || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleSubmit}
                        disabled={!allRated || loading}
                    >
                        {loading ? "Submitting..." : "Submit Feedback"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
