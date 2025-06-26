import React from "react"
export default function Layout({ children }: { children: React.ReactNode }) {
    return <div className='w-[90%] mx-auto mt-12 mb-10'>{children}</div>
}
