import { Button } from "../ui/button"

export default function SubmitCancelButton({
    handleCancel,
}: {
    handleCancel: () => void
}) {
    return (
        <div className='w-full flex justify-center items-center gap-4 mt-4'>
            <Button
                className='button !px-6'
                type='button'
                onClick={handleCancel}
            >
                Cancel
            </Button>
            <Button className='button !bg-blue-600 !px-6' type='submit'>
                Submit
            </Button>
        </div>
    )
}
