"use client"

import { useEffect, useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import UserConfig from "@/components/navbar/user/user-config"
import { usePathname } from "next/navigation"
import { SidebarTrigger, useSidebar } from "../../ui/sidebar"
import { Sheet, SheetTrigger } from "../../ui/sheet"
import Notification from "./notification"
import { NewPostActions } from "./new-post-actions"
import { Logo } from "../../logo"
import { Skeleton } from "../../ui/skeleton"
import MobileSidebar from "@/components/sidebar/user/mobile"
import { useNewPostContext } from "@/components/new-post/context"
import AuthDialog from "@/components/auth/auth-dialog"

export default function UserNavbar() {
    const { newPostData } = useNewPostContext()
    const { isMobile } = useSidebar()

    const { status } = useSession()

    // hide navbar for the auth page
    const pathname = usePathname()
    const hide = pathname.startsWith("/auth")
    const isNewPostRoute = pathname.startsWith("/new-post")

    // Track previous URL
    const [previousPath, setPreviousPath] = useState<string | null>(null)

    useEffect(() => {
        setPreviousPath(pathname)
    }, [pathname])

    // mobile sidebar
    const [open, setOpen] = useState<boolean>(false)
    
    // auth dialog state
    const [authDialogOpen, setAuthDialogOpen] = useState<boolean>(false)

    // navSearch
    // const [navSearchOpen, setNavSearchOpen] = useState<boolean>(false)

    return (
        <>
            {hide ? null : (
                <Sheet open={open} onOpenChange={setOpen}>
                    <header
                        className={`fixed top-0 left-0 right-0 z-50 transition duration-500 bg-transparent backdrop-blur-sm border-y border-y-white/30 px-4 md:px-0`}
                    >
                        <nav className='py-3 px-2'>
                            <div className='w-full flex justify-between items-center'>
                                <div className='flex items-center gap-1'>
                                    {isMobile ? (
                                        <>
                                            <SheetTrigger className='text-white'>
                                                <Menu className='w-6 h-6' />
                                            </SheetTrigger>
                                            <Logo className='lg:hidden md:block hidden !text-lg' />
                                        </>
                                    ) : (
                                        <>
                                            <SidebarTrigger />
                                            <div className='w-32'>
                                                <Logo />
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className='md:w-[65%] w-[calc(100%-10rem)] flex justify-center items-center gap-2'>
                                    {isNewPostRoute && newPostData && (
                                        <NewPostActions {...newPostData} />
                                    )}
                                </div>

                                {status === "authenticated" ? (
                                    <div className='flex items-center gap-4'>
                                        <Notification />
                                        <UserConfig />
                                    </div>
                                ) : status === "unauthenticated" ? (
                                    <Button
                                        size='sm'
                                        onClick={() => setAuthDialogOpen(true)}
                                        className='bg-white text-blue-500 rounded-full px-4 hover:bg-blue-900 hover:text-white transition duration-500'
                                    >
                                        <span className='text-sm'>Log in</span>
                                    </Button>
                                ) : (
                                    <Skeleton className='rounded-full w-[64px] h-[35px] glassmorphism' />
                                )}
                            </div>
                        </nav>
                    </header>

                    <MobileSidebar setOpen={setOpen} />
                </Sheet>
            )}
            
            <AuthDialog
                open={authDialogOpen}
                onOpenChange={setAuthDialogOpen}
                title="Welcome Back"
                description="Sign in to access your account and continue your journey"
                callbackUrl={previousPath || "/"}
            />
        </>
    )
}
