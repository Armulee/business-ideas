'use client'

const AnimatedBackground = () => {
    return (
        <div className='absolute inset-0 z-0 overflow-hidden'>
            <div className='absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob'></div>
            <div className='absolute top-60 right-20 w-80 h-80 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000'></div>
            <div className='absolute bottom-40 left-1/3 w-72 h-72 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000'></div>
            <div className='absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-6000'></div>
        </div>
    )
}

export default AnimatedBackground