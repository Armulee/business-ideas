import { PollData } from "@/database/Widget"
import WidgetBase from "./base"
import { Button } from "@/components/ui/button"
import { PropagateLoader } from "react-spinners"
import { ChartPie, Check } from "lucide-react"
import { useSession } from "next-auth/react"
import { usePostData } from ".."
import axios from "axios"
import React from "react"

export default function QuickPollWidget({
    data,
}: {
    data: PollData | undefined
}) {
    const { post } = usePostData()
    const { data: session } = useSession()
    const handleVote = async (optionId: string) => {
        const { status } = await axios.patch("/api/widget/poll", {
            post: post?._id,
            user: session?.user.id,
            optionId: optionId,
        })

        if (status === 200) {
            window.location.reload()
        }
    }

    const totalVotes = data?.options.reduce(
        (acc, opt) => acc + opt.vote.length,
        0
    )

    // const thisUserHasVoted = data?.options.some((opt) =>
    //     opt.vote.includes(session?.user.id ?? "")
    // )

    const userHasVoted = (voters: string[]) =>
        voters.includes(session?.user.id ?? "")

    return (
        <WidgetBase>
            <div className='flex items-center gap-2 mb-3 bg-white/20 absolute top-0 left-0 w-full px-4 py-2'>
                <ChartPie className='w-4 h-4' />
                <span className='text-sm font-bold'>Quick Poll</span>
            </div>
            {data ? (
                <>
                    <h6 className='font-bold mb-2'>{data.question}</h6>
                    {data.options.map((option) => (
                        <Button
                            key={option.id}
                            className={`w-full h-full glassmorphism flex flex-col justify-center items-center mb-3 py-2 bg-transparent hover:bg-white/10 disabled:opacity-100 overflow-x-hidden relative`}
                            onClick={() => handleVote(option.id)}
                        >
                            <span className='text-xs'>{option.value}</span>
                            <span className='text-lg flex items-center gap-1'>
                                {userHasVoted(option.vote) ? (
                                    <Check className='text-green-500' />
                                ) : null}
                                {Math.round(
                                    (option.vote.length /
                                        (totalVotes ? totalVotes : 1)) *
                                        100
                                )}
                                %
                            </span>
                            <div
                                style={{
                                    width: `${Math.round(
                                        (option.vote.length /
                                            (totalVotes ? totalVotes : 1)) *
                                            100
                                    )}%`,
                                }}
                                className={`absolute top-0 left-0 -z-10 h-full ${
                                    userHasVoted(option.vote)
                                        ? "bg-blue-500/40"
                                        : "bg-white/20"
                                } rounded-l-lg`}
                            />
                        </Button>
                    ))}
                    <div className='w-full flex justify-end items-center text-xs'>
                        Voters: {totalVotes}
                    </div>
                </>
            ) : (
                <div className='flex justify-center items-center pr-4 pb-5'>
                    <PropagateLoader
                        className='p-4'
                        color='#ffffff'
                        size={20}
                    />
                </div>
            )}
        </WidgetBase>
    )
}
