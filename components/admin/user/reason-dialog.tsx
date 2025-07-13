import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ReasonDialogState } from "./types"
import { FLAGGED_REASONS, PROMOTION_REASONS } from "./constants"

interface ReasonDialogProps {
    reasonDialog: ReasonDialogState
    onClose: () => void
    onReasonSelect: (reason: string) => void
    onConfirm: () => void
    onCustomReasonChange: (value: string) => void
}

export function ReasonDialog({
    reasonDialog,
    onClose,
    onReasonSelect,
    onConfirm,
    onCustomReasonChange,
}: ReasonDialogProps) {
    // Determine which reasons to show based on the action type
    const reasons =
        reasonDialog.part === "role" ? PROMOTION_REASONS : FLAGGED_REASONS
    const isPromotion = reasonDialog.part === "role"

    return (
        <Dialog
            open={reasonDialog.isOpen}
            onOpenChange={(open) => !open && onClose()}
        >
            <DialogContent className='bg-gray-900 border-gray-700 max-w-md'>
                <DialogHeader>
                    <DialogTitle className='text-white'>
                        Flag User{" "}
                        {reasonDialog.part
                            ? `- ${reasonDialog.part.charAt(0).toUpperCase() + reasonDialog.part.slice(1)}`
                            : ""}
                    </DialogTitle>
                    <DialogDescription className='text-gray-300'>
                        {isPromotion
                            ? `Select one or more reasons for promoting this user's ${reasonDialog.part || "role"}. `
                            : `Select one or more reasons for flagging this user's ${reasonDialog.part || "content"}. `}
                        These will be included in the action documentation.
                    </DialogDescription>
                </DialogHeader>

                <div className='space-y-3'>
                    {/* Render checkboxes for each predefined reason */}
                    {reasons.map((reason) => (
                        <div
                            key={reason}
                            className='flex items-center space-x-2'
                        >
                            <Checkbox
                                id={reason}
                                checked={reasonDialog.selectedReasons.includes(
                                    reason
                                )}
                                onCheckedChange={() => onReasonSelect(reason)}
                                className='border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600'
                            />
                            <label
                                htmlFor={reason}
                                className='text-white text-sm cursor-pointer'
                            >
                                {reason}
                            </label>
                        </div>
                    ))}

                    {/* Show textarea only when "Other" is selected */}
                    {reasonDialog.showCustom && (
                        <Textarea
                            placeholder='Please specify the other reason...'
                            value={reasonDialog.customReason}
                            onChange={(e) =>
                                onCustomReasonChange(e.target.value)
                            }
                            className='bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 mt-2'
                            rows={3}
                        />
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant='outline'
                        onClick={onClose}
                        className='bg-transparent border-0 mt-2 text-white hover:bg-transparent hover:text-white'
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={onConfirm}
                        disabled={
                            reasonDialog.selectedReasons.length === 0 || // Require at least one reason
                            (reasonDialog.showCustom &&
                                !reasonDialog.customReason.trim()) // Require custom text if "Other" selected
                        }
                        className='bg-blue-600 hover:bg-blue-700'
                    >
                        {isPromotion ? "Confirm Promotion" : "Confirm Reasons"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
