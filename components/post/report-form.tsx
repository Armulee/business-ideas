"use client"

import { useForm } from "react-hook-form"
import { useSession } from "next-auth/react"
import { useAlert } from "../provider/alert"
import { usePathname, useRouter } from "next/navigation"
import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import axios from "axios"
import * as z from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
    reason: z.string({ message: "The reason is required." }),
    details: z.string().optional(),
})

export default function ReportForm({
    targetId,
    targetType,
    setOpen,
}: {
    targetId: string | undefined
    targetType: "Post" | "Comment" | "Reply"
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const { data: session } = useSession()
    const alert = useAlert()
    const router = useRouter()
    const pathname = usePathname()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { reason: "", details: "" },
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (!session?.user) {
            alert.show({
                title: "Please log in",
                description: "You need to sign in before reporting.",
                action: "Log in",
                cancel: "Cancel",
                onAction: () =>
                    router.push(`/auth/signin?callbackUrl=${pathname}`),
            })
            return
        }

        try {
            await axios.post("/api/report", {
                reporter: session.user.id,
                target: targetId,
                targetType,
                reason: data.reason,
                details: data.details || undefined,
            })

            alert.show({
                title: "Report submitted",
                description: "Thank you, we’ll review this shortly.",
                action: "Got it",
                onAction: () => setOpen(false),
            })
            setOpen(false)
        } catch (err) {
            console.error(err)
            alert.show({
                title: "Error",
                description: "Could not submit report.",
                action: "Got it",
                onAction: () => setOpen(false),
            })
        }
    }

    return (
        <DialogContent className='glassmorphism bg-blue-500/30'>
            <DialogHeader>
                <DialogTitle>
                    Report this {targetType.toLowerCase()}
                </DialogTitle>
                <DialogDescription className='text-white/70'>
                    Let us know why you’re reporting so we can review it.
                </DialogDescription>
            </DialogHeader>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-4'
                >
                    <div className='grid gap-2'>
                        <FormField
                            name='reason'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-white/70'>
                                        Reason
                                    </FormLabel>
                                    <Select
                                        required
                                        onValueChange={field.onChange}
                                    >
                                        <FormControl>
                                            <SelectTrigger className='select'>
                                                <SelectValue placeholder='Choose a reason' />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value='spam'>
                                                Spam
                                            </SelectItem>
                                            <SelectItem value='harassment'>
                                                Harassment
                                            </SelectItem>
                                            <SelectItem value='hate_speech'>
                                                Hate speech
                                            </SelectItem>
                                            <SelectItem value='self_harm'>
                                                Self-harm
                                            </SelectItem>
                                            <SelectItem value='other'>
                                                Other
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className='grid gap-2'>
                        <FormField
                            name='details'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-white/70'>
                                        Details (optional)
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className='input'
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder='Any additional context...'
                                            rows={4}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <DialogFooter className='flex justify-end gap-2'>
                        <Button
                            type='button'
                            className='button hover:text-white'
                            variant='outline'
                            onClick={() => setOpen(false)}
                            disabled={form.formState.isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            className='button !bg-blue-500/50 hover:text-white'
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting
                                ? "Submitting…"
                                : "Submit Report"}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    )
}
