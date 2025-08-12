// "use client"

// import { IPostPopulated } from "@/database/Post"
// import { DialogContent } from "../ui/dialog"
// import { useState } from "react"
// import SelectPlan from "./boost-post/select-plan"

// interface BoostPostProps {
//     post?: IPostPopulated | undefined
//     setOpenBoostDialog?: () => void
// }

// const BoostPost = ({ post, setOpenBoostDialog }: BoostPostProps) => {
//     const [step, setStep] = useState<number>(0)

//     const renderBoostingPost = () => {
//         switch (step) {
//             case 0:
//                 return <SelectPlan setStep={setStep} />
//         }
//     }
//     return (
//         <DialogContent className='w-[calc(100vw-3rem)] max-w-xl glassmorphism bg-black/90 border-white/20 text-white flex flex-col transition-none'>
//             {renderBoostingPost()}
//         </DialogContent>
//     )
// }

// export default BoostPost

"use client"

import type React from "react"
import { useState, useRef } from "react"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import {
    ArrowUpIcon,
    BarChart3Icon,
    SlidersIcon,
    StarIcon,
    ImageIcon,
    MessageSquareIcon,
    CheckSquareIcon,
    GalleryHorizontalEnd,
    MousePointerClickIcon,
    MoveIcon,
    SlidersHorizontalIcon,
    ExternalLinkIcon,
    UserPlusIcon,
    ListIcon,
    TrophyIcon,
    CreditCardIcon,
    CheckIcon,
    Flame,
    X,
} from "lucide-react"
import { IPostPopulated } from "@/database/Post"
import SelectWidget from "./select-widget"
import { PiArrowFatUp } from "react-icons/pi"

interface BoostPostDialogProps {
    openBoostDialog: boolean
    setOpenBoostDialog: React.Dispatch<React.SetStateAction<boolean>>
    post: IPostPopulated | undefined
}

export interface WidgetSelectionType {
    id: string
    name: string
    description: string
    icon: React.ReactNode
    preview: React.ReactNode
}

interface AdsPack {
    id: string
    name: string
    price: number
    currency: string
    engagements: string
    views: string
    popular?: boolean
    features: string[]
}

