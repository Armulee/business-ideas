"use client"

import { useEffect, useState } from "react"
import { Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSession } from "next-auth/react"
import UserConfig from "@/components/navbar/user-config"
import { usePathname } from "next/navigation"
import { SidebarTrigger, useSidebar } from "../ui/sidebar"
import { Sheet, SheetTrigger } from "../ui/sheet"
import MobileSidebar from "../sidebar/mobile"
// import NavSearch from "./search"
import Notification from "./notification"
import NewPostButton from "./new-post-button"
import { Logo } from "../logo"

export default function Navbar() {
    const { isMobile } = useSidebar()

    const { status } = useSession()

    // hide navbar for the auth page
    const pathname = usePathname()
    const hide = pathname.startsWith("/auth")

    // Track previous URL
    const [previousPath, setPreviousPath] = useState<string | null>(null)

    useEffect(() => {
        setPreviousPath(pathname)
    }, [pathname])

    // mobile sidebar
    const [open, setOpen] = useState<boolean>(false)

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
                                    <Link
                                        href='/post?search'
                                        className='w-full'
                                    >
                                        <Button className='w-full flex justify-start items-center gap-2 button'>
                                            <Search />
                                            Search
                                        </Button>
                                    </Link>
                                    <NewPostButton />
                                </div>

                                {status === "authenticated" ? (
                                    <div className='flex items-center gap-4'>
                                        <Notification />
                                        <UserConfig />
                                    </div>
                                ) : status === "unauthenticated" ? (
                                    <Button
                                        size='sm'
                                        className='bg-white text-blue-500 rounded-full px-4 hover:bg-blue-900 hover:text-white transition duration-500'
                                    >
                                        <Link
                                            className='text-sm'
                                            href={`/auth/signin?callbackUrl=${previousPath}`}
                                        >
                                            Log in
                                        </Link>
                                    </Button>
                                ) : null}
                            </div>
                        </nav>
                    </header>

                    <MobileSidebar setOpen={setOpen} />
                </Sheet>
            )}
        </>
    )
}
