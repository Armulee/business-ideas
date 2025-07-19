"use client"

import { createContext, useContext, useState } from "react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../ui/alert-dialog"

type AlertOptions = {
    title: string
    description: string | React.ReactNode
    action?: string
    cancel?: string
    onAction?: () => void
}

type AlertContextType = {
    show: (options: AlertOptions) => void
    hide: () => void
}

const AlertContext = createContext<AlertContextType | null>(null)

export const useAlert = () => {
    const ctx = useContext(AlertContext)
    if (!ctx) throw new Error("useAlert must be used inside AlertProvider")
    return ctx
}

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
    const [visible, setVisible] = useState(false)
    const [options, setOptions] = useState<AlertOptions | null>(null)

    const show = (opts: AlertOptions) => {
        setOptions(opts)
        setVisible(true)
    }

    const hide = () => {
        setVisible(false)
    }

    return (
        <AlertContext.Provider value={{ show, hide }}>
            {children}
            {options && (
                <AlertDialog open={visible} onOpenChange={setVisible}>
                    <AlertDialogContent className='glassmorphism bg-black/20 text-white'>
                        <AlertDialogHeader>
                            <AlertDialogTitle className='text-white'>
                                {options.title}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                {options.description}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            {options.cancel && (
                                <AlertDialogCancel className='text-white hover:text-white bg-transparent hover:bg-transparent border-0'>
                                    {options.cancel}
                                </AlertDialogCancel>
                            )}
                            {options.action && (
                                <AlertDialogAction
                                    className='button !bg-blue-600/70 !px-12 hover:!bg-white hover:text-blue-600'
                                    onClick={() => {
                                        hide()
                                        options.onAction?.()
                                    }}
                                >
                                    {options.action}
                                </AlertDialogAction>
                            )}
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </AlertContext.Provider>
    )
}
