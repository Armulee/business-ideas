"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
    CalendarIcon,
    Search,
    // MoreVertical,
    Shield,
    Trash2,
    // RefreshCw,
} from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface User {
    _id: string
    profileId: number
    name: string
    email: string
    avatar?: string
    role: string
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

type Action =
    | "restrict"
    | "delete"
    | "reset_avatar"
    | "reset_username"
    | "change_role"
    | null

type Role = "user" | "moderator" | "admin"

const ROLES: Role[] = ["user", "moderator", "admin"]

const RESTRICTION_OPTIONS = [
    { value: "1", label: "1 Day" },
    { value: "2", label: "2 Days" },
    { value: "3", label: "3 Days" },
    { value: "4", label: "4 Days" },
    { value: "5", label: "5 Days" },
    { value: "6", label: "6 Days" },
    { value: "7", label: "7 Days" },
    { value: "14", label: "14 Days" },
    { value: "30", label: "30 Days" },
]

export default function AdminUserManagment() {
    const [users, setUsers] = useState<User[]>([])
    const [pagination, setPagination] = useState<Pagination | null>(null)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [startDate, setStartDate] = useState<Date>()
    const [endDate, setEndDate] = useState<Date>()
    const [currentPage, setCurrentPage] = useState(1)
    // Dialog states
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean
        action: Action
        user: User | null
        duration?: string
        role?: Role
    }>({ isOpen: false, action: null, user: null })

    const [reasonDialog, setReasonDialog] = useState<{
        isOpen: boolean
        reason: string
    }>({ isOpen: false, reason: "" })

    const fetchUsers = useCallback(
        async (page = 1, append = false) => {
            try {
                setLoading(true)
                const params = new URLSearchParams({
                    page: page.toString(),
                    limit: "20",
                    ...(debouncedSearch && { search: debouncedSearch }),
                    ...(startDate && { startDate: startDate.toISOString() }),
                    ...(endDate && { endDate: endDate.toISOString() }),
                })

                const response = await fetch(`/api/admin/users?${params}`)
                if (!response.ok) throw new Error("Failed to fetch users")

                const data = await response.json()

                if (append) {
                    setUsers((prev) => [...prev, ...data.users])
                } else {
                    setUsers(data.users)
                }

                setPagination(data.pagination)
            } catch (error) {
                console.error("Error fetching users:", error)
                toast.error("Failed to fetch users")
            } finally {
                setLoading(false)
            }
        },
        [debouncedSearch, startDate, endDate]
    )

    useEffect(() => {
        const loadUsers = async () => {
            await fetchUsers(1, false)
            setCurrentPage(1)
        }
        loadUsers()
    }, [debouncedSearch, startDate, endDate, fetchUsers])

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 500) // 500ms delay

        return () => clearTimeout(timer)
    }, [search])

    const handleLoadMore = useCallback(() => {
        if (pagination?.hasNext && !loading) {
            const nextPage = currentPage + 1
            setCurrentPage(nextPage)
            fetchUsers(nextPage, true)
        }
    }, [pagination?.hasNext, loading, currentPage, fetchUsers])

    // Handle infinite scroll
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 1000
            ) {
                if (pagination?.hasNext && !loading) {
                    handleLoadMore()
                }
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [pagination, loading, handleLoadMore])

    const handleRestrict = (user: User, duration: string) => {
        setConfirmDialog({
            isOpen: true,
            action: "restrict",
            user,
            duration,
        })
    }

    const handleChangeRole = (
        user: User,
        role: "user" | "moderator" | "admin"
    ) => {
        setConfirmDialog({ isOpen: true, action: "change_role", user, role })
    }

    const handleDelete = (user: User) => {
        setConfirmDialog({ isOpen: true, action: "delete", user })
    }

    const handleResetAvatar = (user: User) => {
        setConfirmDialog({ isOpen: true, action: "reset_avatar", user })
    }

    const handleResetUsername = (user: User) => {
        setConfirmDialog({ isOpen: true, action: "reset_username", user })
    }

    const executeAction = async () => {
        if (!confirmDialog.user || !confirmDialog.action) return

        if (!reasonDialog.reason.trim()) {
            setReasonDialog({ isOpen: true, reason: "" })
            return
        }

        try {
            let endpoint = ""
            const body = {
                userId: confirmDialog.user.profileId,
                reason: reasonDialog.reason,
                ...(confirmDialog.action === "restrict" &&
                    confirmDialog.duration && {
                        duration: confirmDialog.duration,
                    }),
            }

            switch (confirmDialog.action) {
                case "restrict":
                    if (!confirmDialog.duration) {
                        toast.error("Please select a restriction duration")
                        return
                    }
                    endpoint = "/api/admin/users/restrict"
                    break
                case "delete":
                    endpoint = "/api/admin/users/delete"
                    break
                case "reset_avatar":
                    endpoint = "/api/admin/users/reset-avatar"
                    break
                case "reset_username":
                    endpoint = "/api/admin/users/reset-username"
                    break
                case "change_role":
                    endpoint = "/api/admin/users/reset-username"
                    break
            }

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Action failed")
            }

            const result = await response.json()

            toast.success(result.message || "Action completed successfully")

            // Refresh users list
            await fetchUsers(1, false)
            setCurrentPage(1)

            // Close dialogs
            setConfirmDialog({ isOpen: false, action: null, user: null })
            setReasonDialog({ isOpen: false, reason: "" })
        } catch (error) {
            console.error("Error executing action:", error)
            toast.error(
                error instanceof Error ? error.message : "Action failed"
            )
        }
    }

    const confirmAction = () => {
        setReasonDialog({ isOpen: true, reason: "" })
    }

    return (
        <div className='container mx-auto py-8 space-y-6'>
            <Card className='bg-white/10 backdrop-blur-md border-white/20'>
                <CardHeader>
                    <CardTitle className='text-white'>
                        User Management
                    </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    {/* Search and Filters */}
                    <div className='flex flex-col md:flex-row gap-4'>
                        <div className='relative flex-1'>
                            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 z-10' />
                            <Input
                                placeholder='Search by name or email...'
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className='input text-white pl-8 text-sm placeholder:text-sm'
                            />
                            {search !== debouncedSearch && (
                                <div className='absolute right-3 top-3'>
                                    <div className='h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin' />
                                </div>
                            )}
                        </div>

                        {/* Date Range Filter */}
                        <div className='flex gap-2'>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant='outline'
                                        className={cn(
                                            "button",
                                            !startDate && "!text-gray-400"
                                        )}
                                    >
                                        <CalendarIcon className='mr-2 h-4 w-4' />
                                        {startDate
                                            ? format(startDate, "PPP")
                                            : "Start date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className='w-auto p-0 border-0 rounded-lg'>
                                    <Calendar
                                        mode='single'
                                        className='bg-gray-800 rounded text-white'
                                        selected={startDate}
                                        onSelect={setStartDate}
                                        disabled={(date) =>
                                            date > new Date() ||
                                            date < new Date("1900-01-01")
                                        }
                                    />
                                </PopoverContent>
                            </Popover>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant='outline'
                                        className={cn(
                                            "button",
                                            !endDate && "!text-gray-400"
                                        )}
                                    >
                                        <CalendarIcon className='mr-2 h-4 w-4' />
                                        {endDate
                                            ? format(endDate, "PPP")
                                            : "End date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className='w-auto p-0 border-0 rounded-lg'>
                                    <Calendar
                                        mode='single'
                                        className='bg-gray-800 rounded text-white'
                                        selected={endDate}
                                        onSelect={setEndDate}
                                        disabled={(date) =>
                                            date > new Date() ||
                                            date < new Date("1900-01-01")
                                        }
                                    />
                                </PopoverContent>
                            </Popover>

                            {(startDate || endDate) && (
                                <Button
                                    variant='ghost'
                                    onClick={() => {
                                        setStartDate(undefined)
                                        setEndDate(undefined)
                                    }}
                                    className='text-white hover:bg-white/20'
                                >
                                    Clear
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Users List */}
                    <ul className='space-y-4'>
                        {users.map((user) => (
                            <li
                                key={user._id}
                                className='flex sm:flex-row flex-col items-start justify-between gap-4 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors'
                            >
                                <div className='flex items-center gap-4'>
                                    <Avatar
                                        className='cursor-pointer hover:opacity-80 transition-opacity'
                                        onClick={() => handleResetAvatar(user)}
                                        title='Click to reset avatar'
                                    >
                                        <AvatarImage src={user.avatar} />
                                        <AvatarFallback className='bg-blue-600 text-white'>
                                            {user.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div>
                                        <div className='flex items-center gap-2'>
                                            <h3
                                                className='text-white font-medium cursor-pointer hover:text-blue-400 transition-colors'
                                                onClick={() =>
                                                    handleResetUsername(user)
                                                }
                                                title='Click to reset username'
                                            >
                                                {user.name}
                                            </h3>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Badge
                                                        className='cursor-pointer hover:bg-black/20'
                                                        variant={
                                                            user.role ===
                                                            "admin"
                                                                ? "default"
                                                                : "secondary"
                                                        }
                                                    >
                                                        {user.role}
                                                    </Badge>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className='bg-gray-800 border-gray-600'>
                                                    {ROLES.map((option) => (
                                                        <DropdownMenuItem
                                                            key={option}
                                                            onClick={() =>
                                                                handleChangeRole(
                                                                    user,
                                                                    option
                                                                )
                                                            }
                                                            className='text-white hover:!text-white hover:bg-gray-700 focus:bg-gray-700'
                                                        >
                                                            {option}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <p className='text-gray-400 text-sm'>
                                            {user.email}
                                        </p>
                                        <p className='text-gray-500 text-xs'>
                                            Joined{" "}
                                            {format(
                                                new Date(user.createdAt),
                                                "MMM dd, yyyy"
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className='w-full flex sm:justify-end justify-center my-auto items-center space-x-2'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant='outline'
                                                size='sm'
                                                className='bg-yellow-600 hover:bg-yellow-700 border-0 text-white hover:text-white'
                                            >
                                                <Shield className='h-4 w-4 mr-1' />
                                                Restrict
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className='bg-gray-800 border-gray-600'>
                                            {RESTRICTION_OPTIONS.map(
                                                (option) => (
                                                    <DropdownMenuItem
                                                        key={option.value}
                                                        onClick={() =>
                                                            handleRestrict(
                                                                user,
                                                                option.value
                                                            )
                                                        }
                                                        className='text-white hover:!text-white hover:bg-gray-700 focus:bg-gray-700'
                                                    >
                                                        {option.label}
                                                    </DropdownMenuItem>
                                                )
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    <Button
                                        variant='destructive'
                                        size='sm'
                                        onClick={() => handleDelete(user)}
                                        className='bg-red-600 hover:bg-red-700'
                                    >
                                        <Trash2 className='h-4 w-4 mr-1' />
                                        Delete
                                    </Button>

                                    {/* <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant='ghost'
                                                size='sm'
                                                className='text-white hover:bg-white/20'
                                            >
                                                <MoreVertical className='h-4 w-4' />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className='bg-gray-800 border-gray-600'>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleResetAvatar(user)
                                                }
                                                className='text-white hover:bg-gray-700 focus:bg-gray-700'
                                            >
                                                <RefreshCw className='h-4 w-4 mr-2' />
                                                Reset Avatar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleResetUsername(user)
                                                }
                                                className='text-white hover:bg-gray-700 focus:bg-gray-700'
                                            >
                                                <RefreshCw className='h-4 w-4 mr-2' />
                                                Reset Username
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu> */}
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Load More Button */}
                    {pagination?.hasNext && (
                        <div className='text-center pt-4'>
                            <Button
                                onClick={handleLoadMore}
                                disabled={loading}
                                variant='outline'
                                className='bg-white/10 border-white/20 text-white hover:bg-white/20'
                            >
                                {loading ? "Loading..." : "Load More"}
                            </Button>
                        </div>
                    )}

                    {/* Pagination Info */}
                    {pagination && (
                        <div className='text-center text-gray-400 text-sm'>
                            Showing {users.length} of {pagination.total} users
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Confirm Action Dialog */}
            <Dialog
                open={confirmDialog.isOpen}
                onOpenChange={(open) =>
                    !open &&
                    setConfirmDialog({
                        isOpen: false,
                        action: null,
                        user: null,
                    })
                }
            >
                <DialogContent className='bg-gray-900 border-gray-700'>
                    <DialogHeader>
                        <DialogTitle className='text-white'>
                            Confirm{" "}
                            {confirmDialog.action
                                ?.replace("_", " ")
                                .toUpperCase()}
                        </DialogTitle>
                        <DialogDescription className='text-gray-300'>
                            Are you sure you want to{" "}
                            {confirmDialog.action?.replace("_", " ")} user
                            &quot;{confirmDialog.user?.name}&quot;?
                            {confirmDialog.action === "restrict" &&
                                confirmDialog.duration && (
                                    <span className='block mt-2 text-yellow-400'>
                                        Duration: {confirmDialog.duration} day
                                        {confirmDialog.duration !== "1"
                                            ? "s"
                                            : ""}
                                    </span>
                                )}
                            {confirmDialog.action === "delete" && (
                                <span className='text-red-400 block mt-2 font-semibold'>
                                    This action cannot be undone.
                                </span>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant='outline'
                            onClick={() =>
                                setConfirmDialog({
                                    isOpen: false,
                                    action: null,
                                    user: null,
                                })
                            }
                            className='bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                        >
                            Cancel
                        </Button>
                        <Button
                            variant={
                                confirmDialog.action === "delete"
                                    ? "destructive"
                                    : "default"
                            }
                            onClick={confirmAction}
                        >
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reason Dialog */}
            <Dialog
                open={reasonDialog.isOpen}
                onOpenChange={(open) =>
                    !open && setReasonDialog({ isOpen: false, reason: "" })
                }
            >
                <DialogContent className='bg-gray-900 border-gray-700'>
                    <DialogHeader>
                        <DialogTitle className='text-white'>
                            Provide Reason
                        </DialogTitle>
                        <DialogDescription className='text-gray-300'>
                            Please provide a reason for this action. This will
                            be included in the email notification sent to the
                            user.
                        </DialogDescription>
                    </DialogHeader>
                    <Textarea
                        placeholder='Enter reason for action...'
                        value={reasonDialog.reason}
                        onChange={(e) =>
                            setReasonDialog({
                                ...reasonDialog,
                                reason: e.target.value,
                            })
                        }
                        className='bg-gray-800 border-gray-600 text-white placeholder:text-gray-400'
                        rows={4}
                    />
                    <DialogFooter>
                        <Button
                            variant='outline'
                            onClick={() =>
                                setReasonDialog({ isOpen: false, reason: "" })
                            }
                            className='bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={executeAction}
                            disabled={!reasonDialog.reason.trim()}
                        >
                            Execute Action
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
