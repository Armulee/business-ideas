"use client"

import { useCallback, useEffect, useState } from "react"
import useSWR from "swr"
import { useSession } from "next-auth/react"
import axios from "axios"
import {
    ArrowBigDown,
    ArrowBigUp,
    Bell,
    Bookmark,
    ChevronLeft,
    MessageCircle,
    Repeat2,
    Reply,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetTrigger,
} from "../ui/sheet"
import { formatDate } from "@/utils/format-date"
import { usePathname } from "next/navigation"
import { LoadingLink } from "../loading-link"

// Types
interface Actor {
    profileId: string
    name: string
    avatar: string
}

interface TargetAsPost {
    title: string
    createdAt: string
    postLink: string
}

interface TargetAsComment extends TargetAsPost {
    content?: string
    author: Actor
}

interface TargetAsReply extends TargetAsComment {
    commentContent: string
}

export interface NotificationItem {
    _id: string
    type: string
    targetType: string
    actor: Actor
    target: TargetAsPost | TargetAsComment | TargetAsReply
    postLink: string
    isRead: boolean
    createdAt: string
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data)

const getNotificationIcon = (type: string) => {
    switch (type) {
        case "upvote":
            return <ArrowBigUp className='w-4 h-4 text-blue-500' />
        case "downvote":
            return <ArrowBigDown className='w-4 h-4 text-red-500' />
        case "comment":
            return <MessageCircle className='w-4 h-4 text-indigo-500' />
        case "reply":
            return <Reply className='w-4 h-4 text-fuchsia-500' />
        case "repost":
            return <Repeat2 className='w-4 h-4 text-green-500' />
        case "bookmark":
            return <Bookmark className='w-4 h-4 text-yellow-500' />
        default:
            return <Bell className='w-4 h-4 text-gray-500' />
    }
}

const getNotificationColor = (type: string, isRead: boolean) => {
    switch (type) {
        case "upvote":
            return isRead
                ? "bg-opacity-0 border-0"
                : "bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20"
        case "downvote":
            return isRead
                ? "bg-opacity-0 border-0"
                : "bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/20"
        case "comment":
            return isRead
                ? "bg-opacity-0 border-0"
                : "bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border-indigo-500/20"
        case "reply":
            return isRead
                ? "bg-opacity-0 border-0"
                : "bg-gradient-to-r from-fuchsia-500/10 to-pink-500/10 border-fuchsia-500/20"
        case "repost":
            return isRead
                ? "bg-opacity-0 border-0"
                : "bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20"
        case "bookmark":
            return isRead
                ? "bg-opacity-0 border-0"
                : "bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-500/20"
        default:
            return isRead
                ? "bg-opacity-0"
                : "bg-gradient-to-r from-gray-500/10 to-slate-500/10 border-gray-500/20"
    }
}

