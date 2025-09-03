"use client"

import AdminGuard from "@/components/admin/admin-guard"

export default function AdminRootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AdminGuard>
            <main className='p-4 pt-20 pb-10 bg-gray-900 min-h-screen'>
                {children}
            </main>
        </AdminGuard>
    )
}
