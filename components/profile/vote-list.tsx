"use client"

import { Clock, CornerLeftUp, FileText, MessageSquare } from "lucide-react"
import { formatDate } from "@/utils/format-date"
import Link from "next/link"
import { PiArrowFatDownFill, PiArrowFatUpFill } from "react-icons/pi"
import { useProfile } from "."
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

export default function VoteList({ type }: { type: "upvotes" | "downvotes" }) {
    const { activities } = useProfile()

    if (!activities[type].length) {
        return (
            <div className='text-center py-12 text-gray-300'>
                <p className='text-xl'>No {type} to display</p>
            </div>
        )
    }

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3'>
            {activities[type]?.map((interaction) => {
                // Determine styling based on interaction type
                let iconColor, bgColor, icon

                switch (interaction.targetType) {
                    case "Post":
                        iconColor = "text-purple-400"
                        bgColor = "bg-purple-500/20"
                        icon = <FileText className='h-4 w-4' />
                        break
                    case "Comment":
                        iconColor = "text-blue-300"
                        bgColor = "bg-blue-500/20"
                        icon = <MessageSquare className='h-4 w-4' />
                        break
                    case "Reply":
                        iconColor = "text-green-300"
                        bgColor = "bg-green-500/20"
                        icon = <CornerLeftUp className='h-4 w-4' />
                        break
                }

                const voteIcon =
                    type === "upvotes" ? (
                        <PiArrowFatUpFill className='h-3 w-3 mr-1' />
                    ) : (
                        <PiArrowFatDownFill className='h-3 w-3 mr-1' />
                    )

                const voteLabel = type === "upvotes" ? "Upvoted" : "Downvoted"
                const voteColor =
                    type === "upvotes" ? "text-blue-300" : "text-red-300"
                const voteBgColor =
                    type === "upvotes" ? "bg-blue-900/50" : "bg-red-900/50"

                return (
                    <Link
                        key={interaction._id.toString()}
                        href={interaction.postLink}
                        className='no-underline group'
                    >
                        <div className='h-full relative overflow-hidden glassmorphism p-3 shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:border-white/20'>
                            <div className='flex items-start gap-3'>
                                <div
                                    className={`flex items-center justify-center w-8 h-8 rounded-full ${bgColor} flex-shrink-0 ${iconColor}`}
                                >
                                    {icon}
                                </div>

                                {/* Content */}
                                <div className='flex-1 min-w-0'>
                                    <div className='flex items-center gap-2 mb-1'>
                                        <span
                                            className={`text-xs font-medium ${voteColor} flex items-center`}
                                        >
                                            {voteIcon} {voteLabel}{" "}
                                            {interaction.targetType.toLowerCase()}
                                        </span>
                                        <span className='text-xs text-white/60 flex items-center'>
                                            <Clock className='h-3 w-3 mr-1' />
                                            {formatDate(interaction.createdAt)}
                                        </span>
                                    </div>

                                    {/* Different content based on interaction type */}
                                    {interaction.targetType === "Post" && (
                                        <div className='flex flex-col gap-1 mt-2'>
                                            <span
                                                className={`text-xs font-medium ${voteColor} line-clamp-2`}
                                            >
                                                &quot;{interaction.title}&quot;
                                            </span>
                                            <div className='flex items-center gap-1'>
                                                <span className='text-xs text-white/80 font-bold'>
                                                    by{" "}
                                                </span>
                                                <Avatar className='w-5 h-5'>
                                                    <AvatarImage
                                                        src={
                                                            interaction.author
                                                                .avatar
                                                        }
                                                    />
                                                    <AvatarFallback className='text-xs'>
                                                        {
                                                            interaction.author
                                                                .name?.[0]
                                                        }
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className='text-right text-xs text-white/80 font-bold'>
                                                    {interaction.author.name}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {interaction.targetType === "Comment" && (
                                        <>
                                            <div
                                                className={`w-fit flex items-center gap-1 glassmorphism ${voteBgColor} px-3 py-1 line-clamp-2 mt-2`}
                                            >
                                                <div className='flex items-center gap-1'>
                                                    <Avatar className='w-5 h-5'>
                                                        <AvatarImage
                                                            src={
                                                                interaction
                                                                    .author
                                                                    .avatar
                                                            }
                                                        />
                                                        <AvatarFallback className='text-xs'>
                                                            {
                                                                interaction
                                                                    .author
                                                                    .name?.[0]
                                                            }
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className='text-xs text-white/80 font-bold'>
                                                        {
                                                            interaction.author
                                                                .name
                                                        }
                                                        :
                                                    </span>
                                                </div>
                                                <span className='text-xs'>
                                                    {interaction.content}
                                                </span>
                                            </div>
                                            <p className='text-xs mt-2 flex flex-1 gap-1'>
                                                <span className='text-white/80'>
                                                    on{" "}
                                                </span>
                                                <span
                                                    className={`${voteColor} group-hover:underline transition-all line-clamp-1`}
                                                >
                                                    &quot;
                                                    {interaction.post?.title}
                                                    &quot;
                                                </span>
                                            </p>
                                        </>
                                    )}

                                    {interaction.targetType === "Reply" && (
                                        <>
                                            <div
                                                className={`w-fit flex items-center gap-1 glassmorphism ${voteBgColor} px-3 py-1 line-clamp-2 mt-2`}
                                            >
                                                <div className='flex items-center gap-1'>
                                                    <Avatar className='w-5 h-5'>
                                                        <AvatarImage
                                                            src={
                                                                interaction
                                                                    .author
                                                                    .avatar
                                                            }
                                                        />
                                                        <AvatarFallback className='text-xs'>
                                                            {
                                                                interaction
                                                                    .author
                                                                    .name?.[0]
                                                            }
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className='text-xs text-white/80 font-bold'>
                                                        {
                                                            interaction.author
                                                                .name
                                                        }
                                                        :
                                                    </span>
                                                </div>
                                                <span className='text-xs'>
                                                    {interaction.content}
                                                </span>
                                            </div>
                                            <p className='text-xs mt-2 flex flex-1 gap-1'>
                                                <span className='text-white/80'>
                                                    on{" "}
                                                </span>
                                                <span
                                                    className={`${voteColor} group-hover:underline transition-all line-clamp-1`}
                                                >
                                                    &quot;
                                                    {interaction.post?.title}
                                                    &quot;
                                                </span>
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}
