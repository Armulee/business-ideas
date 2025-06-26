// Update the WidgetBase component
export default function WidgetBase({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div
            className={`glassmorphism px-6 pb-6 pt-12 relative overflow-hidden h-full`}
        >
            <div className='h-[calc(100%-2.5rem)]'>{children}</div>
        </div>
    )
}
