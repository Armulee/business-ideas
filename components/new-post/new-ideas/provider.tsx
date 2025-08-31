"use client"
import { createContext, useContext, useEffect, useState, useRef } from "react"
import { IProfilePopulated } from "@/database/Profile"
import { useSession } from "next-auth/react"
import axios from "axios"
import { Widget } from "@/components/widgets"

export type NewPost = {
    // New widget system
    widget: Widget | null
    setWidget: React.Dispatch<React.SetStateAction<Widget | null>>
    profile: IProfilePopulated | null
    // Change notification callback
    notifyChange: () => void
    // Track initial state for change detection
    getWidgetState: () => {
        widget: Widget | null
    }
}

const WidgetForm = createContext<NewPost | null>(null)
export const useWidgetForm = () => {
    const context = useContext(WidgetForm)
    if (!context) {
        throw new Error('useWidgetForm must be used within a WidgetFormProvider')
    }
    return context
}

interface ProviderProps {
    children: React.ReactNode
    onChangeNotification?: () => void
}

const Provider = ({ children, onChangeNotification }: ProviderProps) => {
    // get required profile data for profile widget
    const { data: session } = useSession()
    const [profile, setProfile] = useState<IProfilePopulated | null>(null)
    const hasProfileFetchedRef = useRef(false)
    
    // New widget system state
    const [widget, setWidget] = useState<Widget | null>(null)

    useEffect(() => {
        if (session?.user.profile && !profile && !hasProfileFetchedRef.current) {
            hasProfileFetchedRef.current = true
            const setupProfile = async () => {
                try {
                    const { data, status } = await axios.get(
                        `/api/profile/full/${session.user.profile}`
                    )
                    if (status === 200) {
                        const { profile } = data
                        setProfile(profile)
                    }
                } catch (error) {
                    console.error('Failed to fetch profile:', error)
                    hasProfileFetchedRef.current = false // Reset on error to allow retry
                }
            }

            setupProfile()
        }
    }, [session?.user.profile, profile])
    return (
        <WidgetForm.Provider
            value={{
                widget,
                setWidget: (newWidget) => {
                    setWidget(newWidget)
                    onChangeNotification?.()
                },
                profile,
                notifyChange: () => onChangeNotification?.(),
                getWidgetState: () => ({
                    widget,
                }),
            }}
        >
            {children}
        </WidgetForm.Provider>
    )
}

export default Provider
