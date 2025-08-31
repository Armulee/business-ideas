"use client"

import React, { createContext, useContext, useState } from "react"
import { useForm } from "react-hook-form"
import { NewPostSchema } from "./new-ideas/types"
import { Widget } from "../widgets"

interface NewPostContextType {
    newPostData: {
        hasUnsavedChanges: boolean
        hasInteracted: boolean
        savingDraft: boolean
        submitting: boolean
        error: string | null
        form: ReturnType<typeof useForm<NewPostSchema>>
        setSavingDraft: (value: boolean) => void
        setHasUnsavedChanges: (value: boolean) => void
        setShowSaved: (value: boolean) => void
        _draftId: string | null
        setDraftId: (value: string | null) => void
        setCleanFormState: (value: NewPostSchema) => void
        widget: Widget | null
    } | null
    setNewPostData: (data: NewPostContextType['newPostData']) => void
}

const NewPostContext = createContext<NewPostContextType>({
    newPostData: null,
    setNewPostData: () => {},
})

export function NewPostProvider({ children }: { children: React.ReactNode }) {
    const [newPostData, setNewPostData] = useState<NewPostContextType['newPostData']>(null)

    return (
        <NewPostContext.Provider value={{ newPostData, setNewPostData }}>
            {children}
        </NewPostContext.Provider>
    )
}

export const useNewPostContext = () => useContext(NewPostContext)