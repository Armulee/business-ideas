/**
 * Centralized mappings for admin user management actions
 * 
 * This file contains all action-related mappings to avoid duplication
 * across components and provide a single source of truth for action configuration.
 */

import { Action } from "./types"

/**
 * Maps user interface parts to their corresponding actions
 * Used when user clicks on different parts of the user interface
 */
export const PART_TO_ACTION_MAP: Record<string, Action> = {
    avatar: "reset_avatar",
    name: "reset_username", 
    bio: "reset_bio",
    role: "change_role",
    restrict: "restrict",
    delete: "delete",
} as const

/**
 * Maps actions back to their user interface part names
 * Used for editing existing actions and dialog management
 */
export const ACTION_TO_PART_MAP: Record<string, string> = {
    reset_avatar: "avatar",
    reset_username: "name",
    reset_bio: "bio", 
    change_role: "role",
    restrict: "restrict",
    delete: "delete",
} as const

/**
 * Maps actions to human-readable display names
 * Used throughout the UI for consistent naming
 */
export const ACTION_DISPLAY_NAMES: Record<string, string> = {
    reset_avatar: "Avatar",
    reset_username: "Name", 
    reset_bio: "Bio",
    change_role: "Role",
    restrict: "Restrict",
    delete: "Delete",
} as const

/**
 * Configuration for debounce delays in milliseconds
 */
export const TIMING_CONSTANTS = {
    SEARCH_DEBOUNCE_MS: 500,
    SCROLL_THRESHOLD_PX: 1000,
} as const

/**
 * Helper function to get action from part name
 * @param part - The UI part name (avatar, name, bio, etc.)
 * @returns The corresponding action or null if not found
 */
export function getActionFromPart(part: string): Action {
    return PART_TO_ACTION_MAP[part] || null
}

/**
 * Helper function to get part name from action
 * @param action - The action type
 * @returns The corresponding part name or empty string if not found
 */
export function getPartFromAction(action: Action): string {
    if (!action) return ""
    return ACTION_TO_PART_MAP[action] || ""
}

/**
 * Helper function to get display name for action
 * @param action - The action type
 * @returns The display name or the action itself if not found
 */
export function getActionDisplayName(action: Action): string {
    if (!action) return ""
    return ACTION_DISPLAY_NAMES[action] || action
}