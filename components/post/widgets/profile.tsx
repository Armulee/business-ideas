"use client"

import type React from "react"

import { User, UserPlus, UserRoundPen } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { usePostData } from ".."
import WidgetBase from "./base"
import WidgetTab from "./tab"
import { useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import axios from "axios"
import Link from "next/link"
import { useAlert } from "@/components/provider/alert"

export default function ProfileWidget() {
    const router = useRouter()
    const pathname = usePathname()
    const { data: session } = useSession()
    const { profile } = usePostData()
    const [stats, setStats] = useState<
        { title: string; amount: number }[] | null
    >(null)
    useEffect(() => {
        if (profile) {
            setStats([
                { title: "Posts", amount: profile.postCount },
                { title: "Followers", amount: profile.followerCount },
                { title: "Following", amount: profile.followingCount },
            ])
        }
    }, [profile])

    // handle follow to the author of post
    const alert = useAlert()
    const handleFollow = async () => {
        if (!session?.user) {
            alert.show({
                title: "Authentication Required",
                description: "Please log in to follow this account",
                cancel: "Cancel",
                action: "Log in",
                onAction: () => {
                    router.push(`/auth/signin?callbackUrl=${pathname}`)
                },
            })
        } else {
            await axios.patch("/api/profile/follow", {
                followerId: session?.user.id,
                followeeId: profile?._id.toString(),
            })

            window.location.reload()
        }
    }

    return (
        <WidgetBase>
            <WidgetTab>Author Profile</WidgetTab>
            {profile && stats ? (
                <>
                    <div className='flex items-center space-x-4'>
                        <Avatar className='h-16 w-16 border-2 border-blue-500/30'>
                            <AvatarImage
                                src={profile.avatar}
                                alt={profile.name}
                            />
                            <AvatarFallback>
                                <User className='h-8 w-8 text-white' />
                            </AvatarFallback>
                        </Avatar>

                        <div>
                            <h4 className='text-xl font-semibold text-white'>
                                {profile.name}
                            </h4>

                            <div className='text-xs line-clamp-2'>
                                <p>{profile.bio}</p>
                            </div>
                        </div>
                    </div>

                    <div className='mt-4 flex justify-center'>
                        {profile._id.toString() === session?.user.id ? (
                            <Link
                                href={`/profile/${
                                    session.user.profile
                                }/${session.user.name?.toLowerCase()}`}
                                className='w-full'
                            >
                                <Button
                                    type='button'
                                    size='sm'
                                    variant='outline'
                                    className='w-full glassmorphism bg-transparent text-white border-blue-500/30 hover:bg-blue-500/40 hover:text-white'
                                >
                                    <UserRoundPen className='h-3.5 w-3.5' />
                                    View your profile
                                </Button>
                            </Link>
                        ) : (
                            <Button
                                type='button'
                                size='sm'
                                variant='outline'
                                className='w-full glassmorphism bg-transparent text-white border-blue-500/30 hover:bg-blue-500/40 hover:text-white'
                                onClick={handleFollow}
                            >
                                <UserPlus className='h-3.5 w-3.5' />
                                Follow
                            </Button>
                        )}
                    </div>

                    <div className='flex justify-around mt-4'>
                        {stats.map((stat, index) => (
                            <div
                                key={`widget-profile-stat-${index}`}
                                className='flex flex-col justify-center items-center'
                            >
                                <span className='text-sm'>{stat.title}</span>
                                <span className='text-xl font-bold'>
                                    {stat.amount}
                                </span>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    <div className='flex items-center space-x-4'>
                        <Skeleton className='w-16 h-16 rounded-full' />

                        <div className=''>
                            <Skeleton className='h-6 w-[150px]' />

                            <div className='flex flex-col gap-1 mt-2'>
                                <Skeleton className='h-3 w-[150px]' />
                                <Skeleton className='h-3 w-[150px]' />
                            </div>
                        </div>
                    </div>

                    <div className='mt-4 flex justify-center'>
                        <Skeleton className='h-8 w-full rounded-lg' />
                    </div>

                    <div className='flex justify-between mt-4'>
                        {[1, 2, 3].map((index) => (
                            <div
                                key={`skeleton-widget-profile-stat-${index}`}
                                className='flex flex-col justify-center items-center gap-2'
                            >
                                <Skeleton className='h-3 w-[60px]' />
                                <Skeleton className='h-5 w-[30px]' />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </WidgetBase>
    )
}
