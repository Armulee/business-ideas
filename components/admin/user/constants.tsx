import { Role, ActionItem } from "./types"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Shield, Trash2 } from "lucide-react"

export const ROLES: Role[] = ["user", "moderator", "admin"]

export const RESTRICTION_OPTIONS = [
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

export const FLAGGED_REASONS = [
    "Spam or unwanted content",
    "Harassment or bullying",
    "Hate speech or discrimination",
    "Violence or threats",
    "Inappropriate content",
    "Copyright violation",
    "False information",
    "Other",
]

export const PROMOTION_REASONS = [
    "Outstanding contributions",
    "Excellent moderation",
    "Community leadership", 
    "Consistent quality content",
    "Helpful community member",
    "Trusted member",
    "Administrative skills",
    "Other",
]

// Admin stats configuration for auto mapping
export const ADMIN_STATS_CONFIG = [
    {
        key: "totalUsers",
        label: "Total Users",
        color: "text-white",
    },
    {
        key: "restrictions",
        label: "Restrictions",
        color: "text-yellow-400",
    },
    {
        key: "deletions",
        label: "Deletions",
        color: "text-red-400",
    },
    {
        key: "avatarResets",
        label: "Avatar Resets",
        color: "text-blue-400",
    },
    {
        key: "usernameResets",
        label: "Username Resets",
        color: "text-green-400",
    },
    {
        key: "roleChanges",
        label: "Role Changes",
        color: "text-purple-400",
    },
]

// Action items configuration with JSX elements
export const ACTION_ITEMS: ActionItem[] = [
    {
        action: "reset_avatar",
        label: "Avatar",
        icon: <Avatar className='h-6 w-6' />,
        result: "Reset",
    },
    {
        action: "reset_username",
        label: "Username",
        icon: <span className='font-medium'>@</span>,
        result: "Reset",
    },
    {
        action: "reset_bio",
        label: "Bio",
        icon: <span className='font-medium'>📝</span>,
        result: "Reset",
    },
    {
        action: "change_role",
        label: "Role",
        icon: <Badge className='h-4 w-4' />,
        result: "Promoted",
    },
    {
        action: "restrict",
        label: "Restriction",
        icon: <Shield className='h-4 w-4' />,
        result: "Applied",
    },
    {
        action: "delete",
        label: "Account",
        icon: <Trash2 className='h-4 w-4' />,
        result: "Deleted",
    },
]
