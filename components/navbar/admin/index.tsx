"use client"

import { useState } from "react"
import { Menu, Bell, User, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut, useSession } from "next-auth/react"
import { SidebarTrigger, useSidebar } from "../../ui/sidebar"
import { Sheet, SheetTrigger } from "../../ui/sheet"
import AdminMobileSidebar from "../../sidebar/admin/mobile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export default function AdminHeader() {
    const { isMobile } = useSidebar()
    const { data: session } = useSession()
    const [open, setOpen] = useState<boolean>(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition duration-500 glassmorphism bg-gray-900/50 !rounded-none backdrop-blur-sm border-y border-y-white/30 px-4 md:px-0`}
            >
                <nav className='py-3 px-2'>
                    <div className='w-full flex justify-between items-center'>
                        <div className='flex items-center gap-1'>
                            {isMobile ? (
                                <SheetTrigger className='text-white'>
                                    <Menu className='w-6 h-6' />
                                </SheetTrigger>
                            ) : (
                                <SidebarTrigger />
                            )}
                            <div className='min-w-fit ml-2 mr-6'>
                                <div className='flex items-center space-x-2'>
                                    <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center'>
                                        <Shield className='h-7 w-7 text-white' />
                                    </div>
                                    <div>
                                        <h2 className='text-lg font-semibold text-white'>
                                            Admin Panel
                                        </h2>
                                        <p className='text-xs text-gray-400'>
                                            <span className='text-blue-500'>
                                                Blue
                                            </span>
                                            BizHub
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='flex items-center'>
                            {/* Notifications */}
                            <Button
                                variant='ghost'
                                size='icon'
                                className='text-white hover:text-white hover:bg-transparent relative'
                            >
                                <Bell className='h-5 w-5' />
                            </Button>

                            {/* User Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant='ghost'
                                        className='flex items-center space-x-2 text-white hover:text-white hover:bg-transparent'
                                    >
                                        <Avatar className='h-8 w-8'>
                                            <AvatarImage
                                                src={session?.user?.image || ""}
                                            />
                                            <AvatarFallback className='bg-blue-600'>
                                                <User className='h-4 w-4 text-white' />
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className='hidden md:block'>
                                            {session?.user?.name}
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align='end'
                                    className='bg-gray-800/95 backdrop-blur-sm border-gray-700 text-white'
                                >
                                    <DropdownMenuLabel>
                                        Admin Account
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className='bg-gray-700' />
                                    <DropdownMenuItem className='hover:bg-gray-700 text-white'>
                                        Settings
                                    </DropdownMenuItem>
                                    <Link href={"/"}>
                                        <DropdownMenuItem className='hover:bg-gray-700 text-white'>
                                            Back to app
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuSeparator className='bg-gray-700' />
                                    <DropdownMenuItem
                                        onClick={() => signOut()}
                                        className='hover:bg-gray-700 text-red-400'
                                    >
                                        Sign Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </nav>
            </header>

            <AdminMobileSidebar setOpen={setOpen} />
        </Sheet>
    )
}
