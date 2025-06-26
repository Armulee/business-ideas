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
    selectedProvider,
    showDialog,
    setShowDialog,
}: {
    form: UseFormReturn<FormValues>
    selectedProvider: string | null
    showDialog: boolean
    setShowDialog: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/"

    const continueWithProvider = () => {
        setShowDialog(false)
        if (selectedProvider) {
            signIn(selectedProvider.toLowerCase(), { callbackUrl })
        }
    }
    return (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTitle className='sr-only'>
                Continue with {selectedProvider}
            </DialogTitle>
            <DialogContent className='rounded-lg text-black'>
                <DialogHeader className='w-full text-left'>
                    <h2 className='text-lg font-semibold text-black'>
                        Your email already registered via {selectedProvider}
                    </h2>
                </DialogHeader>
                <p className='text-sm text-gray-600'>
                    Email <strong>{form.getValues("email")}</strong> was
                    originally registered using{" "}
                    <strong>{selectedProvider}</strong>.
                    <br />
                    <br />
                    Please continue with <strong>{selectedProvider}</strong> to
                    sign in.
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
                        Continue with {selectedProvider}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ProviderDialog
