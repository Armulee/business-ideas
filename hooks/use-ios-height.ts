import { useEffect, useState } from 'react'

export function useIOSHeight() {
    const [height, setHeight] = useState('100vh')

    useEffect(() => {
        const updateHeight = () => {
            // Use dynamic viewport height for better iOS support
            const vh = window.innerHeight * 0.01
            document.documentElement.style.setProperty('--vh', `${vh}px`)
            
            // Set height using CSS custom property
            setHeight('calc(var(--vh, 1vh) * 100)')
        }

        updateHeight()
        window.addEventListener('resize', updateHeight)
        window.addEventListener('orientationchange', updateHeight)

        return () => {
            window.removeEventListener('resize', updateHeight)
            window.removeEventListener('orientationchange', updateHeight)
        }
    }, [])

    return height
}

export function useDynamicViewportHeight() {
    const [dynamicHeight, setDynamicHeight] = useState('100vh')

    useEffect(() => {
        const updateHeight = () => {
            // Use dynamic viewport height (dvh) when supported, fallback to custom vh
            if (CSS.supports('height', '100dvh')) {
                setDynamicHeight('100dvh')
            } else {
                const vh = window.innerHeight * 0.01
                document.documentElement.style.setProperty('--vh', `${vh}px`)
                setDynamicHeight('calc(var(--vh, 1vh) * 100)')
            }
        }

        updateHeight()
        window.addEventListener('resize', updateHeight)
        window.addEventListener('orientationchange', updateHeight)

        return () => {
            window.removeEventListener('resize', updateHeight)
            window.removeEventListener('orientationchange', updateHeight)
        }
    }, [])

    return dynamicHeight
}