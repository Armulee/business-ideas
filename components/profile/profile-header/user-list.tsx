import { TabsContent } from "@/components/ui/tabs"
import { useProfile } from "../provider"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useAlert } from "@/components/provider/alert"
import mongoose from "mongoose"
import { usePathname, useRouter } from "next/navigation"
import axios from "axios"
import { Check, Search, User, X } from "lucide-react"

const UsersListContent = ({
    tabValue,
}: {
    tabValue: "followers" | "followings"
}) => {
    const pathname = usePathname()
    const router = useRouter()
    const followList = useProfile()
    const { data: session } = useSession()

    const [hovering, setHovering] = useState<string | null>(null)

    // handle follow certain account
    const alert = useAlert()
    const handleFollow = async (_id: mongoose.Schema.Types.ObjectId) => {
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
                userId: session?.user.id,
                targetId: _id.toString(),
            })

            window.location.reload()
        }
    }

    return (
        <TabsContent value={tabValue}>
            <ul className='flex flex-col items-start'>
                {!followList[tabValue].length ? (
                    <div className='mx-auto mt-4'>
                        <div className=' flex justify-center relative mb-2'>
                            <User className='text-blue-600/40 w-8 h-8 absolute top-1/2 left-[49%] -translate-x-1/2 -translate-y-1/2' />
                            <Search className='w-20 h-20 text-blue-700' />
                        </div>
                        {tabValue === "followers" ? (
                            <p className='text-center mb-4'>
                                <span className='font-bold text-xl'>
                                    No follower
                                </span>
                                {session?.user.id ===
                                followList.profile._id.toString() ? (
                                    <>
                                        <br />
                                        <br />
                                        <span className='font-medium text-sm'>
                                            Try to share some idea with us or
                                            upvote <br />
                                            some post might be a good idea.
                                        </span>
                                    </>
                                ) : null}
                            </p>
                        ) : (
                            <p className='text-center'>
                                <span className='font-bold text-xl'>
                                    No following
                                </span>
                                {session?.user.id ===
                                followList.profile._id.toString() ? (
                                    <>
                                        <br />
                                        <br />
                                        <span className='font-medium'>
                                            You did not following anyone yet.
                                        </span>
                                        <br />
                                        <span className='font-medium text-xs text-black/70'>
                                            Try explore and follow someone.
                                        </span>
                                    </>
                                ) : null}
                            </p>
                        )}
                    </div>
                ) : (
                    <>
                        {followList[tabValue].map((profile, index) => {
                            const isFollowing =
                                session?.user.id &&
                                followList[tabValue].find(
                                    (following) =>
                                        following._id.toString() ===
                                        session.user.id
                                )

                            return (
                                <li
                                    key={`user-${index}`}
                                    className='w-full h-full flex justify-between items-center gap-1'
                                >
                                    <Link
                                        href={`/profile/${
                                            profile.profileId
                                        }/${encodeURIComponent(
                                            profile.name?.toLowerCase() ?? ""
                                        )}`}
                                        className='w-full flex items-center gap-2 p-2 hover:bg-zinc-300/10 rounded-lg'
                                    >
                                        <Avatar>
                                            <AvatarImage src={profile.avatar} />
                                            <AvatarFallback>
                                                {profile.name
                                                    ?.charAt(0)
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className='w-full text-black'>
                                            {profile.name}
                                        </span>
                                    </Link>
                                    {profile._id.toString() ===
                                    session?.user.id ? null : (
                                        <Button
                                            onMouseEnter={() =>
                                                setHovering(
                                                    profile._id.toString()
                                                )
                                            }
                                            onMouseLeave={() =>
                                                setHovering(null)
                                            }
                                            onClick={() =>
                                                handleFollow(profile._id)
                                            }
                                            className={`glassmorphism ${
                                                isFollowing
                                                    ? "bg-transparent border text-black hover:bg-red-600 hover:text-white"
                                                    : "bg-blue-700/80 hover:bg-blue-500"
                                            } transition duration-500`}
                                        >
                                            {tabValue === "followings" &&
                                            isFollowing ? (
                                                <>
                                                    {hovering ===
                                                    profile._id.toString() ? (
                                                        <>
                                                            <X />
                                                            Unfollow
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Check />
                                                            Following
                                                        </>
                                                    )}
                                                </>
                                            ) : tabValue === "followers" &&
                                              isFollowing ? (
                                                "Follow Back"
                                            ) : (
                                                "Follow"
                                            )}
                                        </Button>
                                    )}
                                </li>
                            )
                        })}
                    </>
                )}
            </ul>
        </TabsContent>
    )
}

export default UsersListContent
