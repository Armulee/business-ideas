import Link from "next/link"

export default function NotFound() {
    return (
        <div className='flex h-screen flex-col items-center justify-center px-4'>
            <h1 className='text-8xl font-extrabold text-white drop-shadow-lg'>
                404
            </h1>
            <h4 className='text-3xl font-bold text-white mt-3'>Not Found</h4>
            <p className='mt-4 text-center text-2xl text-white/90'>
                Oops! We can’t seem to find the page you’re looking for.
            </p>
            <p className='mt-4 text-white/80 max-w-md text-center'>
                It might have been removed, renamed, or did not exist in the
                first place.
            </p>
            <Link
                href='/post'
                className='mt-6 inline-block rounded-full bg-white px-6 py-3 text-lg font-semibold text-blue-600 shadow hover:bg-blue-50 transition'
            >
                Explore ideas
            </Link>
        </div>
    )
}
