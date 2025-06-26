import { User } from "lucide-react"
import React from "react"

const WidgetTab = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='flex items-center gap-2 mb-3 bg-white/20 absolute top-0 left-0 w-full px-4 py-2'>
            <User className='w-4 h-4' />
            <span className='text-sm font-bold'>{children}</span>
        </div>
    )
}

export default WidgetTab
