"use client"

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react"

interface MagicLinkContextType {
    isMagicLinkMode: boolean
    sendingMagicLink: boolean
    sentMagicLink: boolean
    resendCooldown: number
    magicLinkEmail: string
    toggleMagicLinkMode: () => void
    setSendingMagicLink: Dispatch<SetStateAction<boolean>>
    setSentMagicLink: Dispatch<SetStateAction<boolean>>
    setResendCooldown: Dispatch<SetStateAction<number>>
    setMagicLinkEmail: Dispatch<SetStateAction<string>>
}

const MagicLinkContext = createContext<MagicLinkContextType | undefined>(undefined)

export function MagicLinkProvider({ children }: { children: ReactNode }) {
    const [isMagicLinkMode, setIsMagicLinkMode] = useState(false)
    const [sendingMagicLink, setSendingMagicLink] = useState(false)
    const [sentMagicLink, setSentMagicLink] = useState(false)
    const [resendCooldown, setResendCooldown] = useState(0)
    const [magicLinkEmail, setMagicLinkEmail] = useState("")

    const toggleMagicLinkMode = () => {
        setIsMagicLinkMode(!isMagicLinkMode)
    }

    return (
        <MagicLinkContext.Provider
            value={{
                isMagicLinkMode,
                sendingMagicLink,
                sentMagicLink,
                resendCooldown,
                magicLinkEmail,
                toggleMagicLinkMode,
                setSendingMagicLink,
                setSentMagicLink,
                setResendCooldown,
                setMagicLinkEmail,
            }}
        >
            {children}
        </MagicLinkContext.Provider>
    )
}

export function useMagicLink() {
    const context = useContext(MagicLinkContext)
    if (context === undefined) {
        throw new Error("useMagicLink must be used within a MagicLinkProvider")
    }
    return context
}