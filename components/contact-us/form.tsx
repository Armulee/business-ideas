"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import axios from "axios"

const MINIMUM_CHARACTERS = 25
const MAXIMUM_CHARACTERS = 500

const contactSchema = z.object({
    firstName: z
        .string()
        .min(1, "First name is required")
        .max(50, "First name must be less than 50 characters"),
    lastName: z
        .string()
        .min(1, "Last name is required")
        .max(50, "Last name must be less than 50 characters"),
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
    topic: z.string().min(1, "Please select a topic"),
    message: z
        .string()
        .min(
            MINIMUM_CHARACTERS,
            `Message must be at least ${MINIMUM_CHARACTERS} characters`
        )
        .max(
            MAXIMUM_CHARACTERS,
            `Message must be less than ${MAXIMUM_CHARACTERS} characters`
        ),
})

type ContactFormData = z.infer<typeof contactSchema>

const topics = [
    "General Inquiry",
    "Technical Support",
    "Partnership Opportunities",
    "Business Ideas Feedback",
    "Account Issues",
    "Feature Requests",
    "Bug Reports",
    "Other",
]

export default function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        // mode: "onChange",
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            topic: "",
            message: "",
        },
    })

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true)

        try {
            await axios.post("/api/contact", data)
            toast.success("Thank you! Your message has been sent successfully.")
            form.reset()
        } catch (error) {
            console.error("Error submitting contact form:", error)
            toast.error("Failed to send message. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <div className='grid grid-cols-2 gap-4'>
                    <FormField
                        control={form.control}
                        name='firstName'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-white'>
                                    First Name{" "}
                                    <span className='text-red-400'>*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        className='input'
                                        placeholder='John'
                                        disabled={isSubmitting}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='lastName'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-white'>
                                    Last Name{" "}
                                    <span className='text-red-400'>*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        className='input'
                                        placeholder='Doe'
                                        disabled={isSubmitting}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-white'>
                                Email Address{" "}
                                <span className='text-red-400'>*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type='email'
                                    className='input'
                                    placeholder='john@example.com'
                                    disabled={isSubmitting}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='topic'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-white'>
                                Topic <span className='text-red-400'>*</span>
                            </FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                disabled={isSubmitting}
                            >
                                <FormControl>
                                    <SelectTrigger className='select'>
                                        <SelectValue placeholder='Select a topic' />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {topics.map((topic) => (
                                        <SelectItem key={topic} value={topic}>
                                            {topic}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='message'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-white'>
                                Message <span className='text-red-400'>*</span>
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    className='input min-h-32'
                                    placeholder='Tell us how we can help you...'
                                    disabled={isSubmitting}
                                    {...field}
                                />
                            </FormControl>
                            <div
                                className={`w-fit ml-auto text-xs rounded px-2 py-1 mt-2 ${
                                    (field.value?.length || 0) <
                                        MINIMUM_CHARACTERS ||
                                    (field.value?.length || 0) >
                                        MAXIMUM_CHARACTERS
                                        ? "bg-red-500/80 text-white"
                                        : "bg-black/30 text-white/60"
                                }`}
                            >
                                {field.value?.length || 0}/{MAXIMUM_CHARACTERS}{" "}
                                {(field.value?.length || 0) < MINIMUM_CHARACTERS
                                    ? `(min ${MINIMUM_CHARACTERS})`
                                    : ""}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type='submit'
                    className='cta-button w-full'
                    disabled={isSubmitting || !form.formState.isValid}
                >
                    {isSubmitting ? "Sending..." : "Send Message"}
                    <Send className='h-4 w-4 ml-2' />
                </Button>
            </form>
        </Form>
    )
}
