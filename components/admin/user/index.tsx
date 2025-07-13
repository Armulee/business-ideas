"use client"

import { useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import Stats from "./stats"
import { SearchFilters } from "./search"
import { PaginationHandler } from "./pagination-handler"
import { ReasonDialog } from "./reason-dialog"
import { useAdminUsers } from "./hooks/use-admin-user"
import { useDialogs } from "./hooks/use-dialog"
import {
    shouldHideActions,
    getActionButtonVariant,
    getActionButtonClass,
} from "./utils"
import { Action, Role } from "./types"
import { getActionFromPart, getPartFromAction } from "./mappings"
import { updateUserAction } from "./action-utils"
import { UserItem } from "./user-item"

export default function UserManagement() {
    // Get current user session for permission checks
    const { data: session } = useSession()

    // Extract user management state and functions from custom hook
    const {
        users, // Array of users to display
        pagination, // Pagination info (hasNext, total, etc.)
        loading, // Loading state for API calls
        search, // Current search input value
        setSearch, // Function to update search input
        debouncedSearch, // Debounced search value (configurable delay)
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

    /**
     * Handles "Load More" button click for pagination
     * Loads the next page of users and appends to existing list
     */
    const handleLoadMore = useCallback(() => {
        if (pagination?.hasNext && !loading) {
            const nextPage = currentPage + 1
            setCurrentPage(nextPage)
            fetchUsers(nextPage, true) // true = append to existing users
        }
    }, [pagination?.hasNext, loading, currentPage, fetchUsers, setCurrentPage])

    /**
     * Handles opening the reason dialog when a user clicks on a specific user part
     * @param userId - The ID of the user being acted upon
     * @param part - The part of the user interface that was clicked (avatar, name, bio, etc.)
     * @param selectedRole - Optional role when changing user role
     * @param selectedDuration - Optional duration when restricting user
     */
    const handlePartClick = (
        userId: string,
        part: string,
        selectedRole?: string,
        selectedDuration?: string
    ) => {
        const user = users.find((u) => u._id === userId)
        if (user && !shouldHideActions(user, currentUserId)) {
            const action = getActionFromPart(part)
            if (action) {
                // Get existing reasons for this specific action if they exist
                const existingAction = selectedActions.get(userId)
                const existingReasons =
                    existingAction?.actionReasons?.get(action) || []

                // Open simple reason dialog for this specific part
                setReasonDialog({
                    isOpen: true,
                    userId,
                    selectedReasons: existingReasons,
                    customReason: "",
                    showCustom: existingReasons.includes("Other"),
                    part, // Add part info to track which part was clicked
                    selectedRole: part === "role" ? selectedRole : undefined,
                    selectedDuration:
                        part === "restrict" ? selectedDuration : undefined,
                })
            }
        }
    }

    /**
     * Handles editing reasons for an existing user action selection
     * @param userId - The ID of the user being acted upon
     * @param action - The action type being edited
     */
    const handleEditReasons = (userId: string, action: Action) => {
        const user = users.find((u) => u._id === userId)
        if (user && action && !shouldHideActions(user, currentUserId)) {
            const part = getPartFromAction(action)
            if (part) {
                // Get existing reasons for this specific action
                const existingAction = selectedActions.get(userId)
                const existingReasons =
                    existingAction?.actionReasons?.get(action) || []

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

    /**
     * Handles clearing all selected actions for a specific user
     * @param userId - The ID of the user whose selections should be cleared
     */
    const handleClearUser = (userId: string) => {
        const newActions = new Map(selectedActions)
        newActions.delete(userId)
        setSelectedActions(newActions)
    }

    /**
     * Handles confirming and executing actions for a specific user
     * @param userId - The ID of the user whose actions should be executed
     */
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

    /**
     * Handles confirming reasons in the simple reason dialog
     * Processes the selected reasons and updates the user actions state
     */
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

        const action = getActionFromPart(reasonDialog.part || "")
        if (!action) return

        // Update the selected actions with the confirmed reasons for this specific part
        const newActions = updateUserAction(
            selectedActions,
            reasonDialog.userId,
            action,
            finalReasons,
            reasonDialog.selectedRole as Role,
            reasonDialog.selectedDuration
        )

        setSelectedActions(newActions)
        closeReasonDialog()
    }

    /**
     * Handles changes to the custom reason input field
     * @param value - The new custom reason text
     */
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
            <Card className='glassmorphism bg-transparent'>
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

                    {/* Pagination and load more functionality */}
                    <PaginationHandler
                        pagination={pagination}
                        loading={loading}
                        usersCount={users.length}
                        onLoadMore={handleLoadMore}
                    />
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
