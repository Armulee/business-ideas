import { Edit2, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserAction, Action } from "./types"
import { getMostSevereResult } from "./reason-result-mapping"

interface FlaggedPartsProps {
    userId: string
    selectedAction: UserAction
    selectedActionTypes: Action[]
    actionNames: Record<string, string>
    onEditReasons: (userId: string, action: Action) => void
    onClearUser: (userId: string) => void
    onConfirmUser: (userId: string) => void
}

/**
 * FlaggedParts component displays the flagged sections for a user
 *
 * Shows individual flagged parts with their reasons and results,
 * providing edit functionality and action buttons.
 *
 * @param props - Component props including user data and action handlers
 */
export function FlaggedParts({
    userId,
    selectedAction,
    selectedActionTypes,
    actionNames,
    onEditReasons,
    onClearUser,
    onConfirmUser,
}: FlaggedPartsProps) {
    const hasReasons =
        selectedAction?.reasons && selectedAction.reasons.length > 0

    return (
        <div className='space-y-3'>
            {/* Clear All button at the top */}
            <div className='flex justify-end'>
                <button
                    onClick={() => onClearUser(userId)}
                    className='text-xs text-gray-400 hover:text-white underline'
                >
                    Clear All
                </button>
            </div>

            {/* Flagged sections */}
            <div className='space-y-2'>
                {selectedActionTypes.map((action) => {
                    const actionName =
                        actionNames[action as keyof typeof actionNames] ||
                        action

                    // Get reasons specific to this action
                    const actionSpecificReasons =
                        selectedAction.actionReasons?.get(action) || []

                    return (
                        <div
                            key={action}
                            className='p-3 bg-gray-800/50 rounded text-xs border border-gray-700'
                        >
                            {/* Header showing which specific part is flagged */}
                            <div className='text-gray-300 font-medium mb-2 flex items-center justify-between'>
                                <span>
                                    Flagged:{" "}
                                    <span className='text-red-400'>
                                        {actionName}
                                    </span>
                                    {action === "restrict" &&
                                        selectedAction?.duration && (
                                            <span className='text-gray-400 ml-2'>
                                                ({selectedAction.duration} day
                                                {selectedAction.duration !== "1"
                                                    ? "s"
                                                    : ""}
                                                )
                                            </span>
                                        )}
                                    {action === "change_role" &&
                                        selectedAction?.role && (
                                            <span className='text-gray-400 ml-2'>
                                                (to {selectedAction.role})
                                            </span>
                                        )}
                                </span>
                                {/* Edit button for this specific flagged part */}
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() =>
                                        onEditReasons(userId, action)
                                    }
                                    className='bg-transparent hover:bg-transparent border-0 text-white h-6 px-2 text-xs'
                                >
                                    <Edit2 className='h-3 w-3 mr-1' />
                                </Button>
                            </div>

                            {/* Reasons for this specific flagged part */}
                            <div className='text-gray-300 font-medium mb-1'>
                                Reasons:
                            </div>
                            <div className='mb-2'>
                                {/* Display all reasons with arrow and result on same line */}
                                <div className='flex flex-wrap items-center gap-1'>
                                    {actionSpecificReasons.map(
                                        (reason, idx) => (
                                            <span
                                                key={`reason-${idx}`}
                                                className='bg-red-600/20 text-red-300 px-2 py-1 rounded border border-red-600/30 text-xs'
                                            >
                                                {reason}
                                            </span>
                                        )
                                    )}
                                    {/* Arrow and result on same line as flags */}
                                    <span className='text-gray-300 text-xs font-medium'>
                                        →
                                    </span>
                                    <span className='bg-blue-600/20 text-blue-300 px-2 py-1 rounded border border-blue-600/30 text-xs font-medium'>
                                        {getMostSevereResult(
                                            action,
                                            actionSpecificReasons
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Confirm button at the bottom */}
            <div className='flex justify-center pt-2'>
                <Button
                    variant='outline'
                    size='sm'
                    onClick={() => onConfirmUser(userId)}
                    disabled={!hasReasons}
                    className='px-6 glassmorphism bg-blue-600/50 hover:bg-blue-700 border-0 text-white hover:text-white disabled:opacity-50'
                >
                    Operational Confirmation <Rocket />
                </Button>
            </div>
        </div>
    )
}
