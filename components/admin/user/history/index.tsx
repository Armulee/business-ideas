"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Clock, User, Shield, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import axios from "axios"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AdminAction {
    _id: string
    user: {
        _id: string
        name: string
        email: string
        avatar?: string
        profileId: number
    } | null
    action:
        | "restrict"
        | "delete"
        | "reset_avatar"
        | "reset_username"
        | "reset_bio"
        | "change_role"
    reason: string
    duration?: string
    previousRole?: string
    newRole?: string
    previousAvatar?: string
    previousUsername?: string
    newUsername?: string
    previousBio?: string
    admin: {
        _id: string
        name: string
        email: string
        avatar?: string
        profileId: number
    } | null
    result:
        | "approved"
        | "temporary_ban"
        | "permanent_ban"
        | "reset_avatar"
        | "reset_username"
        | "reset_bio"
        | "role_changed"
    createdAt: string
    updatedAt: string
}

interface Pagination {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
}

export default function UserManagementHistory() {
    const [actions, setActions] = useState<AdminAction[]>([])
    const [loading, setLoading] = useState(true)
    const [pagination, setPagination] = useState<Pagination | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [deletingActionId, setDeletingActionId] = useState<string | null>(
        null
    )

    /**
     * Fetch administrative actions from the API
     */
    const fetchActions = async (page = 1) => {
        try {
            setLoading(true)
            const response = await axios.get(
                `/api/admin/users/history?page=${page}&limit=20`
            )

            if (response.status !== 200) {
                throw new Error("Failed to fetch admin actions")
            }

            console.log(response)
            setActions(response.data.actions)
            setPagination(response.data.pagination)
        } catch (error) {
            console.error("Error fetching admin actions:", error)
            toast.error("Failed to load admin actions")
        } finally {
            setLoading(false)
        }
    }

    /**
     * Delete an administrative action record
     */
    const deleteAction = async (actionId: string) => {
        try {
            setDeletingActionId(actionId)

            const response = await fetch(
                `/api/admin/users/history/${actionId}`,
                {
                    method: "DELETE",
                }
            )

            if (!response.ok) {
                throw new Error("Failed to delete action")
            }

            toast.success("Action record deleted successfully")

            // Remove from local state
            setActions((prev) =>
                prev.filter((action) => action._id !== actionId)
            )
        } catch (error) {
            console.error("Error deleting action:", error)
            toast.error("Failed to delete action record")
        } finally {
            setDeletingActionId(null)
        }
    }

    /**
     * Get action badge styling based on action type
     */
    const getActionBadgeStyle = (action: string) => {
        switch (action) {
            case "delete":
                return "text-red-400 bg-red-400/20 border-red-400/30"
            case "restrict":
                return "text-yellow-400 bg-yellow-400/20 border-yellow-400/30"
            case "reset_avatar":
                return "text-blue-400 bg-blue-400/20 border-blue-400/30"
            case "reset_username":
                return "text-green-400 bg-green-400/20 border-green-400/30"
            case "reset_bio":
                return "text-green-400 bg-green-400/20 border-green-400/30"
            case "change_role":
                return "text-purple-400 bg-purple-400/20 border-purple-400/30"
            default:
                return "text-white bg-white/20 border-white/30"
        }
    }

    /**
     * Get card background styling based on action type
     */
    const getCardBackgroundStyle = (action: string) => {
        switch (action) {
            case "delete":
                return "bg-red-400/5 border-r-red-400"
            case "restrict":
                return "bg-yellow-400/5 border-r-yellow-400"
            case "reset_avatar":
                return "bg-blue-400/5 border-r-blue-400"
            case "reset_username":
                return "bg-green-400/5 border-r-green-400"
            case "reset_bio":
                return "bg-green-400/5 border-r-green-400"
            case "change_role":
                return "bg-purple-400/5 border-r-purple-400"
            default:
                return "bg-white/5 border-r-white"
        }
    }

    /**
     * Format action display name
     */
    const formatActionName = (action: string) => {
        switch (action) {
            case "reset_avatar":
                return "Reset Avatar"
            case "reset_username":
                return "Reset Username"
            case "reset_bio":
                return "Reset Bio"
            case "change_role":
                return "Change Role"
            default:
                return action.charAt(0).toUpperCase() + action.slice(1)
        }
    }

    useEffect(() => {
        fetchActions(currentPage)
    }, [currentPage])

    console.log(actions)

    if (loading) {
        return (
            <div className='container mx-auto py-8'>
                <div className='flex items-center justify-center h-64'>
                    <div className='text-lg'>Loading admin actions...</div>
                </div>
            </div>
        )
    }

    return (
        <div className='container mx-auto py-8'>
            <Card className='glassmorphism bg-transparent text-white'>
                <CardHeader>
                    <CardTitle className='flex items-center gap-3 text-xl'>
                        <Clock className='min-h-5 min-w-5' />
                        User Management Actions History
                    </CardTitle>
                    <p className='text-sm text-white/50'>
                        View and manage all administrative actions taken on user
                        accounts
                    </p>
                </CardHeader>
                <CardContent>
                    {actions?.length === 0 ? (
                        <div className='text-center py-8'>
                            <p className='text-white/50'>
                                No administrative actions found
                            </p>
                        </div>
                    ) : (
                        <div className='space-y-4'>
                            {actions?.map((action) => (
                                <Card
                                    key={action._id}
                                    className={`relative text-white border-l-0 border-y-0 border-r-4 ${getCardBackgroundStyle(action.action)}`}
                                >
                                    <CardContent className='pt-6'>
                                        <div className='flex items-start justify-between'>
                                            <div className='flex-1 space-y-3'>
                                                {/* Action Header */}
                                                <div className='flex items-center gap-3 flex-wrap'>
                                                    <Badge
                                                        className={`border ${getActionBadgeStyle(action.action)}`}
                                                    >
                                                        {formatActionName(
                                                            action.action
                                                        )}
                                                    </Badge>
                                                    {/* <Badge
                                                        variant={getResultBadgeVariant(
                                                            action.result
                                                        )}
                                                    >
                                                        {formatResultName(
                                                            action.result
                                                        )}
                                                    </Badge> */}
                                                    {action.duration && (
                                                        <Badge className='border text-yellow-400 bg-yellow-400/20 border-yellow-400/30'>
                                                            <Clock className='h-3 w-3 mr-2' />
                                                            {action.duration}{" "}
                                                            day
                                                            {parseInt(
                                                                action.duration
                                                            ) === 1
                                                                ? ""
                                                                : "s"}
                                                        </Badge>
                                                    )}
                                                </div>

                                                {/* Target User */}
                                                <div className='flex items-center gap-2 text-sm'>
                                                    <User className='h-4 w-4 text-white/70' />
                                                    <span className='font-bold hidden sm:block'>
                                                        Target:
                                                    </span>
                                                    {action.user && action.user.name ? (
                                                        <Link
                                                            className='flex items-center gap-1 text-white/70'
                                                            href={`/profile/${action.user.profileId}/${encodeURIComponent(action.user.name.toLowerCase())}`}
                                                        >
                                                            <Avatar className='w-6 h-6'>
                                                                <AvatarImage
                                                                    src={action.user.avatar}
                                                                />
                                                                <AvatarFallback className='text-[10px]'>
                                                                    {action.user.name[0].toLocaleUpperCase()}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            {action.user.name}
                                                        </Link>
                                                    ) : (
                                                        <span className='flex items-center gap-1 text-red-400'>
                                                            <Avatar className='w-6 h-6'>
                                                                <AvatarFallback className='text-[10px] bg-red-400/20'>
                                                                    ?
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            Deleted User
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Admin */}
                                                <div className='flex items-center gap-2 text-sm'>
                                                    <Shield className='h-4 w-4 text-white/70' />
                                                    <span className='font-bold hidden sm:block'>
                                                        Admin:
                                                    </span>
                                                    {action.admin && action.admin.name ? (
                                                        <Link
                                                            className='flex items-center gap-1 text-white/70'
                                                            href={`/profile/${action.admin.profileId}/${encodeURIComponent(action.admin.name.toLowerCase())}`}
                                                        >
                                                            <Avatar className='w-6 h-6'>
                                                                <AvatarImage
                                                                    src={action.admin.avatar}
                                                                />
                                                                <AvatarFallback className='text-[10px]'>
                                                                    {action.admin.name[0].toLocaleUpperCase()}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            {action.admin.name}
                                                        </Link>
                                                    ) : (
                                                        <span className='flex items-center gap-1 text-yellow-400'>
                                                            <Avatar className='w-6 h-6'>
                                                                <AvatarFallback className='text-[10px] bg-yellow-400/20'>
                                                                    A
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            Unknown Admin
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Role Changes */}
                                                {action.previousRole &&
                                                    action.newRole && (
                                                        <div className='flex items-center gap-2 text-sm'>
                                                            <span className='font-medium'>
                                                                Role Change:
                                                            </span>
                                                            <span className='text-white/70'>
                                                                {action.previousRole}
                                                            </span>
                                                            <span>→</span>
                                                            <span className='font-medium'>
                                                                {action.newRole}
                                                            </span>
                                                        </div>
                                                    )}

                                                {/* Avatar Reset */}
                                                {action.action === "reset_avatar" && action.previousAvatar && (
                                                    <div className='flex items-center gap-2 text-sm'>
                                                        <span className='font-medium'>
                                                            Avatar Reset:
                                                        </span>
                                                        <Avatar className='w-6 h-6'>
                                                            <AvatarImage src={action.previousAvatar} />
                                                            <AvatarFallback className='text-[10px]'>
                                                                OLD
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span>→</span>
                                                        <span className='text-red-400 font-medium'>
                                                            Removed
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Username Reset */}
                                                {action.action === "reset_username" && action.previousUsername && action.newUsername && (
                                                    <div className='flex items-center gap-2 text-sm'>
                                                        <span className='font-medium'>
                                                            Username Change:
                                                        </span>
                                                        <span className='text-white/70'>
                                                            {action.previousUsername}
                                                        </span>
                                                        <span>→</span>
                                                        <span className='font-medium'>
                                                            {action.newUsername}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Bio Reset */}
                                                {action.action === "reset_bio" && action.previousBio && (
                                                    <div className='flex items-start gap-2 text-sm'>
                                                        <span className='font-medium'>
                                                            Bio Reset:
                                                        </span>
                                                        <div className='flex-1'>
                                                            <div className='text-white/70 text-xs bg-white/10 p-2 rounded max-w-xs truncate'>
                                                                {action.previousBio}
                                                            </div>
                                                            <div className='text-center text-white/50 my-1'>↓</div>
                                                            <span className='text-red-400 font-medium'>
                                                                Removed
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Reason */}
                                                <div className='text-sm'>
                                                    <p className='text-white/70 mt-1'>
                                                        <strong className='text-white mr-1'>
                                                            Reason:
                                                        </strong>
                                                        {action.reason}
                                                    </p>
                                                </div>

                                                {/* Timestamp */}
                                                <div className='flex items-center gap-2 text-xs text-white/70'>
                                                    <Calendar className='h-3 w-3' />
                                                    <span>
                                                        {formatDistanceToNow(
                                                            new Date(
                                                                action.createdAt
                                                            ),
                                                            { addSuffix: true }
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Delete Button */}
                                            <Button
                                                variant='ghost'
                                                size='sm'
                                                onClick={() =>
                                                    deleteAction(action._id)
                                                }
                                                disabled={
                                                    deletingActionId ===
                                                    action._id
                                                }
                                                className='absolute top-4 right-4 text-red-600 hover:text-red-700 hover:bg-red-50'
                                            >
                                                <Trash2 className='h-4 w-4' />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination && pagination.pages > 1 && (
                        <div className='flex items-center justify-between mt-6'>
                            <p className='text-sm text-muted-foreground'>
                                Showing {actions.length} of {pagination.total}{" "}
                                actions
                            </p>
                            <div className='flex gap-2'>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={() =>
                                        setCurrentPage((prev) => prev - 1)
                                    }
                                    disabled={!pagination.hasPrev}
                                >
                                    Previous
                                </Button>
                                <span className='flex items-center px-3 text-sm'>
                                    Page {pagination.page} of {pagination.pages}
                                </span>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={() =>
                                        setCurrentPage((prev) => prev + 1)
                                    }
                                    disabled={!pagination.hasNext}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
