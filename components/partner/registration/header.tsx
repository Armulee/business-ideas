import { Sparkles } from "lucide-react"

export default function RegistrationHeader() {
    return (
        <div className='text-center mb-12'>
            <div className='mb-6 flex justify-center'>
                <div className='relative'>
                    <div className='absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-lg opacity-75 animate-pulse'></div>
                    <div className='relative rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 p-4'>
                        <Sparkles className='h-12 w-12 text-white' />
                    </div>
                </div>
            </div>
            <h1 className='text-4xl font-bold text-white mb-4 sm:text-5xl bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent'>
                Partner Registration
            </h1>
            <p className='text-xl text-blue-100 max-w-2xl mx-auto'>
                Join our partner program and start monetizing your
                website traffic today
            </p>
        </div>
    )
}