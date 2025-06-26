import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Schema } from "mongoose"
import React from "react"
import AutoHeightTextarea from "@/components/ui/auto-height-textarea"
import SubmitCancelButton from "../../submit-cancel-button"

interface EditorProps {
    commentId: Schema.Types.ObjectId
    defaultValue: string
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Editor({
    commentId,
    defaultValue,
    setIsEditing,
}: EditorProps) {
    // Handle editing Comment
    const formSchema = z.object({
        comment: z.string(),
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            comment: "",
        },
    })
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!values.comment.trim()) return

        try {
            const response = await axios.patch("/api/comment", {
                id: commentId,
                content: values.comment.trim(),
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

    // handle cancel editing comment
    const handleCancel = () => setIsEditing(false)
    return (
        <Form {...form}>
            {/* EDITOR */}
            <form onSubmit={form.handleSubmit(onSubmit)} className={`relative`}>
                <FormField
                    control={form.control}
                    name='comment'
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <AutoHeightTextarea
                                    {...field}
                                    defaultValue={defaultValue}
                                    placeholder='Write a comment...'
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
