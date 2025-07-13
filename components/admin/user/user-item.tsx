import { format } from "date-fns"
import { Check, Shield, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { User, UserAction, Action } from "./types"
import { ROLES, RESTRICTION_OPTIONS } from "./constants"
import { FlaggedParts } from "./flagged-parts"

interface UserItemProps {
    user: User
    selectedAction?: UserAction
    onPartClick: (
        userId: string,
        part: string,
        selectedRole?: string,
        selectedDuration?: string
    ) => void
    onEditReasons: (userId: string, action: Action) => void
    onClearUser: (userId: string) => void
    onConfirmUser: (userId: string) => void
    shouldHideActions: (user: User) => boolean
    getActionButtonVariant: (
        userId: string,
        action: Action
    ) => "default" | "outline"
    getActionButtonClass: (userId: string, action: Action) => string
}

export function UserItem({
    user,
    selectedAction,
    onPartClick,
    onEditReasons,
    onClearUser,
    onConfirmUser,
    shouldHideActions,
    getActionButtonVariant,
    getActionButtonClass,
}: UserItemProps) {
    // Check if user has any selected actions
    const isSelected = !!selectedAction
    // Check if reasons have been provided for the selected actions
    const hasReasons =
        selectedAction?.reasons && selectedAction.reasons.length > 0

    // Get which actions are selected to show individual flagged parts
    const selectedActionTypes = selectedAction
        ? Array.from(selectedAction.actions)
        : []

    // Convert action types to readable names for individual flagging
    const actionNames = {
        reset_avatar: "Avatar",
        reset_username: "Name",
        reset_bio: "Bio",
        change_role: "Role",
        restrict: "Restrict",
        delete: "Delete",
    }

    // Check if other actions are selected (disable delete when other actions are active)
    const hasOtherActions =
        selectedAction?.actions &&
        Array.from(selectedAction.actions).some(
            (action) => action !== "delete" && action !== null
        )

    return (
        <li
            className={cn(
                "flex flex-col gap-4 p-4 rounded-lg border transition-colors",
                // Change background based on selection state
                isSelected
                    ? "bg-gray-700/50 border-gray-600" // Darker when selected
                    : "bg-white/5 border-white/10 hover:bg-white/10" // Light with hover
            )}
        >
            {/* Main content row - responsive layout */}
            <div className='flex md:flex-row flex-col md:items-center md:justify-between gap-4'>
                {/* User info section - left side */}
                <div className='flex items-start gap-4'>
                    {/* Avatar with click to reset functionality */}
                    <div className='relative mt-0.5'>
                        <Avatar
                            className={cn(
                                "cursor-pointer hover:opacity-80 transition-opacity",
                                // Show blue ring when avatar reset is selected
                                selectedAction?.actions.has("reset_avatar") &&
                                    "ring-2 ring-blue-400"
                            )}
                            onClick={() =>
                                // Only allow action if user actions are not hidden
                                !shouldHideActions(user) &&
                                onPartClick(user._id, "avatar")
                            }
                            title='Click to flag avatar'
                        >
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className='bg-blue-600 text-white'>
                                {user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        {/* Show check mark when avatar reset is selected */}
                        {selectedAction?.actions.has("reset_avatar") && (
                            <div className='absolute -top-1 -right-1 bg-blue-500 rounded-full p-1'>
                                <Check className='h-3 w-3 text-white' />
                            </div>
                        )}
                    </div>

                    {/* User details section */}
                    <div>
                        <div className='flex items-center gap-2'>
                            {/* Username with click to reset functionality */}
                            <h3
                                className={cn(
                                    "min-w-fit font-medium cursor-pointer transition-colors",
                                    // Change text color based on selection state
                                    isSelected
                                        ? "text-gray-300"
                                        : "text-white hover:text-blue-400",
                                    // Show blue ring when username reset is selected
                                    selectedAction?.actions.has(
                                        "reset_username"
                                    ) && "ring-1 ring-blue-400 px-1 rounded"
                                )}
                                onClick={() =>
                                    // Only allow action if user actions are not hidden
                                    !shouldHideActions(user) &&
                                    onPartClick(user._id, "name")
                                }
                                title='Click to flag username'
                            >
                                {user.name}
                                {/* Show check mark when username reset is selected */}
                                {selectedAction?.actions.has(
                                    "reset_username"
                                ) && (
                                    <Check className='inline h-3 w-3 ml-1 text-blue-400' />
                                )}
                            </h3>
                            {/* Role dropdown for changing user role */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Badge
                                        className={cn(
                                            "cursor-pointer hover:bg-black/20 hover:text-white transition-colors",
                                            // Show purple ring when role change is selected
                                            selectedAction?.actions.has(
                                                "change_role"
                                            ) && "ring-2 ring-purple-400",
                                            // Different styling for admin role
                                            user.role === "admin"
                                                ? "variant-default"
                                                : "variant-secondary"
                                        )}
                                    >
                                        {/* Show selected role or current role */}
                                        {selectedAction?.actions.has(
                                            "change_role"
                                        ) ? (
                                            <>
                                                <Check className='h-3 w-3 mr-1' />
                                                {selectedAction.role}
                                            </>
                                        ) : (
                                            user.role
                                        )}
                                    </Badge>
                                </DropdownMenuTrigger>
                                {/* Only show dropdown options if actions are not hidden */}
                                {!shouldHideActions(user) && (
                                    <DropdownMenuContent className='bg-gray-800 border-gray-600'>
                                        {ROLES.map((option) => (
                                            <DropdownMenuItem
                                                key={option}
                                                onClick={() =>
                                                    onPartClick(
                                                        user._id,
                                                        "role",
                                                        option
                                                    )
                                                }
                                                className='text-white hover:!text-white hover:bg-gray-700 focus:bg-gray-700'
                                            >
                                                {option}
                                                {/* Show check mark for currently selected role */}
                                                {selectedAction?.actions.has(
                                                    "change_role"
                                                ) &&
                                                    selectedAction.role ===
                                                        option && (
                                                        <Check className='h-3 w-3 ml-2' />
                                                    )}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                )}
                            </DropdownMenu>
                        </div>
                        {/* User email */}
                        <p className='text-gray-400 text-sm'>{user.email}</p>
                        {/* User bio - clickable to flag */}

                        <p
                            className={cn(
                                "text-gray-400 text-xs cursor-pointer hover:text-blue-400 transition-colors max-w-xs truncate",
                                selectedAction?.actions.has("reset_bio") &&
                                    "ring-1 ring-blue-400 px-1 rounded bg-blue-600/10"
                            )}
                            onClick={() =>
                                !shouldHideActions(user) &&
                                onPartClick(user._id, "bio")
                            }
                            title='Click to flag bio'
                        >
                            Bio: {user.bio ?? "null"}
                            {selectedAction?.actions.has("reset_bio") && (
                                <Check className='inline h-3 w-3 ml-1 text-blue-400' />
                            )}
                        </p>

                        {/* User join date */}
                        <p className='text-gray-500 text-xs'>
                            Joined{" "}
                            {format(new Date(user.createdAt), "MMM dd, yyyy")}
                        </p>
                    </div>
                </div>

                {/* Action buttons section - right side on md+, new line on smaller screens */}
                <div className='flex md:justify-end justify-center items-center space-x-2 md:w-auto w-full'>
                    {/* Only show action buttons if actions are not hidden */}
                    {!shouldHideActions(user) && (
                        <>
                            {/* Restrict button with duration dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant={getActionButtonVariant(
                                            user._id,
                                            "restrict"
                                        )}
                                        size='sm'
                                        className={getActionButtonClass(
                                            user._id,
                                            "restrict"
                                        )}
                                    >
                                        {/* Show check mark and duration if restrict is selected */}
                                        {selectedAction?.actions.has(
                                            "restrict"
                                        ) ? (
                                            <>
                                                <Check className='h-4 w-4 mr-1' />
                                                {selectedAction.duration} Day
                                                {selectedAction.duration !== "1"
                                                    ? "s"
                                                    : ""}
                                            </>
                                        ) : (
                                            <>
                                                <Shield className='h-4 w-4 mr-1' />
                                                Restrict
                                            </>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                {/* Dropdown with restriction duration options */}
                                <DropdownMenuContent className='bg-gray-800 border-gray-600'>
                                    {RESTRICTION_OPTIONS.map((option) => (
                                        <DropdownMenuItem
                                            key={option.value}
                                            onClick={() =>
                                                onPartClick(
                                                    user._id,
                                                    "restrict",
                                                    undefined,
                                                    option.value
                                                )
                                            }
                                            className='text-white hover:!text-white hover:bg-gray-700 focus:bg-gray-700'
                                        >
                                            {option.label}
                                            {/* Show check mark for currently selected duration */}
                                            {selectedAction?.actions.has(
                                                "restrict"
                                            ) &&
                                                selectedAction.duration ===
                                                    option.value && (
                                                    <Check className='h-3 w-3 ml-2' />
                                                )}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Delete button */}
                            <Button
                                variant={getActionButtonVariant(
                                    user._id,
                                    "delete"
                                )}
                                size='sm'
                                disabled={hasOtherActions}
                                onClick={() => onPartClick(user._id, "delete")}
                                className={cn(
                                    getActionButtonClass(user._id, "delete"),
                                    "border-0 hover:text-white", // Remove border for delete button
                                    hasOtherActions &&
                                        "opacity-50 cursor-not-allowed"
                                )}
                            >
                                {/* Show check mark if delete is selected */}
                                {selectedAction?.actions.has("delete") ? (
                                    <Check className='h-4 w-4 mr-1' />
                                ) : (
                                    <Trash2 className='h-4 w-4 mr-1' />
                                )}
                                Delete
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Individual flagged parts - always on new line, shows each flagged part separately */}
            {hasReasons && selectedActionTypes.length > 0 && selectedAction && (
                <FlaggedParts
                    userId={user._id}
                    selectedAction={selectedAction}
                    selectedActionTypes={selectedActionTypes}
                    actionNames={actionNames}
                    onEditReasons={onEditReasons}
                    onClearUser={onClearUser}
                    onConfirmUser={onConfirmUser}
                />
            )}
        </li>
    )
}
