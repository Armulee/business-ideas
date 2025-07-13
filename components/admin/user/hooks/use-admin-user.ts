import { useState, useCallback, useEffect } from "react"
import { toast } from "sonner"
import { User, Pagination, UserAction, Stats, Action, Role } from "../types"

export function useAdminUsers() {
    const [users, setUsers] = useState<User[]>([])
    const [pagination, setPagination] = useState<Pagination | null>(null)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [startDate, setStartDate] = useState<Date>()
    const [endDate, setEndDate] = useState<Date>()
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedActions, setSelectedActions] = useState<
        Map<string, UserAction>
    >(new Map())
    const [stats, setStats] = useState<Stats | null>(null)

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

    const fetchStats = useCallback(async () => {
        try {
            const response = await fetch("/api/admin/stats")
            if (response.ok) {
                const stats = await response.json()
                setStats(stats)
            }
        } catch (error) {
            console.error("Error fetching admin stats:", error)
        }
    }, [])

    const handleActionSelect = (
        userId: string,
        action: Action,
        duration?: string,
        role?: Role
    ) => {
        const newActions = new Map(selectedActions)
        const existingAction = newActions.get(userId)

        if (existingAction) {
            const newActionSet = new Set(existingAction.actions)
            if (newActionSet.has(action)) {
                newActionSet.delete(action)
            } else {
                newActionSet.add(action)
            }

            if (newActionSet.size === 0) {
                newActions.delete(userId)
            } else {
                newActions.set(userId, {
                    ...existingAction,
                    actions: newActionSet,
                    duration:
                        action === "restrict"
                            ? duration
                            : existingAction.duration,
                    role: action === "change_role" ? role : existingAction.role,
                })
            }
        } else {
            const actionSet = new Set<Action>()
            actionSet.add(action)
            newActions.set(userId, {
                userId,
                actions: actionSet,
                duration,
                role,
                reasons: [],
                actionReasons: new Map(),
            })
        }

        setSelectedActions(newActions)
    }

    const executeBulkActions = async () => {
        if (selectedActions.size === 0) {
            toast.error("No actions selected")
            return
        }

        // Convert Set-based actions to individual action objects for API
        const actionsArray: {
            userId: string
            action: Action
            duration?: string
            role?: Role
            reasons: string[]
        }[] = []

        selectedActions.forEach((userAction) => {
            userAction.actions.forEach((action) => {
                // Get action-specific reasons, fallback to general reasons for backward compatibility
                const actionReasons = userAction.actionReasons?.get(action) || userAction.reasons
                
                actionsArray.push({
                    userId: userAction.userId,
                    action,
                    duration: userAction.duration,
                    role: userAction.role,
                    reasons: actionReasons,
                })
            })
        })

        const actionsWithoutReasons = actionsArray.filter(
            (action) => action.reasons.length === 0
        )

        if (actionsWithoutReasons.length > 0) {
            toast.error("Please provide reasons for all selected actions")
            return
        }

        try {
            setLoading(true)
            const response = await fetch("/api/admin/users/bulk-actions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ actions: actionsArray }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Bulk actions failed")
            }

            const result = await response.json()
            toast.success(result.message || "Actions completed successfully")

            // Clear selections and refresh
            setSelectedActions(new Map())
            await fetchUsers(1, false)
            await fetchStats()
            setCurrentPage(1)
        } catch (error) {
            console.error("Error executing bulk actions:", error)
            toast.error(
                error instanceof Error ? error.message : "Bulk actions failed"
            )
        } finally {
            setLoading(false)
        }
    }

    const clearAllSelections = () => {
        setSelectedActions(new Map())
    }

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 500)
        return () => clearTimeout(timer)
    }, [search])

    // Initial load
    useEffect(() => {
        const loadUsers = async () => {
            await fetchUsers(1, false)
            setCurrentPage(1)
        }
        loadUsers()
        fetchStats()
    }, [debouncedSearch, startDate, endDate, fetchUsers, fetchStats])

    return {
        // State
        users,
        pagination,
        loading,
        search,
        setSearch,
        debouncedSearch,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        currentPage,
        selectedActions,
        setSelectedActions,
        stats,

        // Actions
        fetchUsers,
        handleActionSelect,
        executeBulkActions,
        clearAllSelections,
        setCurrentPage,
    }
}
