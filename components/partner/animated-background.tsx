// Animated Background Elements
export default function AnimatedBackgroundElement() {
    return (
        <div className='fixed inset-0 overflow-hidden pointer-events-none'>
            <div className='absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse'></div>
            <div className='absolute top-1/2 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000'></div>
            <div className='absolute -bottom-40 right-1/3 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-2000'></div>
        </div>
    )
}