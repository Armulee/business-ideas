import { Button } from "@/components/ui/button"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronUp, Info } from "lucide-react"
import { useState } from "react"
import { GiFairyWand } from "react-icons/gi"

export default function MagicLinkButton({
    handleMagicLinkClick,
    sendingMagicLink,
}: {
    handleMagicLinkClick: () => void
    sendingMagicLink: boolean
}) {
    // handle collapsible information for the magic link
    const [showCollapsible, setShowCollapsible] = useState<boolean>(false)

    return (
        <Collapsible open={showCollapsible} onOpenChange={setShowCollapsible}>
            <div className='w-full flex justify-center items-center gap-2 mx-auto'>
                <Button
                    type='button'
                    onClick={handleMagicLinkClick}
                    disabled={sendingMagicLink}
                    className='mt-3 w-fit inline-flex justify-center py-2 px-6 glassmorphism bg-transparent text-sm font-medium text-white hover:bg-indigo-700 hover:text-white border border-white/30 duration-300'
                >
                    <GiFairyWand className='w-5 h-5 mr-2' />
                    Send Magic Link
                </Button>

                <CollapsibleTrigger>
                    {!showCollapsible ? (
                        <Info className='w-5 h-5 mt-3 cursor-pointer text-white/70' />
                    ) : (
                        <ChevronUp className='w-5 h-5 mt-3 cursor-pointer text-white/70' />
                    )}
                </CollapsibleTrigger>
            </div>
            <CollapsibleContent asChild>
                <p className='mt-4 text-xs glassmorphism px-4 py-2'>
                    You will receive a magic link in your email inbox. Click the
                    link to sign in.
                </p>
            </CollapsibleContent>
        </Collapsible>
    )
}