const widgetTypes: WidgetSelectionType[] = [
    {
        id: "default",
        name: "Default",
        description: "Simple upvote interaction",
        icon: <ArrowUpIcon className='h-5 w-5' />,
        preview: (
            <div>
                <p className='text-[10px] text-white mb-2'>
                    This idea sounds interesting? Press to upvote to this idea!
                </p>
                <div className='w-full flex justify-between items-center gap-2'>
                    <div className='w-fit p-2 glassmorphism rounded'>
                        <PiArrowFatUp className='h-4 w-4 text-white' />
                    </div>
                    <Button className='button'>Learn more</Button>
                </div>
            </div>
        ),
    },
    {
        id: "poll",
        name: "Poll",
        description: "Multiple choice voting",
        icon: <BarChart3Icon className='h-5 w-5' />,
        preview: (
            <div className='space-y-1'>
                <div className='grid grid-cols-2 gap-2 text-xs'>
                    <div className='glassmorphism px-4 py-2 bg-white text-blue-600'>
                        Option A
                    </div>
                    <div className='glassmorphism px-4 py-2'>Option B</div>
                    <div className='glassmorphism px-4 py-2'>Option C</div>
                    <div className='glassmorphism px-4 py-2'>Option D</div>
                </div>
            </div>
        ),
    },
    {
        id: "slider",
        name: "Slider",
        description: "Range value selection",
        icon: <SlidersIcon className='h-5 w-5' />,
        preview: (
            <div className='flex items-center gap-2'>
                <span className='text-xs'>0</span>
                <div className='flex-1 relative'>
                    <div className='absolute left-1/2 top-1/2 w-4 h-4 bg-blue-600 rounded-full -translate-y-1/2 -translate-x-1/2 z-10'></div>
                    <Progress
                        value={52}
                        className='bg-white h-2'
                        indicatorClassName='bg-blue-500'
                    />
                </div>
                <span className='text-xs'>100</span>
            </div>
        ),
    },
    {
        id: "rating",
        name: "Rating",
        description: "5-star rating system",
        icon: <StarIcon className='h-5 w-5' />,
        preview: (
            <div className='flex gap-1'>
                {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                        key={star}
                        className={`h-4 w-4 ${star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-white"}`}
                    />
                ))}
            </div>
        ),
    },
    {
        id: "visual-pick",
        name: "Visual Pick",
        description: "Image selection choice",
        icon: <ImageIcon className='h-5 w-5' />,
        preview: (
            <div className='grid grid-cols-2 gap-1'>
                <div className='w-8 h-6 bg-blue-500 rounded'></div>
                <div className='w-8 h-6 bg-gray-600 rounded'></div>
            </div>
        ),
    },
    {
        id: "comment",
        name: "Comment",
        description: "Text input for feedback",
        icon: <MessageSquareIcon className='h-5 w-5' />,
        preview: (
            <div className='bg-gray-800 rounded p-2 text-xs text-gray-400'>
                <span>Share your thoughts...</span>
            </div>
        ),
    },
    {
        id: "checklist",
        name: "Checklist",
        description: "Multiple selection options",
        icon: <CheckSquareIcon className='h-5 w-5' />,
        preview: (
            <div className='space-y-1'>
                <div className='flex items-center gap-2 text-xs'>
                    <div className='w-3 h-3 bg-blue-500 rounded-sm'></div>
                    <span>Option 1</span>
                </div>
                <div className='flex items-center gap-2 text-xs'>
                    <div className='w-3 h-3 border border-gray-600 rounded-sm'></div>
                    <span>Option 2</span>
                </div>
            </div>
        ),
    },
    {
        id: "swiper",
        name: "Swiper",
        description: "Swipe through content",
        icon: <GalleryHorizontalEnd className='h-5 w-5' />,
        preview: (
            <div className='flex items-center justify-between bg-gray-800 rounded p-2'>
                <span className='text-xs'>← Swipe →</span>
                <div className='flex gap-1'>
                    <div className='w-1 h-1 bg-blue-500 rounded-full'></div>
                    <div className='w-1 h-1 bg-gray-600 rounded-full'></div>
                </div>
            </div>
        ),
    },
    {
        id: "cta",
        name: "CTA",
        description: "Call-to-action button",
        icon: <MousePointerClickIcon className='h-5 w-5' />,
        preview: (
            <Button
                size='sm'
                className='bg-blue-600 hover:bg-blue-700 text-xs h-6'
            >
                Learn More
            </Button>
        ),
    },
    {
        id: "reorder",
        name: "Reorder",
        description: "Drag and drop ranking",
        icon: <MoveIcon className='h-5 w-5' />,
        preview: (
            <div className='space-y-1'>
                <div className='flex items-center gap-2 text-xs bg-gray-800 rounded p-1'>
                    <MoveIcon className='h-3 w-3' />
                    <span>Item 1</span>
                </div>
                <div className='flex items-center gap-2 text-xs bg-gray-800 rounded p-1'>
                    <MoveIcon className='h-3 w-3' />
                    <span>Item 2</span>
                </div>
            </div>
        ),
    },
    {
        id: "range",
        name: "Range",
        description: "Min-max value selection",
        icon: <SlidersHorizontalIcon className='h-5 w-5' />,
        preview: (
            <div className='flex items-center gap-2'>
                <span className='text-xs'>$10</span>
                <div className='flex-1 bg-gray-700 rounded-full h-2 relative'>
                    <div className='absolute left-1/4 top-0 w-2 h-2 bg-blue-500 rounded-full'></div>
                    <div className='absolute right-1/4 top-0 w-2 h-2 bg-blue-500 rounded-full'></div>
                </div>
                <span className='text-xs'>$50</span>
            </div>
        ),
    },
    {
        id: "social-link",
        name: "Social/Web Link",
        description: "External link sharing",
        icon: <ExternalLinkIcon className='h-5 w-5' />,
        preview: (
            <div className='flex items-center gap-2 bg-gray-800 rounded p-2'>
                <ExternalLinkIcon className='h-3 w-3' />
                <span className='text-xs'>Visit Website</span>
            </div>
        ),
    },
    {
        id: "follow-user",
        name: "Follow User",
        description: "User follow action",
        icon: <UserPlusIcon className='h-5 w-5' />,
        preview: (
            <Button
                size='sm'
                variant='outline'
                className='text-xs h-6 border-blue-500 text-blue-400 bg-transparent'
            >
                + Follow
            </Button>
        ),
    },
    {
        id: "summarize",
        name: "Summarize",
        description: "Bullet points with link to post",
        icon: <ListIcon className='h-5 w-5' />,
        preview: (
            <div className='space-y-1 text-xs'>
                <div className='flex items-start gap-2'>
                    <div className='w-1 h-1 bg-blue-500 rounded-full mt-1.5'></div>
                    <span>Key point 1</span>
                </div>
                <div className='flex items-start gap-2'>
                    <div className='w-1 h-1 bg-blue-500 rounded-full mt-1.5'></div>
                    <span>Key point 2</span>
                </div>
            </div>
        ),
    },
    {
        id: "milestone",
        name: "Milestone",
        description: "Achievement display with details",
        icon: <TrophyIcon className='h-5 w-5' />,
        preview: (
            <div className='flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-orange-600 rounded p-2'>
                <TrophyIcon className='h-4 w-4 text-yellow-200' />
                <span className='text-xs text-white'>Achievement</span>
            </div>
        ),
    },
]

