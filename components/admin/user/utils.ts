import { User, UserAction, Action } from "./types"

export function isCurrentUser(user: User, currentUserId?: string): boolean {
    return user._id === currentUserId
}

export function isAdminUser(user: User): boolean {
    return user.role === "admin"
}

export function shouldHideActions(user: User, currentUserId?: string): boolean {
    return isCurrentUser(user, currentUserId) || isAdminUser(user)
}

export function getActionButtonVariant(
    userId: string,
    action: Action,
    selectedActions: Map<string, UserAction>
): "default" | "outline" {
    const selectedAction = selectedActions.get(userId)
    return selectedAction?.actions.has(action) ? "default" : "outline"
}

export function getActionButtonClass(
    userId: string,
    action: Action,
    selectedActions: Map<string, UserAction>
): string {
    const selectedAction = selectedActions.get(userId)
    const isSelected = selectedAction?.actions.has(action) || false

    if (action === "restrict") {
        return isSelected
            ? "bg-yellow-800 hover:bg-yellow-900 border-0 text-white"
            : "bg-yellow-600 hover:bg-yellow-700 border-0 text-white hover:text-white"
    }
    if (action === "delete") {
        return isSelected
            ? "bg-red-800 hover:bg-red-900 text-white"
            : "bg-red-600 hover:bg-red-700 text-white"
    }
    return isSelected ? "bg-gray-800 text-white" : ""
}
