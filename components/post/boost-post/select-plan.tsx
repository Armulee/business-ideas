import { Button } from "@/components/ui/button"
import {
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Crown, Flame, Star, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

const boostPlans = [
    {
        id: "basic",
        icon: Flame,
        price: "฿29.00",
        duration: "1 day",
        impressions: "1.0k",
        engagements: "5 - 30",
        color: "text-orange-500",
        popular: false,
    },
    {
        id: "standard",
        icon: Star,
        price: "฿89.00",
        duration: "1 day",
        impressions: "3.0k",
        engagements: "15 - 90",
        color: "text-purple-500",
        popular: true,
    },
    {
        id: "premium",
        icon: Zap,
        price: "฿149.00",
        duration: "1 day",
        impressions: "5.0k",
        engagements: "25 - 150",
        color: "text-blue-500",
        popular: false,
    },
    {
        id: "ultimate",
        icon: Crown,
        price: "฿299.00",
        duration: "1 day",
        impressions: "10.0k",
        engagements: "50 - 300",
        color: "text-yellow-500",
        popular: false,
    },
]

export default function SelectPlan() {
    const [selectedPlan, setSelectedPlan] = useState<string | null>("standard")
    const [isProcessing, setIsProcessing] = useState(false)

    const handleBoostPost = async () => {
        if (!selectedPlan) return

        setIsProcessing(true)
        try {
            // TODO: Implement boost post API call
            console.log(`Boosting post with plan ${selectedPlan}`)

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000))
        } catch (error) {
            console.error("Failed to boost post:", error)
        } finally {
            setIsProcessing(false)
        }
    }
    return (
        <>
            <DialogHeader className='flex-shrink-0'>
                <DialogTitle className='text-2xl font-bold text-white flex items-center gap-2'>
                    <Flame className='h-6 w-6 text-blue-500' />
                    Boost Your Post
                </DialogTitle>
                <DialogDescription className='text-white/70 text-left'>
                    Increase your post&apos;s visibility and reach more people
                    with our boost options.
                </DialogDescription>
            </DialogHeader>

            <div className='flex-1 overflow-y-auto py-4 pr-2'>
                <div className='flex flex-col gap-4'>
                    {boostPlans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative flex items-center gap-3 border rounded-lg p-4 cursor-pointer transition-all duration-300 ${
                                selectedPlan === plan.id
                                    ? "border-white/60 bg-white/10"
                                    : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
                            }`}
                            onClick={() => setSelectedPlan(plan.id)}
                        >
                            {plan.popular && (
                                <Badge className='absolute -top-2 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white'>
                                    Most Popular
                                </Badge>
                            )}

                            <plan.icon className={`w-8 h-8 ${plan.color}`} />

                            <div className='w-full flex justify-between items-center'>
                                <div>
                                    <h3 className='font-semibold text-white'>
                                        {plan.engagements} votes
                                    </h3>
                                    <p className='text-sm text-gray-400'>
                                        Display <b>~{plan.impressions} views</b>{" "}
                                        in {plan.duration}
                                    </p>
                                </div>
                                <span className='font-bold'>{plan.price}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <DialogFooter className='flex-shrink-0'>
                <div className='w-full flex justify-between items-center'>
                    <div>
                        Total:
                        <span className='ml-2 font-bold'>
                            {
                                boostPlans.find((p) => p.id === selectedPlan)
                                    ?.price
                            }
                        </span>
                    </div>
                    <Button
                        onClick={handleBoostPost}
                        disabled={!selectedPlan || isProcessing}
                        className='bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                    >
                        {isProcessing ? (
                            <>
                                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Flame className='h-4 w-4 mr-2' />
                                Boost Post
                            </>
                        )}
                    </Button>
                </div>
            </DialogFooter>
        </>
    )
}
