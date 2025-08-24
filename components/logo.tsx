import Link from "next/link"
import Image from "next/image"
import logo from "@/public/assets/bbh-logo.png"

export const Logo = ({ className = "" }: { className?: string }) => {
    return (
        <h1 className={`text-xl font-extrabold ${className}`}>
            <Link href='/' className='group flex items-center gap-1'>
                <Image width={20} height={20} src={logo} alt='BlueBizHub' />
                <p>
                    <span className='text-blue-400 group-hover:text-white transitions duration-500'>
                        Blue
                    </span>
                    <span className='text-white group-hover:text-blue-400 transitions duration-500'>
                        BizHub
                    </span>
                </p>
            </Link>
        </h1>
    )
}

export const ShortLogo = ({ className = "" }: { className?: string }) => {
    return (
        <h1 className={`text-xl font-extrabold ${className}`}>
            <Link href='/' className='group'>
                <Image width={20} height={20} src={logo} alt='BlueBizHub' />
                <span className='text-blue-400 group-hover:text-white transitions duration-500'>
                    B
                </span>
                <span className='text-white group-hover:text-blue-400 transitions duration-500'>
                    BH
                </span>
            </Link>
        </h1>
    )
}