export default function NotificationSheet() {
    const pathname = usePathname()
    const { data: session, status } = useSession()
    const shouldFetch = status === "authenticated"
    const { data: notifications, mutate } = useSWR<NotificationItem[]>(
        shouldFetch
            ? `/api/activities/notifications/${session!.user.id}`
            : null,
        fetcher,
        { revalidateOnFocus: false, revalidateIfStale: false }
    )
    const [unreadCount, setUnreadCount] = useState<number>(0)
    useEffect(() => {
        if (notifications) {
            setUnreadCount(notifications.filter((n) => !n.isRead).length)
        }
    }, [notifications])

    // Open sheet
    const [sheetOpen, setSheetOpen] = useState(false)

    // Close notification sheet when navigating to the notification target
    useEffect(() => {
        setSheetOpen(false)
    }, [pathname])

    // Mark as read
    const markAsRead = useCallback(async () => {
        if (!notifications || !session?.user?.id) return
        const ids = notifications.map((n) => n._id)
        await axios.patch("/api/activities/notifications/mark-as-read", {
            recipientId: session.user.id,
            ids,
        })
        mutate(
            notifications.map((n) => ({ ...n, isRead: true })),
            false
        )
    }, [notifications, session, mutate])

    // wrap your open-change handler
    const handleSheetOpen = (open: boolean) => {
        setSheetOpen(open)
        // when the user closes the sheet, fire markAsRead
        if (!open && unreadCount > 0) {
            markAsRead()
        }
    }
    return (
        <Sheet open={sheetOpen} onOpenChange={handleSheetOpen}>
            <SheetTrigger asChild>
                <Button
                    variant='ghost'
                    size='icon'
                    className='relative hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200'
                >
                    <Bell className='w-5 h-5' />
                    <AnimatePresence>
                        {unreadCount > 0 && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className='absolute -top-1 -right-1'
                            >
                                <Badge className='bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 text-xs px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center'>
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </Badge>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Button>
            </SheetTrigger>
            <SheetContent className='p-0 w-full sm:w-[420px] glassmorphism !rounded-none bg-blue-600/20 dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800'>
                <SheetHeader className='px-6 py-6'>
                    <div className='flex items-center'>
                        <div>
                            <SheetTitle className='text-xl font-semibold text-white flex items-center gap-2'>
                                <ChevronLeft
                                    className='cursor-pointer translate-x-0 hover:-translate-x-1 transition duration-500'
                                    onClick={() => handleSheetOpen(false)}
                                />
                                Notifications
                            </SheetTitle>
                            <SheetDescription
                                asChild
                                className='text-sm text-white/70 mt-1'
                            >
                                {unreadCount > 0 ? (
                                    <div className='flex items-center gap-2 pl-4'>
                                        <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse' />
                                        <span>
                                            {`${unreadCount} new notification${
                                                unreadCount > 1 ? "s" : ""
                                            }`}
                                        </span>
                                    </div>
                                ) : (
                                    "You're all caught up!"
                                )}
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <div className='overflow-y-auto max-h-[calc(100vh-100px)] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600'>
                    <AnimatePresence mode='popLayout'>
                        {notifications && notifications.length > 0 ? (
                            <div className='p-2'>
                                {notifications.map((n, index) => {
                                    const key = n._id
                                    return (
                                        <motion.div
                                            key={key}
                                            initial={{
                                                opacity: 0,
                                                y: 20,
                                                scale: 0.95,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                scale: 1,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                y: -20,
                                                scale: 0.95,
                                            }}
                                            transition={{
                                                duration: 0.3,
                                                delay: index * 0.05,
                                                ease: "easeOut",
                                            }}
                                            className={`relative p-4 mb-2 rounded-xl border transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${getNotificationColor(
                                                n.type,
                                                n.isRead
                                            )}`}
                                        >
                                            {/* Blue pulse for unread */}
                                            {!n.isRead && (
                                                <div className='absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full animate-pulse' />
                                            )}

                                            <div className='flex space-x-3 items-start'>
                                                <div className='relative'>
                                                    <Avatar className='w-10 h-10 ring-2 ring-white dark:ring-gray-800 shadow-sm'>
                                                        <AvatarImage
                                                            src={n.actor.avatar}
                                                        />
                                                        <AvatarFallback className='bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium'>
                                                            {n.actor.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className='absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 rounded-full p-1 shadow-sm'>
                                                        {getNotificationIcon(
                                                            n.type
                                                        )}
                                                    </div>
                                                </div>

                                                <LoadingLink
                                                    href={n.target.postLink}
                                                    className='flex-1 min-w-0'
                                                >
                                                    <div className='text-sm text-white/70 leading-relaxed'>
                                                        <span className='font-semibold text-white'>
                                                            {n.actor.name}
                                                        </span>{" "}
                                                        {(() => {
                                                            if (
                                                                n.type ===
                                                                    "upvote" &&
                                                                n.targetType ===
                                                                    "Post"
                                                            )
                                                                return (
                                                                    <p className='flex flex-1 items-center gap-1 truncate'>
                                                                        upvoted
                                                                        your{" "}
                                                                        {n.targetType.toLowerCase()}
                                                                        :
                                                                        <span className='truncate text-blue-400'>
                                                                            &quot;
                                                                            {
                                                                                n
                                                                                    .target
                                                                                    .title
                                                                            }
                                                                            &quot;
                                                                        </span>
                                                                    </p>
                                                                )

                                                            if (
                                                                n.type ===
                                                                    "upvote" &&
                                                                n.targetType ===
                                                                    "Comment"
                                                            )
                                                                return (
                                                                    <p className='flex flex-1 items-center gap-1 truncate'>
                                                                        upvoted
                                                                        your{" "}
                                                                        {n.targetType.toLowerCase()}
                                                                        :
                                                                        <span className='truncate text-blue-400'>
                                                                            &quot;
                                                                            {
                                                                                (
                                                                                    n.target as TargetAsComment
                                                                                )
                                                                                    .content
                                                                            }
                                                                            &quot;
                                                                        </span>
                                                                    </p>
                                                                )

                                                            if (
                                                                n.type ===
                                                                    "upvote" &&
                                                                n.targetType ===
                                                                    "Reply"
                                                            )
                                                                return (
                                                                    <p className='flex flex-1 items-center gap-1 truncate'>
                                                                        upvoted
                                                                        your{" "}
                                                                        {n.targetType.toLowerCase()}
                                                                        :
                                                                        <span className='truncate text-blue-400'>
                                                                            &quot;
                                                                            {
                                                                                (
                                                                                    n.target as TargetAsReply
                                                                                )
                                                                                    .content
                                                                            }
                                                                            &quot;
                                                                        </span>
                                                                    </p>
                                                                )

                                                            if (
                                                                n.type ===
                                                                    "downvote" &&
                                                                n.targetType ===
                                                                    "Post"
                                                            )
                                                                return (
                                                                    <p className='flex flex-1 items-center gap-1 truncate'>
                                                                        downvoted
                                                                        your{" "}
                                                                        {n.targetType.toLowerCase()}
                                                                        :
                                                                        <span className='truncate text-blue-400'>
                                                                            &quot;
                                                                            {
                                                                                n
                                                                                    .target
                                                                                    .title
                                                                            }
                                                                            &quot;
                                                                        </span>
                                                                    </p>
                                                                )

                                                            if (
                                                                n.type ===
                                                                    "downvote" &&
                                                                n.targetType ===
                                                                    "Comment"
                                                            )
                                                                return (
                                                                    <p className='flex flex-1 items-center gap-1 truncate'>
                                                                        downvoted
                                                                        your{" "}
                                                                        {n.targetType.toLowerCase()}
                                                                        :
                                                                        <span className='truncate text-blue-400'>
                                                                            &quot;
                                                                            {
                                                                                (
                                                                                    n.target as TargetAsComment
                                                                                )
                                                                                    .content
                                                                            }
                                                                            &quot;
                                                                        </span>
                                                                    </p>
                                                                )

                                                            if (
                                                                n.type ===
                                                                    "downvote" &&
                                                                n.targetType ===
                                                                    "Reply"
                                                            )
                                                                return (
                                                                    <p className='flex flex-1 items-center gap-1 truncate'>
                                                                        downvoted
                                                                        your{" "}
                                                                        {n.targetType.toLowerCase()}
                                                                        :
                                                                        <span className='truncate text-blue-400'>
                                                                            &quot;
                                                                            {
                                                                                (
                                                                                    n.target as TargetAsReply
                                                                                )
                                                                                    .content
                                                                            }
                                                                            &quot;
                                                                        </span>
                                                                    </p>
                                                                )

                                                            if (
                                                                n.type ===
                                                                "bookmark"
                                                            )
                                                                return (
                                                                    <p className='flex flex-1 items-center gap-1 truncate'>
                                                                        bookmarked
                                                                        your{" "}
                                                                        {n.targetType.toLowerCase()}
                                                                        :
                                                                        <span className='truncate text-blue-400'>
                                                                            &quot;
                                                                            {
                                                                                n
                                                                                    .target
                                                                                    .title
                                                                            }
                                                                            &quot;
                                                                        </span>
                                                                    </p>
                                                                )

                                                            if (
                                                                n.type ===
                                                                "repost"
                                                            )
                                                                return (
                                                                    <p className='flex flex-1 items-center gap-1 truncate'>
                                                                        reposted
                                                                        your{" "}
                                                                        {n.targetType.toLowerCase()}
                                                                        :
                                                                        <span className='truncate text-blue-400'>
                                                                            &quot;
                                                                            {
                                                                                n
                                                                                    .target
                                                                                    .title
                                                                            }
                                                                            &quot;
                                                                        </span>
                                                                    </p>
                                                                )

                                                            if (
                                                                n.type ===
                                                                    "comment" &&
                                                                (
                                                                    n.target as TargetAsComment
                                                                )?.content
                                                            )
                                                                return (
                                                                    <>
                                                                        commented:
                                                                        <div className='mt-2 p-2 glassmorphism bg-blue-900/50 text-xs text-white italic line-clamp-1'>
                                                                            {
                                                                                (
                                                                                    n.target as TargetAsComment
                                                                                )
                                                                                    .content
                                                                            }
                                                                        </div>
                                                                    </>
                                                                )

                                                            if (
                                                                n.type ===
                                                                    "reply" &&
                                                                (
                                                                    n.target as TargetAsReply
                                                                )?.content
                                                            )
                                                                return (
                                                                    <>
                                                                        replied:
                                                                        <div className='mt-2 p-2 glassmorphism bg-blue-900/50 text-xs text-white italic line-clamp-1'>
                                                                            {
                                                                                (
                                                                                    n.target as TargetAsReply
                                                                                )
                                                                                    .content
                                                                            }
                                                                        </div>
                                                                    </>
                                                                )

                                                            return (
                                                                <>
                                                                    performed{" "}
                                                                    {n.type}
                                                                </>
                                                            )
                                                        })()}
                                                    </div>
                                                    <div className='flex items-center justify-between mt-2'>
                                                        <span className='text-xs text-white/50 dark:text-gray-400 font-medium'>
                                                            {formatDate(
                                                                new Date(
                                                                    n.createdAt
                                                                )
                                                            )}
                                                        </span>
                                                    </div>
                                                </LoadingLink>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className='flex flex-col items-center justify-center py-16 px-6 text-center'
                            >
                                <div className='w-16 h-16 glasmorphism bg-white/10 rounded-full flex items-center justify-center mb-4'>
                                    <Bell className='w-8 h-8 text-white' />
                                </div>
                                <h3 className='text-lg font-medium text-white mb-2'>
                                    No notifications yet
                                </h3>
                                <p className='text-sm text-white/70'>
                                    When you get notifications, they&apos;ll
                                    show up here.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                {/* <SheetFooter>
                    {unreadCount > 0 && (
                        <Button
                            variant='ghost'
                            size='sm'
                            className='text-xs mr-3 button'
                            onClick={markAsRead}
                        >
                            <Check className='w-3 h-3 mr-1' />
                            Mark all read
                        </Button>
                    )}
                </SheetFooter> */}
            </SheetContent>
        </Sheet>
    )
}
