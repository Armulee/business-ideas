"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import AutoHeightTextarea from "@/components/ui/auto-height-textarea"
import { FaLinkedin, FaMeta, FaXTwitter } from "react-icons/fa6"
import { Flame } from "lucide-react"

interface EditDialogProps {
    open: boolean
    platform: string
    type: string
    value: string
    loading: boolean
    onOpenChange: (open: boolean) => void
    onValueChange: (value: string) => void
    onSave: () => void
}

const platformConfig = {
    main: {
        name: "Main Platform",
        icon: Flame,
        color: "text-blue-500",
    },
    linkedin: {
        name: "LinkedIn",
        icon: FaLinkedin,
        color: "text-blue-500",
    },
    x: { name: "X (Twitter)", icon: FaXTwitter, color: "text-white" },
    meta: { name: "Meta (Facebook)", icon: FaMeta, color: "text-blue-500" },
}

export default function EditDialog({
    open,
    platform,
    type,
    value,
    loading,
    onOpenChange,
    onValueChange,
    onSave,
}: EditDialogProps) {
    const handleClose = () => onOpenChange(false)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='bg-gray-900 border-gray-700 text-white max-w-2xl'>
                <DialogHeader>
                    <DialogTitle>
                        Edit{" "}
                        {type === "systemPrompt"
                            ? "System"
                            : "User"}{" "}
                        Prompt
                        {platform && (
                            <span className='text-sm font-normal text-gray-400 block'>
                                for{" "}
                                {
                                    platformConfig[
                                        platform as keyof typeof platformConfig
                                    ]?.name
                                }
                            </span>
                        )}
                    </DialogTitle>
                </DialogHeader>
                <div className='space-y-4'>
                    <AutoHeightTextarea
                        value={value}
                        onChange={(e) => onValueChange(e.target.value)}
                        placeholder={`Enter ${type === "systemPrompt" ? "system" : "user"} prompt for ${platform}...`}
                        className='min-h-[200px] bg-gray-800 border-gray-600 text-white'
                    />
                </div>
                <DialogFooter>
                    <Button
                        variant='outline'
                        onClick={handleClose}
                        className='border-gray-600 button text-white hover:bg-gray-800 md:mt-0 mt-2'
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onSave}
                        disabled={loading}
                        className='bg-blue-600 hover:bg-blue-700'
                    >
                        {loading ? "Saving..." : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}