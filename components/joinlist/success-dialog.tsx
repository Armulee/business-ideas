"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle } from "lucide-react"

interface JoinlistSuccessDialogProps {
    open: boolean
    onSave: (marketing: boolean) => void
}

export default function JoinlistSuccessDialog({
    open,
    onSave,
}: JoinlistSuccessDialogProps) {
    const [marketing, setMarketing] = useState(false)

    const handleSave = () => {
        onSave(marketing)
    }

    return (
        <Dialog open={open} onOpenChange={() => {}}>
            <DialogContent 
                className="sm:max-w-md"
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                    <DialogTitle className="text-2xl">Welcome to Joinlist!</DialogTitle>
                    <DialogDescription className="text-left space-y-3">
                        <p>
                            Thank you for joining our exclusive business community! 
                            You&apos;ve successfully been added to our joinlist and will be 
                            among the first to know when this exciting feature becomes available.
                        </p>
                        <p>
                            We&apos;re working hard to bring you innovative tools and opportunities 
                            to grow your business. Stay tuned for updates!
                        </p>
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="marketing" 
                            checked={marketing}
                            onCheckedChange={(checked) => setMarketing(checked as boolean)}
                        />
                        <label 
                            htmlFor="marketing" 
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Email me when this feature is officially available and for follow-up on this campaign
                        </label>
                    </div>
                    
                    <Button 
                        onClick={handleSave}
                        className="w-full"
                    >
                        Proceed
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}