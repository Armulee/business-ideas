import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { RichTextEditor } from "@/components/rich-text-editor"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Schema } from "mongoose"
import SubmitCancelButton from "../../submit-cancel-button"

interface EditorProps {
    replyId: Schema.Types.ObjectId
    defaultValue: string
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Editor({
    replyId,
    defaultValue,
    setIsEditing,
}: EditorProps) {
    // handle edit reply
    const formSchema = z.object({
        reply: z.string(),
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            reply: "",
        },
    })
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!values.reply.trim()) return // Prevent empty comment update

        try {
            const response = await axios.patch("/api/reply", {
                id: replyId,
                content: values.reply.trim(),
            })

            if (response.status === 200) {
                setIsEditing(false) // Exit edit mode
                location.reload()
            } else {
                console.error("Failed to update comment")
            }
        } catch (error) {
            console.error("Error updating comment:", error)
        }
    }

    // handle cancel editing reply
    const handleCancel = () => setIsEditing(false)
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='relative glassmorphism bg-white/10 p-4 mb-6'
            >
                <FormField
                    control={form.control}
                    name='reply'
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <RichTextEditor
                                    autoFocus
                                    defaultValue={defaultValue}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <SubmitCancelButton handleCancel={handleCancel} />
            </form>
        </Form>
    )
}
