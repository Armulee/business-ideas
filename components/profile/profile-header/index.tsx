"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, MapPin, Calendar, Link2, UserPlus, Check } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import axios from "axios"
import DialogShowFollowMenu from "./dialog-menu"
import { useAlert } from "@/components/provider/alert"
import { useProfile } from ".."

export default function ProfileHeader() {
    const { profile, followers } = useProfile()
    const router = useRouter()
    const pathname = usePathname()
    const { data: session } = useSession()
    const alert = useAlert()

    // Handle follow this user
    const handleFollow = async () => {
        if (!session?.user) {
            alert.show({
                title: "Authentication Required",
                description: "Please log in to follow this account",
                cancel: "Cancel",
                action: "Log in",
                onAction: () => {
                    router.push(
                        `/auth/signin?callbackUrl=/profile/${profile.profileId}/${profile.name}`
                    )
                },
            })
        } else {
            await axios.patch("/api/profile/follow", {
                followerId: session?.user.id,
                followeeId: profile._id.toString(),
            })

            window.location.reload()
        }
    }

    return (
        <div className='glassmorphism p-6 mb-4 w-full'>
            <div className='flex mb-4'>
                <Avatar className='mb-4 mr-4 h-24 w-24 md:h-20 md:w-20'>
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback>{profile.name?.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className='flex flex-col justify-center items-start mb-4'>
                    <h4 className='text-2xl font-extrabold text-white mb-2'>
                        {profile.name}
                    </h4>

                    {session?.user.id === profile._id.toString() ? (
                        <Link href={`${pathname}/edit`}>
                            <Button
                                className='bg-white/10 border-white/50'
                                variant='outline'
                                size='sm'
                            >
                                <Edit className='h-4 w-4 mr-2' />
                                Edit Profile
                            </Button>
                        </Link>
                    ) : (
                        <Button
                            disabled={
                                session?.user.id === profile._id.toString()
                            }
                            variant='outline'
                            className='bg-white/10 border-white/50'
                            size='sm'
                            onClick={handleFollow}
                        >
                            {session?.user.id &&
                            followers.find(
                                (follower) =>
                                    follower._id?.toString() === session.user.id
                            ) ? (
                                <>
                                    <Check />
                                    Following
                                </>
                            ) : (
                                <>
                                    <UserPlus />
                                    Follow
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>

            {profile.bio && <p className='text-gray-200 mb-4'>{profile.bio}</p>}

            <div className='flex flex-wrap gap-y-2 text-gray-300 mb-4'>
                {profile.location && (
                    <div className='flex items-center mr-4'>
                        <MapPin className='h-4 w-4 mr-1' />
                        <span>{profile.location}</span>
                    </div>
                )}
                {profile.website && (
                    <div className='flex items-center mr-4'>
                        <Link2 className='h-4 w-4 mr-1' />
                        <a
                            href={profile.website}
                            className='text-blue-400 hover:underline'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            {profile.website.replace(/(^\w+:|^)\/\//, "")}
                        </a>
                    </div>
                )}
                {profile.createdAt && (
                    <div className='flex items-center'>
                        <Calendar className='h-4 w-4 mr-1' />
                        <span>
                            Joined{" "}
                            {new Date(profile.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                    year: "numeric",
                                    month: "long",
                                }
                            )}
                        </span>
                    </div>
                )}
            </div>

            <div className='flex space-x-6 text-gray-200 mb-4'>
                <div>
                    <span className='font-bold'>{profile.postCount}</span> Posts
                </div>
                <DialogShowFollowMenu />
            </div>

            {profile?.badges ? (
                <div className='flex flex-wrap gap-2'>
                    {profile?.badges.map((badge) => (
                        <Badge
                            key={badge}
                            variant='secondary'
                            className='bg-blue-600 text-white'
                        >
                            {badge}
                        </Badge>
                    ))}
                </div>
            ) : null}
        </div>
    )
}
