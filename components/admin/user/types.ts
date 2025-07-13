export interface User {
    _id: string
    profileId: number
    name: string
    email: string
    avatar?: string
    bio?: string
    role: string
    createdAt: string
    updatedAt: string
}

export interface Pagination {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
}

export type Action =
    | "restrict"
    | "delete"
    | "reset_avatar"
    | "reset_username"
    | "reset_bio"
    | "change_role"
    | null

export type Role = "user" | "moderator" | "admin"

export interface UserAction {
    userId: string
    actions: Set<Action>
    duration?: string
    role?: Role
    reasons: string[] // Keep for backward compatibility
    actionReasons?: Map<Action, string[]> // Individual reasons per action
}

export interface ActionItem {
    action: Action
    label: string
    icon: React.ReactNode
    result: string
}

export interface Stats {
    totalUsers: number
    restrictions: number
    deletions: number
    avatarResets: number
    usernameResets: number
    roleChanges: number
}

export interface ReasonDialogState {
    isOpen: boolean
    userId: string
    selectedReasons: string[]
    customReason: string
    showCustom: boolean
    part?: string
    selectedRole?: string
    selectedDuration?: string
}

export interface MultiActionDialogState {
    isOpen: boolean
    userId: string
    userName: string
    selectedActions: Set<Action>
    // Change to individual reasons per action
    actionReasons: Map<Action, string[]>
    actionCustomReasons: Map<Action, string>
    actionShowCustom: Map<Action, boolean>
    duration?: string
    role?: Role
}
