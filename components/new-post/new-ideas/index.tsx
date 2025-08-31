"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import Loading from "../../loading"
import PostTitle from "./post-title"
import PostDescription from "./post-content"
import { zodResolver } from "@hookform/resolvers/zod"
import { formSchema, NewPostSchema, PostData } from "./types"
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { useWidgetForm } from "./provider"
import axios from "axios"
import AnimatedStatus from "./animated-status"
import { toast } from "sonner"
import { useNewPostContext } from "../context"
import {
    AddWidgetButton,
    PreviewEditableRenderer,
    Widget,
} from "@/components/widgets"

export default function NewIdea() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(true)
    const [loadingDraft, setLoadingDraft] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [hasInteracted, setHasInteracted] = useState(false)
    const [savingDraft, setSavingDraft] = useState(false)
    const [_draftId, setDraftId] = useState<string | null>(null)
    const [showSaved, setShowSaved] = useState(false)
    const [cleanFormState, setCleanFormState] = useState<NewPostSchema | null>(
        null
    )
    // Widget change tracking removed - using direct state comparison instead

    const { data: session, status } = useSession()
    const { widget, setWidget } = useWidgetForm()
    const { setNewPostData } = useNewPostContext()

    // Initialize form with react-hook-form and zod validation
    const form = useForm<NewPostSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            categories: [""],
            content: "<p></p>",
            tags: [],
            advancedSettings: {
                privacy: "public",
                allowComments: true,
                hideViewCount: false,
                hideVoteCount: false,
                targetRegion: "worldwide",
                targetCountry: "",
            },
        },
    })

    // Load draft if draft ID is provided in URL
    const loadDraft = useCallback(
        async (draftId: string) => {
            try {
                setLoadingDraft(true)
                const { data } = await axios.get(`/api/post/draft/${draftId}`)
                const draft = data.draft

                // Prepare draft data structure
                const draftFormData = {
                    title: draft.title || "",
                    categories: draft.categories || [""],
                    content: draft.content || "",
                    tags: draft.tags || [],
                    advancedSettings: draft.advancedSettings || {
                        privacy: "public",
                        allowComments: true,
                        hideViewCount: false,
                        hideVoteCount: false,
                        globalPost: true,
                        targetRegion: "worldwide",
                        targetCountry: "",
                    },
                }

                // Populate form with draft data
                form.reset(draftFormData)

                // Set tags and form data
                form.setValue("tags", draft.tags || [])

                // Set widget from draft if exists
                if (draft.widgets && draft.widgets.length > 0) {
                    setWidget(draft.widgets[0]) // Use first widget since we now support single widget
                }

                setDraftId(draftId)

                // Set clean state to the actual draft data (not form.getValues which might not be updated yet)
                setCleanFormState(draftFormData)

                // Set initial widget state from draft
                setInitialWidgetState({
                    widget:
                        draft.widgets && draft.widgets.length > 0
                            ? draft.widgets[0]
                            : null,
                })

                // Don't set hasInteracted to true for loaded drafts
                // Only set it to true when user actually makes changes
                setHasInteracted(false)
                setHasUnsavedChanges(false)
            } catch (error) {
                console.error("Failed to load draft:", error)
                setError("Failed to load draft")
                toast.error("Failed to load draft", {
                    description:
                        "There was an error loading your draft. Please try again or start a new post.",
                    duration: 5000,
                })
            } finally {
                setLoadingDraft(false)
            }
        },
        [form, setWidget]
    )

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin?callbackUrl=/new-post/new-ideas")
        } else if (status === "authenticated") {
            setLoading(false)

            // Check if there's a draft ID in the URL
            const draftId = searchParams.get("draft")
            if (draftId) {
                loadDraft(draftId)
            } else {
                setCleanFormState(form.getValues())
                // Set initial widget state
                setInitialWidgetState({
                    widget: null,
                })
            }
        }
    }, [status, router, searchParams, loadDraft, form])

    // Track initial widget state for change detection
    const [initialWidgetState, setInitialWidgetState] = useState<{
        widget: Widget | null
    } | null>(null)

    const submitPost = useCallback(
        async (values: NewPostSchema, isDraft: boolean = false) => {
            const postData: PostData = {
                author: session?.user.id,
                title: values.title,
                categories: values.categories,
                content: values.content,
                tags: values.tags || [], // New: use form tags
                // tags: tags, // Old: state-based tags (will remove later)
                community: "new-ideas",
                advancedSettings: values.advancedSettings,
                status: isDraft ? "draft" : "published",
            }

            // Add widget to post if exists
            if (widget) {
                postData.widgets = [widget]
            }

            const { data } = await axios.post("/api/post", postData)
            return data
        },
        [session?.user.id, widget]
    )

    const onSubmit = async (values: NewPostSchema) => {
        setSubmitting(true)
        setError(null)

        try {
            const { id, slug } = await submitPost(values, false)
            setHasUnsavedChanges(false)
            setCleanFormState(values)
            router.push(`/post/${id}/${slug}`)
        } catch (err) {
            console.error((err as Error).message)
            setError(
                err instanceof Error ? err.message : "Failed to submit post"
            )
            setSubmitting(false)
        }
    }

    // Watch for actual form value changes with clean state comparison
    useEffect(() => {
        if (!cleanFormState || !initialWidgetState) return

        const subscription = form.watch((currentValues, { name, type }) => {
            // Only mark as changed if there's actual data modification and values differ from clean state
            if (type === "change" && name) {
                console.log(currentValues.content, cleanFormState.content)
                const hasFormChanges =
                    currentValues.title !== cleanFormState.title ||
                    JSON.stringify(currentValues.categories) !==
                        JSON.stringify(cleanFormState.categories) ||
                    currentValues.content !== cleanFormState.content ||
                    JSON.stringify(currentValues.advancedSettings) !==
                        JSON.stringify(cleanFormState.advancedSettings) ||
                    JSON.stringify(currentValues.tags) !==
                        JSON.stringify(cleanFormState.tags || [])

                // Check for widget changes
                const hasWidgetChanges =
                    JSON.stringify(widget) !==
                    JSON.stringify(initialWidgetState.widget)

                const hasActualChanges = hasFormChanges || hasWidgetChanges

                if (hasActualChanges) {
                    setHasInteracted(true)
                    setHasUnsavedChanges(true)
                } else {
                    // If values match clean state, mark as not having unsaved changes
                    setHasUnsavedChanges(false)
                }
            }
        })

        return () => subscription.unsubscribe()
    }, [form, cleanFormState, initialWidgetState, widget])

    // Watch for widget changes separately (since they're not in the form)
    useEffect(() => {
        if (!initialWidgetState || !cleanFormState) return

        const hasWidgetChanges =
            JSON.stringify(widget) !== JSON.stringify(initialWidgetState.widget)

        // Also check for form changes to determine overall state
        const currentFormValues = form.getValues()
        const hasFormChanges =
            currentFormValues.title !== cleanFormState.title ||
            JSON.stringify(currentFormValues.categories) !==
                JSON.stringify(cleanFormState.categories) ||
            currentFormValues.content !== cleanFormState.content ||
            JSON.stringify(currentFormValues.advancedSettings) !==
                JSON.stringify(cleanFormState.advancedSettings) ||
            JSON.stringify(currentFormValues.tags) !==
                JSON.stringify(cleanFormState.tags || [])

        const hasAnyChanges = hasWidgetChanges || hasFormChanges

        if (hasAnyChanges) {
            setHasInteracted(true)
            setHasUnsavedChanges(true)
        } else {
            // If no changes at all, clear unsaved changes
            setHasUnsavedChanges(false)
        }
    }, [widget, initialWidgetState, cleanFormState, form])

    // Update context with current newPostData
    useEffect(() => {
        setNewPostData({
            hasUnsavedChanges,
            hasInteracted,
            savingDraft,
            submitting,
            error,
            form,
            setSavingDraft,
            setHasUnsavedChanges,
            setShowSaved,
            _draftId,
            setDraftId,
            setCleanFormState,
            widget,
        })
    }, [
        hasUnsavedChanges,
        hasInteracted,
        savingDraft,
        submitting,
        error,
        form,
        setSavingDraft,
        setHasUnsavedChanges,
        setShowSaved,
        _draftId,
        setDraftId,
        setCleanFormState,
        widget,
        setNewPostData,
    ])

    // Clear context when component unmounts
    useEffect(() => {
        return () => setNewPostData(null)
    }, [setNewPostData])

    if (loading || submitting || loadingDraft) {
        return <Loading />
    }

    return (
        <>
            <Form {...form}>
                <form
                    id='new-post-form'
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='relative'
                >
                    <div className='flex flex-col md:flex-row gap-4'>
                        {/* Main content - left side on desktop, top on mobile */}
                        <div className='flex-1'>
                            <PostTitle control={form.control} />
                            <PostDescription control={form.control} />

                            {/* Widget Section */}
                            <div className='md:hidden space-y-4'>
                                {!widget ? (
                                    <AddWidgetButton
                                        onWidgetSelect={setWidget}
                                        className='w-full'
                                    />
                                ) : (
                                    <PreviewEditableRenderer
                                        widget={widget}
                                        onChange={setWidget}
                                        onRemove={() => setWidget(null)}
                                        className='mb-4'
                                    />
                                )}
                            </div>
                            {error && (
                                <div className='text-red-500 text-sm mb-4 text-center'>
                                    {error}
                                </div>
                            )}
                            <div className='pb-32'></div>
                        </div>

                        {/* Sidebar - right side on desktop, hidden on mobile */}
                        <div className='hidden md:block w-72'>
                            <div className='sticky top-4'>
                                <div className='h-screen pb-28 overflow-y-scroll space-y-4'>
                                    {!widget ? (
                                        <AddWidgetButton
                                            onWidgetSelect={setWidget}
                                            className='w-full'
                                        />
                                    ) : (
                                        <PreviewEditableRenderer
                                            widget={widget}
                                            onChange={setWidget}
                                            onRemove={() => setWidget(null)}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </Form>

            {/* Animated Status Section */}
            <AnimatedStatus
                hasUnsavedChanges={hasUnsavedChanges}
                hasInteracted={hasInteracted}
                showSaved={showSaved}
            />

        </>
    )
}
