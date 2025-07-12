"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa"
import { useSidebar } from "./ui/sidebar"
import { Logo } from "./logo"
import { useSession } from "next-auth/react"

export default function Footer() {
    // hide footer for the auth page
    const pathname = usePathname()
    const { data: session } = useSession()
    const hide =
        pathname.startsWith("/auth") ||
        (pathname.includes("/admin") &&
            (session?.user.role === "admin" ||
                session?.user.role === "moderator"))
    const { open, isMobile } = useSidebar()
    return (
        <>
            {hide ? null : (
                <footer
                    className={`${
                        isMobile
                            ? "w-full"
                            : open
                              ? "w-[calc(100%-13rem)]"
                              : "w-[calc(100%-47px)]"
                    } absolute bottom-0 z-40`}
                >
                    <div className='bg-transparent backdrop-blur-sm border-t border-t-white/30 text-white'>
                        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-4'>
                            <div className='flex justify-between items-center gap-4'>
                                <div>
                                    <Logo />
                                    <p className='mt-2 text-sm'>
                                        © {new Date().getFullYear()}{" "}
                                        BlueBizHub. All rights reserved.
                                    </p>
                                </div>
                                <div className='flex space-x-6'>
                                    <Link href='#'>
                                        <span className='sr-only'>
                                            Facebook
                                        </span>
                                        <FaFacebook className='h-6 w-6' />
                                    </Link>
                                    <Link href='#'>
                                        <span className='sr-only'>Twitter</span>
                                        <FaTwitter className='h-6 w-6' />
                                    </Link>
                                    <Link href='#'>
                                        <span className='sr-only'>
                                            Instagram
                                        </span>
                                        <FaInstagram className='h-6 w-6' />
                                    </Link>
                                    <Link href='#'>
                                        <span className='sr-only'>
                                            LinkedIn
                                        </span>
                                        <FaLinkedin className='h-6 w-6' />
                                    </Link>
                                </div>
                            </div>
                            {/* <div className='mt-8 border-t border-gray-200 pt-8'>
                    <nav className='-mx-5 -my-2 flex flex-wrap justify-center'>
                        <div className='px-5 py-2'>
                            <Link
                                href='/about'
                                className='text-base text-gray-500 hover:text-gray-900'
                            >
                                About
                            </Link>
                        </div>
                        <div className='px-5 py-2'>
                            <Link
                                href='/contact'
                                className='text-base text-gray-500 hover:text-gray-900'
                            >
                                Contact
                            </Link>
                        </div>
                        <div className='px-5 py-2'>
                            <Link
                                href='/privacy'
                                className='text-base text-gray-500 hover:text-gray-900'
                            >
                                Privacy Policy
                            </Link>
                        </div>
                        <div className='px-5 py-2'>
                            <Link
                                href='/terms'
                                className='text-base text-gray-500 hover:text-gray-900'
                            >
                                Terms of Service
                            </Link>
                        </div>
                    </nav>
                </div> */}
                        </div>
                    </div>
                    {/* BACKROUND CUTTER */}
                    <div className='w-full h-full absolute top-0 left-0 moving-gradient -z-10' />
                </footer>
            )}
        </>
    )
}
