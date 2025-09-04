"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface AuthDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description: string
    actionText?: string
    cancelText?: string
    onAction?: () => void
    onCancel?: () => void
    closable?: boolean
}

export default function AuthDialog({
    open,
    onOpenChange,
    title,
    description,
    actionText = "Log in",
    cancelText = "Cancel",
    onAction,
    onCancel,
    closable = true,
}: AuthDialogProps) {
    const router = useRouter()

    const handleAction = () => {
        if (onAction) {
            onAction()
        } else {
            // Default action: redirect to signin with callback URL
            const currentUrl = window.location.href
            router.push(`/auth/signin?callbackUrl=${encodeURIComponent(currentUrl)}`)
        }
    }

    const handleCancel = () => {
        if (onCancel) {
            onCancel()
        } else {
            onOpenChange(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={closable ? onOpenChange : undefined}>
            <DialogContent 
                className="sm:max-w-md"
                onPointerDownOutside={closable ? undefined : (e) => e.preventDefault()}
                onEscapeKeyDown={closable ? undefined : (e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription className="text-left">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="mt-3 sm:mt-0"
                    >
                        {cancelText}
                    </Button>
                    <Button onClick={handleAction}>
                        {actionText}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}