const adsPacks: AdsPack[] = [
    {
        id: "basic",
        name: "Basic",
        price: 29,
        currency: "฿",
        engagements: "5-30",
        views: "1,000",
        features: ["Basic targeting", "Standard support", "7-day duration"],
    },
    {
        id: "standard",
        name: "Standard",
        price: 89,
        currency: "฿",
        engagements: "15-90",
        views: "3,000",
        popular: true,
        features: [
            "Advanced targeting",
            "Priority support",
            "14-day duration",
            "Analytics dashboard",
        ],
    },
    {
        id: "premium",
        name: "Premium",
        price: 149,
        currency: "฿",
        engagements: "25-150",
        views: "5,000",
        features: [
            "Premium targeting",
            "24/7 support",
            "30-day duration",
            "Advanced analytics",
            "A/B testing",
        ],
    },
    {
        id: "ultimate",
        name: "Ultimate",
        price: 299,
        currency: "฿",
        engagements: "50-300",
        views: "10,000",
        features: [
            "AI-powered targeting",
            "Dedicated support",
            "60-day duration",
            "Full analytics suite",
            "A/B testing",
            "Custom widgets",
        ],
    },
]

const BoostPost: React.FC<BoostPostDialogProps> = ({
    openBoostDialog,
    setOpenBoostDialog,
    post,
}) => {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState<number>(1)
    const [selectedWidget, setSelectedWidget] = useState<string>("")
    const [selectedPack, setSelectedPack] = useState<string>("")
    const [isProcessing, setIsProcessing] = useState(false)
    const dialogContentRef = useRef<HTMLDivElement>(null)

    // Scroll to top when step changes
    // useEffect(() => {
    //     if (dialogContentRef.current) {
    //         dialogContentRef.current.scrollTo({ top: 0 })
    //     }
    // }, [currentStep, setOpenBoostDialog])

    const handlePackSelect = (packId: string) => {
        setSelectedPack(packId)
    }

    const handleNextStep = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        } else if (currentStep === 1) {
            setOpenBoostDialog(false)
        }
    }

    const selectedWidgetData = widgetTypes.find((w) => w.id === selectedWidget)
    const selectedPackData = adsPacks.find((p) => p.id === selectedPack)

    const handlePayment = async (paymentMethod: string) => {
        setIsProcessing(true)

        try {
            // Simulate payment processing
            await new Promise((resolve) => setTimeout(resolve, 2000))

            // Check if content needs summarization (280 characters = ~2 sentences)
            if (post && post.content.length > 280) {
                console.log("Content is too long, calling AI summarizer...")

                try {
                    const { text: summary } = await generateText({
                        model: openai("gpt-4o"),
                        prompt: `Summarize the following content in 2 concise sentences or less (under 280 characters): ${post.content}`,
                    })

                    console.log("AI Summary:", summary)
                } catch (error) {
                    console.error("AI summarization failed:", error)
                }
            }

            // Store boost information
            const boostData = {
                postId: post?.id,
                widgetType: selectedWidget,
                adsPack: selectedPack,
                paymentMethod,
                createdAt: new Date().toISOString(),
            }

            console.log("Boost Post Data:", boostData)

            // Redirect to widget setup page
            router.push(
                `/boost/setup?postId=${post?.id}&widget=${selectedWidget}&pack=${selectedPack}`
            )
            // setOpenBoostDialog(false)
        } catch (error) {
            console.error("Payment failed:", error)
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <Dialog open={openBoostDialog} onOpenChange={setOpenBoostDialog}>
            <DialogTrigger asChild>
                <li className='w-full text-sm flex justify-start items-center gap-2 px-4 py-2 cursor-pointer hover:bg-white/20 rounded text-white transition duration-500'>
                    <Flame size={18} />
                    Boost Post
                </li>
            </DialogTrigger>
            <DialogContent
                ref={dialogContentRef}
                hideCloseButton
                className='w-[calc(100vw-3rem)] max-w-xl max-h-[80vh] overflow-y-auto bg-blue-950 border-0 rounded-lg gap-2 p-0'
            >
                <DialogHeader className='px-6 pt-6 pb-4 sticky top-0 bg-blue-950 z-10'>
                    <DialogTitle className='text-2xl font-bold text-white flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                            <Flame className='h-6 w-6' />
                            Boost Post
                        </div>
                        <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => setOpenBoostDialog(false)}
                            className='text-white hover:bg-white/10 p-2'
                        >
                            <X className='h-4 w-4' />
                        </Button>
                    </DialogTitle>
                </DialogHeader>

                {/* Step 1: Widget Selection */}
                {currentStep === 1 && (
                    <SelectWidget
                        postTitle={post?.title ?? ""}
                        selectedWidget={selectedWidget}
                        setSelectedWidget={setSelectedWidget}
                        widgetTypes={widgetTypes}
                    />
                )}

                {/* Step 2: Ads Pack Selection */}
                {currentStep === 2 && (
                    <div className='space-y-6'>
                        <div>
                            <h3 className='text-xl font-semibold text-white mb-2'>
                                Choose Your Boost Package
                            </h3>
                            <p className='text-gray-400 mb-6'>
                                Select the package that best fits your goals
                            </p>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {adsPacks.map((pack) => (
                                <Card
                                    key={pack.id}
                                    className={`cursor-pointer transition-all duration-300 hover:scale-105 relative ${
                                        selectedPack === pack.id
                                            ? "ring-2 ring-blue-500 bg-blue-500/10 border-blue-500"
                                            : "bg-gray-800/50 border-gray-700 hover:border-gray-600"
                                    }`}
                                    onClick={() => handlePackSelect(pack.id)}
                                >
                                    {pack.popular && (
                                        <div className='absolute -top-3 left-1/2 transform -translate-x-1/2'>
                                            <Badge className='bg-gradient-to-r from-blue-500 to-purple-500 text-white'>
                                                Most Popular
                                            </Badge>
                                        </div>
                                    )}
                                    <CardContent className='p-6'>
                                        <div className='text-center mb-4'>
                                            <h4 className='text-xl font-bold text-white'>
                                                {pack.name}
                                            </h4>
                                            <div className='flex items-baseline justify-center gap-1 mt-2'>
                                                <span className='text-3xl font-bold text-white'>
                                                    {pack.currency}
                                                    {pack.price}
                                                </span>
                                            </div>
                                        </div>

                                        <div className='space-y-3 mb-6'>
                                            <div className='flex items-center justify-between'>
                                                <span className='text-gray-400'>
                                                    Engagements
                                                </span>
                                                <span className='text-white font-medium'>
                                                    {pack.engagements}
                                                </span>
                                            </div>
                                            <div className='flex items-center justify-between'>
                                                <span className='text-gray-400'>
                                                    Views/day
                                                </span>
                                                <span className='text-white font-medium'>
                                                    {pack.views}
                                                </span>
                                            </div>
                                        </div>

                                        <Separator className='bg-gray-700 mb-4' />

                                        <div className='space-y-2'>
                                            {pack.features.map(
                                                (feature, index) => (
                                                    <div
                                                        key={index}
                                                        className='flex items-center gap-2'
                                                    >
                                                        <CheckIcon className='h-4 w-4 text-green-400' />
                                                        <span className='text-sm text-gray-300'>
                                                            {feature}
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Payment */}
                {currentStep === 3 && (
                    <div className='space-y-6'>
                        <div>
                            <h3 className='text-xl font-semibold text-white mb-2'>
                                Complete Your Order
                            </h3>
                            <p className='text-gray-400 mb-6'>
                                Choose your payment method to boost your post
                            </p>
                        </div>

                        {/* Order Summary */}
                        <Card className='bg-gray-800/50 border-gray-700'>
                            <CardContent className='p-6'>
                                <h4 className='font-semibold text-white mb-4'>
                                    Order Summary
                                </h4>
                                <div className='space-y-3'>
                                    <div className='flex justify-between'>
                                        <span className='text-gray-400'>
                                            Widget Type
                                        </span>
                                        <span className='text-white'>
                                            {selectedWidgetData?.name}
                                        </span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-gray-400'>
                                            Package
                                        </span>
                                        <span className='text-white'>
                                            {selectedPackData?.name}
                                        </span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-gray-400'>
                                            Expected Engagements
                                        </span>
                                        <span className='text-white'>
                                            {selectedPackData?.engagements}
                                        </span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-gray-400'>
                                            Views per Day
                                        </span>
                                        <span className='text-white'>
                                            {selectedPackData?.views}
                                        </span>
                                    </div>
                                    <Separator className='bg-gray-700' />
                                    <div className='flex justify-between text-lg font-semibold'>
                                        <span className='text-white'>
                                            Total
                                        </span>
                                        <span className='text-white'>
                                            {selectedPackData?.currency}
                                            {selectedPackData?.price}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Methods */}
                        <div className='space-y-4'>
                            <h4 className='font-semibold text-white'>
                                Payment Method
                            </h4>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                <Button
                                    variant='outline'
                                    className='h-16 border-gray-600 hover:border-blue-500 hover:bg-blue-500/10 bg-transparent'
                                    onClick={() => handlePayment("stripe")}
                                    disabled={isProcessing}
                                >
                                    <div className='flex flex-col items-center gap-2'>
                                        <CreditCardIcon className='h-6 w-6' />
                                        <span>Stripe</span>
                                    </div>
                                </Button>
                                <Button
                                    variant='outline'
                                    className='h-16 border-gray-600 hover:border-blue-500 hover:bg-blue-500/10 bg-transparent'
                                    onClick={() => handlePayment("paypal")}
                                    disabled={isProcessing}
                                >
                                    <div className='flex flex-col items-center gap-2'>
                                        <div className='w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold'>
                                            P
                                        </div>
                                        <span>PayPal</span>
                                    </div>
                                </Button>
                                <Button
                                    variant='outline'
                                    className='h-16 border-gray-600 hover:border-blue-500 hover:bg-blue-500/10 bg-transparent'
                                    onClick={() => handlePayment("credit-card")}
                                    disabled={isProcessing}
                                >
                                    <div className='flex flex-col items-center gap-2'>
                                        <CreditCardIcon className='h-6 w-6' />
                                        <span>Credit Card</span>
                                    </div>
                                </Button>
                            </div>
                        </div>

                        <div className='text-sm text-gray-400'>
                            {isProcessing
                                ? "Processing payment..."
                                : "Select a payment method above"}
                        </div>
                    </div>
                )}

                <DialogFooter className='flex flex-col sticky bottom-0 bg-blue-950 p-4'>
                    {/* Progress Bar */}
                    <div className='w-full'>
                        <Progress
                            value={(currentStep / 3) * 100}
                            indicatorClassName='bg-blue-600'
                            className='h-2 mb-3'
                        />
                        <div className='flex items-center justify-between mb-2'>
                            <span className='text-sm text-gray-400'>
                                Step {currentStep} of 3
                            </span>
                            <span className='text-sm text-gray-400'>
                                {Math.round((currentStep / 3) * 100)}% Complete
                            </span>
                        </div>
                    </div>

                    <div className='flex justify-end gap-4'>
                        <Button
                            variant='outline'
                            onClick={handlePrevStep}
                            className='border-gray-600 text-gray-300 bg-transparent'
                        >
                            {currentStep === 1 ? "Cancel" : "Back"}
                        </Button>

                        <Button
                            onClick={handleNextStep}
                            disabled={!selectedWidget}
                            className='bg-blue-900 hover:bg-blue-700'
                        >
                            {currentStep === 1
                                ? "Continue to Pricing"
                                : currentStep === 2
                                  ? "Continue to Payment"
                                  : currentStep === 3
                                    ? "Confirm"
                                    : null}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default BoostPost
