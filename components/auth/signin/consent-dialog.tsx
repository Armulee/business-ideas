import Link from "next/link"
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogFooter,
    DialogHeader,
} from "../../ui/dialog"
import { Button } from "@/components/ui/button"
import { UseFormReturn } from "react-hook-form"
import { FormValues } from "./types"
import { useSearchParams } from "next/navigation"
import { useLoading } from "@/components/loading-provider"
import { signIn } from "next-auth/react"

const ConsentDialog = ({
    form,
    authentication,
    showDialog,
    setShowDialog,
}: {
    form: UseFormReturn<FormValues>
    authentication: { provider: string; email?: string }
    showDialog: boolean
    setShowDialog: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/"
    const { setIsLoading } = useLoading()

    const confirmConsentAndSignIn = async () => {
        setShowDialog(false)
        form.setValue("consent", true)
        if (authentication.provider) {
            setIsLoading(true)
            await signIn(authentication.provider, { callbackUrl })
        }
    }
    return (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTitle className='sr-only'>
                Accept Terms & Privacy Policy
            </DialogTitle>
            <DialogContent className='rounded-lg text-black'>
                <DialogHeader>
                    <h2 className='text-lg font-semibold text-black'>
                        Accept Terms & Privacy Policy
                    </h2>
                </DialogHeader>
                <p className='text-sm text-gray-600'>
                    You have read and agreed to our{" "}
                    <Link href='/terms' className='text-blue-600 underline'>
                        User agreement
                    </Link>{" "}
                    and{" "}
                    <Link href='/privacy' className='text-blue-600 underline'>
                        Privacy Policy
                    </Link>{" "}
                </p>
                <DialogFooter className='flex-row justify-center items-center gap-4'>
                    <Button
                        onClick={() => setShowDialog(false)}
                        variant='secondary'
                    >
                        Cancel
                    </Button>
                    <Button
                        className='bg-blue-500'
                        onClick={confirmConsentAndSignIn}
                    >
                        Accept & Continue
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ConsentDialog
