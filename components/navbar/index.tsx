"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import ActionButton from "./action-button"

export default function Navbar() {
    const [menu, setMenu] = useState<boolean>(false)
    const pathname = usePathname()
    const hide = ["/signin"]
    return (
        <>
            {hide.includes(pathname) ? null : (
                <>
                    <nav className='w-full bg-white shadow-sm fixed top-0 z-20'>
                        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                            <div className='flex justify-between h-16'>
                                <div className='flex'>
                                    <Link
                                        href='/'
                                        className='flex-shrink-0 flex items-center'
                                    >
                                        <span className='text-2xl font-bold text-blue-600'>
                                            BusinessIdeas
                                        </span>
                                    </Link>
                                    <div className='hidden sm:ml-6 sm:flex sm:space-x-8'>
                                        <Link
                                            href='/'
                                            className='border-transparent text-gray-500 hover:border-blue-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                                        >
                                            Home
                                        </Link>
                                        <Link
                                            href='/explore'
                                            className='border-transparent text-gray-500 hover:border-blue-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                                        >
                                            Explore
                                        </Link>
                                        <Link
                                            href='/explore'
                                            className='border-transparent text-gray-500 hover:border-blue-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                                        >
                                            Search
                                        </Link>
                                    </div>
                                </div>
                                <ActionButton menu={menu} setMenu={setMenu} />
                            </div>
                        </div>
                    </nav>

                    {/* Mobile Menu (Sliding Dropdown) */}
                    <div
                        className={`block sm:hidden fixed top-0 left-0 w-full h-full bg-white shadow-md transition duration-300 ease-in-out z-10 ${
                            menu
                                ? "translate-y-0 opacity-100"
                                : "-translate-y-full opacity-0"
                        }`}
                    >
                        <div className='h-full flex flex-col gap-4 justify-center items-center py-4 space-y-4'>
                            <Link
                                href='/about'
                                className='text-gray-700 hover:text-blue-500'
                            >
                                About
                            </Link>
                            <Link
                                href='/contact'
                                className='text-gray-700 hover:text-blue-500'
                            >
                                Contact
                            </Link>
                            <Link
                                href='/privacy-policy'
                                className='text-gray-700 hover:text-blue-500'
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href='/terms-of-service'
                                className='text-gray-700 hover:text-blue-500 mb-8'
                            >
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
