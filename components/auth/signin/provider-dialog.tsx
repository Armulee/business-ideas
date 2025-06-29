import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogFooter,
    DialogHeader,
} from "../../ui/dialog"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { UseFormReturn } from "react-hook-form"
import { FormValues } from "./types"
import { useSearchParams } from "next/navigation"

const ProviderDialog = ({
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

    const continueWithProvider = () => {
        setShowDialog(false)
        if (authentication.provider) {
            signIn(authentication.provider.toLowerCase(), { callbackUrl })
        }
    }
    return (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTitle className='sr-only'>
                Continue with {authentication.provider}
            </DialogTitle>
            <DialogContent className='rounded-lg text-black'>
                <DialogHeader className='w-full text-left'>
                    <h2 className='text-lg font-semibold text-black'>
                        Your email already registered via{" "}
                        {authentication.provider}
                    </h2>
                </DialogHeader>
                <p className='text-sm text-gray-600'>
                    Email <strong>{form.getValues("email")}</strong> was
                    originally registered using{" "}
                    <strong>{authentication.provider}</strong>.
                    <br />
                    <br />
                    Please continue with{" "}
                    <strong>{authentication.provider}</strong> to sign in.
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
                        onClick={continueWithProvider}
                    >
                        Continue with {authentication.provider}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ProviderDialog
