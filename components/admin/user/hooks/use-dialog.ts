import { useState } from "react"
import {
    ReasonDialogState,
    MultiActionDialogState,
    UserAction,
    Action,
} from "../types"

export function useDialogs() {
    const [reasonDialog, setReasonDialog] = useState<ReasonDialogState>({
        isOpen: false,
        userId: "",
        selectedReasons: [],
        customReason: "",
        showCustom: false,
        part: "",
    })

    const [multiActionDialog, setMultiActionDialog] =
        useState<MultiActionDialogState>({
            isOpen: false,
            userId: "",
            userName: "",
            selectedActions: new Set(),
            actionReasons: new Map(),
            actionCustomReasons: new Map(),
            actionShowCustom: new Map(),
        })

    const openMultiActionDialog = (
        userId: string,
        userName: string,
        userAction: UserAction
    ) => {
        // Initialize Maps for individual action reasons
        const actionReasons = new Map<Action, string[]>()
        const actionCustomReasons = new Map<Action, string>()
        const actionShowCustom = new Map<Action, boolean>()
        
        // Initialize with existing reasons or empty arrays for each selected action
        userAction.actions.forEach(action => {
            // For now, use the shared reasons for all actions (backward compatibility)
            // TODO: Update UserAction interface to support individual action reasons
            actionReasons.set(action, userAction.reasons || [])
            actionCustomReasons.set(action, "")
            actionShowCustom.set(action, (userAction.reasons || []).includes("Other"))
        })
        
        setMultiActionDialog({
            isOpen: true,
            userId,
            userName,
            selectedActions: new Set(userAction.actions),
            actionReasons,
            actionCustomReasons,
            actionShowCustom,
            duration: userAction.duration,
            role: userAction.role,
        })
    }

    const closeReasonDialog = () => {
        setReasonDialog({
            isOpen: false,
            userId: "",
            selectedReasons: [],
            customReason: "",
            showCustom: false,
            part: "",
        })
    }

    const closeMultiActionDialog = () => {
        setMultiActionDialog({
            isOpen: false,
            userId: "",
            userName: "",
            selectedActions: new Set(),
            actionReasons: new Map(),
            actionCustomReasons: new Map(),
            actionShowCustom: new Map(),
        })
    }

    const handleReasonSelect = (reason: string) => {
        const newReasons = reasonDialog.selectedReasons.includes(reason)
            ? reasonDialog.selectedReasons.filter((r) => r !== reason)
            : [...reasonDialog.selectedReasons, reason]

        setReasonDialog({
            ...reasonDialog,
            selectedReasons: newReasons,
            showCustom: newReasons.includes("Other"),
        })
    }

    // Handle reason selection for specific action
    const handleMultiActionReasonSelect = (action: Action, reason: string) => {
        const currentReasons = multiActionDialog.actionReasons.get(action) || []
        const newReasons = currentReasons.includes(reason)
            ? currentReasons.filter((r) => r !== reason)
            : [...currentReasons, reason]

        const newActionReasons = new Map(multiActionDialog.actionReasons)
        const newActionShowCustom = new Map(multiActionDialog.actionShowCustom)
        
        newActionReasons.set(action, newReasons)
        newActionShowCustom.set(action, newReasons.includes("Other"))

        setMultiActionDialog({
            ...multiActionDialog,
            actionReasons: newActionReasons,
            actionShowCustom: newActionShowCustom,
        })
    }
    
    // Handle custom reason change for specific action
    const handleCustomReasonChange = (action: Action, customReason: string) => {
        const newActionCustomReasons = new Map(multiActionDialog.actionCustomReasons)
        newActionCustomReasons.set(action, customReason)
        
        setMultiActionDialog({
            ...multiActionDialog,
            actionCustomReasons: newActionCustomReasons,
        })
    }

    return {
        reasonDialog,
        setReasonDialog,
        multiActionDialog,
        setMultiActionDialog,
        openMultiActionDialog,
        closeReasonDialog,
        closeMultiActionDialog,
        handleReasonSelect,
        handleMultiActionReasonSelect,
        handleCustomReasonChange,
    }
}
