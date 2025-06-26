import Link from "next/link"

export const Logo = ({ className = "" }: { className?: string }) => {
    return (
        <h1 className={`text-xl font-extrabold ${className}`}>
            <Link href='/' className='group'>
                <span className='text-blue-400 group-hover:text-white transitions duration-500'>
                    Blue
                </span>
                <span className='text-white group-hover:text-blue-400 transitions duration-500'>
                    BizHub
                </span>
            </Link>
        </h1>
    )
}

export const ShortLogo = ({ className = "" }: { className?: string }) => {
    return (
        <h1 className={`text-xl font-extrabold ${className}`}>
            <Link href='/' className='group'>
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
