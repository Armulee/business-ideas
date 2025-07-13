/**
 * Utility functions for managing user action state
 * 
 * Consolidates repetitive Map/Set manipulation logic used across components
 */

import { UserAction, Action, Role } from "./types"

/**
 * Creates or updates a user action in the selectedActions Map
 * @param selectedActions - Current Map of user actions
 * @param userId - ID of the user
 * @param action - Action to add/update
 * @param finalReasons - Array of reasons for this action
 * @param selectedRole - Optional role for role changes
 * @param selectedDuration - Optional duration for restrictions
 * @returns Updated Map of user actions
 */
export function updateUserAction(
    selectedActions: Map<string, UserAction>,
    userId: string,
    action: Action,
    finalReasons: string[],
    selectedRole?: Role,
    selectedDuration?: string
): Map<string, UserAction> {
    const newActions = new Map(selectedActions)
    const existingAction = newActions.get(userId)

    if (existingAction) {
        // Add this action to existing actions
        existingAction.actions.add(action)
        
        // Initialize actionReasons Map if it doesn't exist
        if (!existingAction.actionReasons) {
            existingAction.actionReasons = new Map()
        }
        
        // Set reasons for this specific action
        existingAction.actionReasons.set(action, finalReasons)
        
        newActions.set(userId, {
            ...existingAction,
            reasons: finalReasons, // Keep for backward compatibility
            role: (selectedRole as Role) || existingAction.role,
            duration: selectedDuration || existingAction.duration,
        })
    } else {
        // Create new action for this user with actionReasons Map
        const actionReasons = new Map()
        actionReasons.set(action, finalReasons)
        
        newActions.set(userId, {
            userId,
            actions: new Set([action]),
            reasons: finalReasons, // Keep for backward compatibility
            actionReasons,
            role: selectedRole as Role,
            duration: selectedDuration,
        })
    }

    return newActions
}

/**
 * Toggles an action for a user (used in the old action selection logic)
 * @param selectedActions - Current Map of user actions
 * @param userId - ID of the user
 * @param action - Action to toggle
 * @param duration - Optional duration for restrictions
 * @param role - Optional role for role changes
 * @returns Updated Map of user actions
 */
export function toggleUserAction(
    selectedActions: Map<string, UserAction>,
    userId: string,
    action: Action,
    duration?: string,
    role?: Role
): Map<string, UserAction> {
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
                duration: action === "restrict" ? duration : existingAction.duration,
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

    return newActions
}