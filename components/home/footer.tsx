import Link from "next/link"
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa"

export default function Footer() {
    return (
        <footer className='bg-white'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-4'>
                <div className='flex justify-between items-center'>
                    <div>
                        <span className='text-lg font-semibold text-gray-600'>
                            BusinessIdeas
                        </span>
                        <p className='mt-2 text-sm text-gray-500'>
                            © {new Date().getFullYear()} BusinessIdeas. All
                            rights reserved.
                        </p>
                    </div>
                    <div className='flex space-x-6'>
                        <Link
                            href='#'
                            className='text-gray-400 hover:text-gray-500'
                        >
                            <span className='sr-only'>Facebook</span>
                            <FaFacebook className='h-6 w-6' />
                        </Link>
                        <Link
                            href='#'
                            className='text-gray-400 hover:text-gray-500'
                        >
                            <span className='sr-only'>Twitter</span>
                            <FaTwitter className='h-6 w-6' />
                        </Link>
                        <Link
                            href='#'
                            className='text-gray-400 hover:text-gray-500'
                        >
                            <span className='sr-only'>Instagram</span>
                            <FaInstagram className='h-6 w-6' />
                        </Link>
                        <Link
                            href='#'
                            className='text-gray-400 hover:text-gray-500'
                        >
                            <span className='sr-only'>LinkedIn</span>
                            <FaLinkedin className='h-6 w-6' />
                        </Link>
                    </div>
                </div>
                <div className='mt-8 border-t border-gray-200 pt-8'>
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
                </div>
            </div>
        </footer>
    )
}
