import { Action } from "./types"

// Non-null action type for mapping
type NonNullAction = Exclude<Action, null>

// Mapping of actions to their results
export const ACTION_RESULTS: Record<NonNullAction, string> = {
    reset_avatar: "Reset",
    reset_username: "Reset", 
    reset_bio: "Reset",
    change_role: "Promoted",
    restrict: "Restricted",
    delete: "Deleted"
}

// Mapping of reasons to results based on the flagged part
export const REASON_RESULT_MAPPING: Record<NonNullAction, Record<string, string>> = {
    reset_avatar: {
        "Spam or unwanted content": "Avatar Reset",
        "Harassment or bullying": "Avatar Reset", 
        "Hate speech or discrimination": "Avatar Reset",
        "Violence or threats": "Avatar Reset",
        "Inappropriate content": "Avatar Reset",
        "Copyright violation": "Avatar Reset",
        "False information": "Avatar Reset",
        "Other": "Avatar Reset"
    },
    reset_username: {
        "Spam or unwanted content": "Username Reset",
        "Harassment or bullying": "Username Reset",
        "Hate speech or discrimination": "Username Reset", 
        "Violence or threats": "Username Reset",
        "Inappropriate content": "Username Reset",
        "Copyright violation": "Username Reset",
        "False information": "Username Reset",
        "Other": "Username Reset"
    },
    reset_bio: {
        "Spam or unwanted content": "Bio Reset",
        "Harassment or bullying": "Bio Reset",
        "Hate speech or discrimination": "Bio Reset",
        "Violence or threats": "Bio Reset", 
        "Inappropriate content": "Bio Reset",
        "Copyright violation": "Bio Reset",
        "False information": "Bio Reset",
        "Other": "Bio Reset"
    },
    change_role: {
        "Outstanding contributions": "Role Promoted",
        "Excellent moderation": "Role Promoted", 
        "Community leadership": "Role Promoted",
        "Consistent quality content": "Role Promoted",
        "Helpful community member": "Role Promoted",
        "Trusted member": "Role Promoted",
        "Administrative skills": "Role Promoted",
        "Other": "Role Promoted"
    },
    restrict: {
        "Spam or unwanted content": "Account Restricted",
        "Harassment or bullying": "Account Restricted",
        "Hate speech or discrimination": "Account Restricted",
        "Violence or threats": "Account Restricted", 
        "Inappropriate content": "Account Restricted",
        "Copyright violation": "Account Restricted",
        "False information": "Account Restricted",
        "Other": "Account Restricted"
    },
    delete: {
        "Spam or unwanted content": "Account Deleted",
        "Harassment or bullying": "Account Deleted",
        "Hate speech or discrimination": "Account Deleted",
        "Violence or threats": "Account Deleted",
        "Inappropriate content": "Account Deleted", 
        "Copyright violation": "Account Deleted",
        "False information": "Account Deleted",
        "Other": "Account Deleted"
    }
}

// Severity levels for reasons (higher number = more severe)
export const REASON_SEVERITY: Record<string, number> = {
    // Violation reasons (higher severity)
    "Violence or threats": 10,
    "Hate speech or discrimination": 9,
    "Harassment or bullying": 8,
    "Inappropriate content": 7,
    "Copyright violation": 6,
    "False information": 5,
    "Spam or unwanted content": 4,
    
    // Promotion reasons (lower severity, positive context)
    "Administrative skills": 8,
    "Excellent moderation": 7,
    "Community leadership": 6,
    "Outstanding contributions": 5,
    "Trusted member": 4,
    "Consistent quality content": 3,
    "Helpful community member": 2,
    
    // Generic "Other" (lowest priority)
    "Other": 1
}

// Helper function to get result for a specific reason and action
export function getResultForReason(action: Action, reason: string): string {
    if (!action) return ""
    return REASON_RESULT_MAPPING[action]?.[reason] || ACTION_RESULTS[action] || "Action Applied"
}

// Helper function to get the most severe result from multiple reasons
export function getMostSevereResult(action: Action, reasons: string[]): string {
    if (!action || !reasons.length) return ""
    
    // Find the reason with the highest severity
    const mostSevereReason = reasons.reduce((prev, current) => {
        const prevSeverity = REASON_SEVERITY[prev] || 0
        const currentSeverity = REASON_SEVERITY[current] || 0
        return currentSeverity > prevSeverity ? current : prev
    })
    
    return getResultForReason(action, mostSevereReason)
}