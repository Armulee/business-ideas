"use client"

import { useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import Stats from "./stats"
import { SearchFilters } from "./search"
import { UserItem } from "./user-item"
import { ReasonDialog } from "./reason-dialog"
import { useAdminUsers } from "./hooks/use-admin-user"
import { useDialogs } from "./hooks/use-dialog"
import {
    shouldHideActions,
    getActionButtonVariant,
    getActionButtonClass,
} from "./utils"
import { Action, Role } from "./types"

export default function AdminUserManagement() {
    // Get current user session for permission checks
    const { data: session } = useSession()

    // Extract user management state and functions from custom hook
    const {
        users, // Array of users to display
        pagination, // Pagination info (hasNext, total, etc.)
        loading, // Loading state for API calls
        search, // Current search input value
        setSearch, // Function to update search input
        debouncedSearch, // Debounced search value (500ms delay)
        startDate, // Date filter start range
        setStartDate, // Function to set start date
        endDate, // Date filter end range
        setEndDate, // Function to set end date
        currentPage, // Current page number for pagination
        selectedActions, // Map of userId -> UserAction for bulk operations
        setSelectedActions, // Function to update selected actions
        stats, // Admin statistics (total users, restrictions, etc.)
        fetchUsers, // Function to fetch users with filters
        executeBulkActions, // Function to execute all selected actions
        setCurrentPage, // Function to update current page
    } = useAdminUsers()

    // Extract dialog state and functions from custom hook
    const {
        reasonDialog, // State for reason selection dialog
        setReasonDialog, // Function to update reason dialog state
        closeReasonDialog, // Function to close reason dialog
        handleReasonSelect, // Function to select/deselect reasons
    } = useDialogs()

    // Get current user ID to prevent self-actions
    const currentUserId = session?.user?.id

    // Handle "Load More" button click for pagination
    const handleLoadMore = useCallback(() => {
        if (pagination?.hasNext && !loading) {
            const nextPage = currentPage + 1
            setCurrentPage(nextPage)
            fetchUsers(nextPage, true) // true = append to existing users
        }
    }, [pagination?.hasNext, loading, currentPage, fetchUsers, setCurrentPage])

    // Set up infinite scroll functionality
    useEffect(() => {
        const handleScroll = () => {
            // Check if user scrolled near bottom (within 1000px)
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 1000
            ) {
                // Load more users if there are more pages available
                if (pagination?.hasNext && !loading) {
                    handleLoadMore()
                }
            }
        }

        // Add scroll event listener
        window.addEventListener("scroll", handleScroll)
        // Cleanup function to remove listener on unmount
        return () => window.removeEventListener("scroll", handleScroll)
    }, [pagination, loading, handleLoadMore])

    // Handle opening the reason dialog when clicking a specific user part
    const handlePartClick = (userId: string, part: string, selectedRole?: string, selectedDuration?: string) => {
        const user = users.find((u) => u._id === userId)
        if (user && !shouldHideActions(user, currentUserId)) {
            // Map part names to actions
            const partToAction: Record<string, Action> = {
                avatar: "reset_avatar",
                name: "reset_username",
                bio: "reset_bio",
                role: "change_role",
                restrict: "restrict",
                delete: "delete",
            }

            const action = partToAction[part]
            if (action) {
                // Get existing reasons for this specific action if they exist
                const existingAction = selectedActions.get(userId)
                const existingReasons = existingAction?.actionReasons?.get(action) || []
                
                // Open simple reason dialog for this specific part
                setReasonDialog({
                    isOpen: true,
                    userId,
                    selectedReasons: existingReasons,
                    customReason: "",
                    showCustom: existingReasons.includes("Other"),
                    part, // Add part info to track which part was clicked
                    selectedRole: part === "role" ? selectedRole : undefined,
                    selectedDuration: part === "restrict" ? selectedDuration : undefined,
                })
            }
        }
    }

    // Handle editing reasons for existing user selection
    const handleEditReasons = (userId: string, action: Action) => {
        const user = users.find((u) => u._id === userId)
        if (user && action && !shouldHideActions(user, currentUserId)) {
            // Map action to part name for the dialog
            const actionToPart: Record<string, string> = {
                reset_avatar: "avatar",
                reset_username: "name",
                reset_bio: "bio",
                change_role: "role",
                restrict: "restrict",
                delete: "delete",
            }

            const part = actionToPart[action]
            if (part) {
                // Get existing reasons for this specific action
                const existingAction = selectedActions.get(userId)
                const existingReasons = existingAction?.actionReasons?.get(action) || []

                // Open reason dialog with existing reasons pre-selected
                setReasonDialog({
                    isOpen: true,
                    userId,
                    selectedReasons: existingReasons,
                    customReason: "",
                    showCustom: existingReasons.includes("Other"),
                    part,
                })
            }
        }
    }

    // Handle clearing a specific user's selections
    const handleClearUser = (userId: string) => {
        const newActions = new Map(selectedActions)
        newActions.delete(userId)
        setSelectedActions(newActions)
    }

    // Handle confirming a specific user's actions
    const handleConfirmUser = async (userId: string) => {
        const userAction = selectedActions.get(userId)
        if (userAction && userAction.reasons.length > 0) {
            // Execute actions for just this user
            const singleUserActions = new Map()
            singleUserActions.set(userId, userAction)
            // Call the bulk actions API with just this user
            await executeBulkActions()
            // Clear this user from selections after successful execution
            handleClearUser(userId)
        }
    }

    // Handle confirming reasons in the simple reason dialog
    const handleReasonConfirm = () => {
        // Build final reasons array - if "Other" is selected and custom reason provided,
        // replace "Other" with the custom reason text
        const finalReasons =
            reasonDialog.showCustom && reasonDialog.customReason.trim()
                ? [
                      ...reasonDialog.selectedReasons.filter(
                          (r) => r !== "Other" // Remove "Other" from selected reasons
                      ),
                      reasonDialog.customReason.trim(), // Add custom reason instead
                  ]
                : reasonDialog.selectedReasons

        // Map part names to actions
        const partToAction: Record<string, Action> = {
            avatar: "reset_avatar",
            name: "reset_username",
            bio: "reset_bio",
            role: "change_role",
            restrict: "restrict",
            delete: "delete",
        }

        const action = partToAction[reasonDialog.part || ""]
        if (!action) return

        // Update the selected actions with the confirmed reasons for this specific part
        const newActions = new Map(selectedActions)
        const existingAction = newActions.get(reasonDialog.userId)

        if (existingAction) {
            // Add this action to existing actions
            existingAction.actions.add(action)
            
            // Initialize actionReasons Map if it doesn't exist
            if (!existingAction.actionReasons) {
                existingAction.actionReasons = new Map()
            }
            
            // Set reasons for this specific action
            existingAction.actionReasons.set(action, finalReasons)
            
            newActions.set(reasonDialog.userId, {
                ...existingAction,
                reasons: finalReasons, // Keep for backward compatibility
                role: (reasonDialog.selectedRole as Role) || existingAction.role,
                duration: reasonDialog.selectedDuration || existingAction.duration,
            })
        } else {
            // Create new action for this user with actionReasons Map
            const actionReasons = new Map()
            actionReasons.set(action, finalReasons)
            
            newActions.set(reasonDialog.userId, {
                userId: reasonDialog.userId,
                actions: new Set([action]),
                reasons: finalReasons, // Keep for backward compatibility
                actionReasons,
                role: reasonDialog.selectedRole as Role,
                duration: reasonDialog.selectedDuration,
            })
        }

        setSelectedActions(newActions)
        closeReasonDialog()
    }

    // Handle custom reason change
    const handleCustomReasonChange = (value: string) => {
        setReasonDialog({
            ...reasonDialog,
            customReason: value,
        })
    }

    return (
        <div className='container mx-auto py-8 space-y-6'>
            {/* Display admin statistics at the top */}
            <Stats stats={stats} />

            {/* Main user management card */}
            <Card className='bg-white/10 backdrop-blur-md border-white/20'>
                <CardHeader>
                    <CardTitle className='text-white'>
                        User Management
                    </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    {/* Search input and date range filters */}
                    <SearchFilters
                        search={search}
                        setSearch={setSearch}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        debouncedSearch={debouncedSearch}
                    />

                    {/* List of users with action buttons */}
                    <ul className='space-y-4'>
                        {users.map((user) => {
                            const selectedAction = selectedActions.get(user._id) // Get selected actions for this user

                            return (
                                <UserItem
                                    key={user._id}
                                    user={user}
                                    selectedAction={selectedAction}
                                    onPartClick={handlePartClick}
                                    onEditReasons={handleEditReasons}
                                    onClearUser={handleClearUser}
                                    onConfirmUser={handleConfirmUser}
                                    shouldHideActions={
                                        (user) =>
                                            shouldHideActions(
                                                user,
                                                currentUserId
                                            ) // Hide actions for self and other admins
                                    }
                                    getActionButtonVariant={(userId, action) =>
                                        getActionButtonVariant(
                                            userId,
                                            action,
                                            selectedActions
                                        )
                                    }
                                    getActionButtonClass={(userId, action) =>
                                        getActionButtonClass(
                                            userId,
                                            action,
                                            selectedActions
                                        )
                                    }
                                />
                            )
                        })}
                    </ul>

                    {/* Manual load more button (backup for infinite scroll) */}
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

                    {/* Show current pagination status */}
                    {pagination && (
                        <div className='text-center text-gray-400 text-sm'>
                            Showing {users.length} of {pagination.total} users
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Reason selection dialog */}
            <ReasonDialog
                reasonDialog={reasonDialog}
                onClose={closeReasonDialog}
                onReasonSelect={handleReasonSelect}
                onConfirm={handleReasonConfirm}
                onCustomReasonChange={handleCustomReasonChange}
            />
        </div>
    )
}
