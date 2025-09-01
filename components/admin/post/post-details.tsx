"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import {
    ArrowLeft,
    Calendar,
    AlertTriangle,
    Trash2,
    Loader2,
    ExternalLink,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link"
import axios from "axios"

interface Author {
    _id: string
    profileId: number
    name: string
    email: string
    avatar?: string
}

interface Post {
    _id: string
    postId: number
    title: string
    author: Author
    content: string
    status: "draft" | "published" | "archived" | "restrict"
    createdAt: string
    updatedAt?: string
    publishedAt?: string
    categories: string[]
    tags?: string[]
    slug: string
    community: string
    viewCount?: number
    upvoteCount?: number
    downvoteCount?: number
    commentCount?: number
}

interface AdminPostDetailsProps {
    postId: string
}

export default function AdminPostDetails({ postId }: AdminPostDetailsProps) {
    const router = useRouter()
    const [post, setPost] = useState<Post | null>(null)
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)

    const fetchPost = useCallback(async () => {
        if (!postId) return

        try {
            const { data } = await axios.get(`/api/admin/post/${postId}`)
            setPost(data.post)
        } catch (error) {
            console.error("Error fetching post:", error)
            toast.error("Failed to load post details")
            router.push("/admin/post")
        } finally {
            setLoading(false)
        }
    }, [postId, router])

    useEffect(() => {
        if (postId) {
            fetchPost()
        }
    }, [fetchPost, postId])

    const handleWarnPost = async () => {
        setActionLoading(true)
        try {
            const { data } = await axios.patch(`/api/admin/post/${postId}/warn`)
            setPost(data.post)
            toast.success(
                "Post has been warned and restricted from public view"
            )
        } catch (error) {
            console.error("Error warning post:", error)
            toast.error("Failed to warn post")
        } finally {
            setActionLoading(false)
        }
    }

    const handleRemovePost = async () => {
        setActionLoading(true)
        try {
            await axios.delete(`/api/admin/post/${postId}`)
            toast.success("Post has been removed successfully")
            router.push("/admin/post")
        } catch (error) {
            console.error("Error removing post:", error)
            toast.error("Failed to remove post")
        } finally {
            setActionLoading(false)
        }
    }

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-96'>
                <Loader2 className='w-8 h-8 animate-spin text-white' />
            </div>
        )
    }

    if (!post) {
        return (
            <div className='p-6'>
                <div className='text-center text-gray-400'>Post not found</div>
            </div>
        )
    }

    return (
        <div className='px-2 py-3 space-y-6'>
            <div className='flex items-center gap-4'>
                <Button
                    variant='outline'
                    size='sm'
                    onClick={() => router.back()}
                    className='flex items-center gap-2 button'
                >
                    <ArrowLeft className='h-4 w-4' />
                    Back
                </Button>
                <h5 className='text-2xl font-bold text-white'>
                    Post Id: {post.postId}
                </h5>
            </div>

            {/* Actions */}
            <div className='flex items-center justify-between gap-3'>
                {post.status !== "restrict" && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant='outline'
                                className='button !bg-yellow-400/50 w-full justify-start text-yellow-400 border-yellow-400 hover:bg-yellow-400/10 hover:!text-yellow-900'
                                disabled={actionLoading}
                            >
                                <AlertTriangle className='h-4 w-4 mr-2' />
                                Restrict Post
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className='bg-black/90 border-white/20'>
                            <AlertDialogHeader>
                                <AlertDialogTitle className='text-white'>
                                    Restrict Post
                                </AlertDialogTitle>
                                <AlertDialogDescription className='text-gray-300'>
                                    This will mark the post as restricted and
                                    hide it from public view until the author
                                    reviews and edits it. The author will be
                                    notified.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className='bg-white/10 border-white/20 text-white hover:bg-white/20'>
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleWarnPost}
                                    className='bg-yellow-500 hover:bg-yellow-600 text-black'
                                >
                                    {actionLoading ? (
                                        <Loader2 className='h-4 w-4 animate-spin' />
                                    ) : (
                                        "Restrict Post"
                                    )}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant='outline'
                            className='button !bg-red-400/50 w-full justify-start text-red-400 border-red-400 hover:bg-red-400/10 hover:!text-red-900'
                            disabled={actionLoading}
                        >
                            <Trash2 className='h-4 w-4 mr-2' />
                            Remove Post
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className='bg-black/90 border-white/20'>
                        <AlertDialogHeader>
                            <AlertDialogTitle className='text-white'>
                                Remove Post
                            </AlertDialogTitle>
                            <AlertDialogDescription className='text-gray-300'>
                                This will permanently delete the post and all
                                associated data. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className='bg-white/10 border-white/20 text-white hover:bg-white/20'>
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleRemovePost}
                                className='bg-red-500 hover:bg-red-600'
                            >
                                {actionLoading ? (
                                    <Loader2 className='h-4 w-4 animate-spin' />
                                ) : (
                                    "Remove Post"
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            {/* Main Content */}
            <Card className='bg-white/10 backdrop-blur-md border-white/20'>
                <CardHeader>
                    <div className='flex items-start justify-between gap-4'>
                        <div className='flex-1'>
                            <div className='flex items-center gap-3 mb-2'>
                                <Badge
                                    variant='outline'
                                    className='text-xs text-white border-white/20'
                                >
                                    {post.community}
                                </Badge>
                                {post.categories.map((category, index) => (
                                    <Badge
                                        key={index}
                                        variant='secondary'
                                        className='bg-white/10 text-white border-white/20'
                                    >
                                        {category}
                                    </Badge>
                                ))}
                            </div>
                            <CardTitle className='text-white text-xl mb-2'>
                                {post.title}
                            </CardTitle>

                            {/* Avatar */}
                            <Link
                                href={`/profile/${post.author.profileId}/${encodeURIComponent(post.author.name.toLowerCase())}`}
                                target='_blank'
                                className='w-fit font-medium text-white hover:text-blue-400 transition-colors flex items-center gap-3'
                            >
                                <Avatar className='h-12 w-12'>
                                    <AvatarImage src={post.author.avatar} />
                                    <AvatarFallback className='bg-white/20 text-white'>
                                        {post.author.name
                                            ?.charAt(0)
                                            ?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    {post.author.name}
                                    <p className='text-sm text-gray-400'>
                                        {post.author.email}
                                    </p>
                                    <p className='text-sm text-gray-400'>
                                        Profile ID: {post.author.profileId}
                                    </p>
                                </div>
                            </Link>

                            <div className='flex items-center gap-2 text-sm my-2'>
                                <Calendar className='h-4 w-4 text-gray-400' />
                                <span className='text-gray-300'>
                                    Created:{" "}
                                    {format(new Date(post.createdAt), "PPP p")}
                                </span>
                            </div>

                            <Link
                                href={`/post/${post.postId}/${post.slug}`}
                                target='_blank'
                                className='inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors'
                            >
                                View public post{" "}
                                <ExternalLink className='h-3 w-3' />
                            </Link>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div className='prose prose-invert max-w-none'>
                        <div
                            className='text-gray-200 leading-relaxed'
                            dangerouslySetInnerHTML={{
                                __html: post.content,
                            }}
                        />
                    </div>

                    {/* Stats */}
                    <div className='flex flex-wrap gap-2'>
                        {post.updatedAt && (
                            <div className='glassmorphism px-3 py-1 flex items-center gap-2 text-sm'>
                                <Calendar className='h-4 w-4 text-gray-400' />
                                <span className='text-gray-300'>
                                    Updated:{" "}
                                    {format(new Date(post.updatedAt), "PPP p")}
                                </span>
                            </div>
                        )}

                        {post.publishedAt && (
                            <div className='glassmorphism px-3 py-1 flex items-center gap-2 text-sm'>
                                <Calendar className='h-4 w-4 text-gray-400' />
                                <span className='text-gray-300'>
                                    Published:{" "}
                                    {format(
                                        new Date(post.publishedAt),
                                        "PPP p"
                                    )}
                                </span>
                            </div>
                        )}

                        {post.viewCount !== undefined && (
                            <div className='glassmorphism px-3 py-1 text-sm text-gray-300'>
                                Views:{" "}
                                <span className='font-medium'>
                                    {post.viewCount.toLocaleString()}
                                </span>
                            </div>
                        )}

                        {post.upvoteCount !== undefined && (
                            <div className='glassmorphism px-3 py-1 text-sm text-gray-300'>
                                Upvotes:{" "}
                                <span className='font-medium'>
                                    {post.upvoteCount.toLocaleString()}
                                </span>
                            </div>
                        )}

                        {post.commentCount !== undefined && (
                            <div className='glassmorphism px-3 py-1 text-sm text-gray-300'>
                                Comments:{" "}
                                <span className='font-medium'>
                                    {post.commentCount.toLocaleString()}
                                </span>
                            </div>
                        )}
                    </div>

                    {post.tags && post.tags?.length > 0 && (
                        <div className='pt-4 border-t border-white/20'>
                            <div className='flex flex-wrap gap-2'>
                                {post.tags?.map((tag, index) => (
                                    <Badge
                                        key={index}
                                        variant='outline'
                                        className='text-gray-300 border-gray-400'
                                    >
                                        #{tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
