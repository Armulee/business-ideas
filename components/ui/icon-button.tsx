import { Button } from "./button"

const IconButton = ({
    children,
    handleClick,
    className,
    type = "button",
}: {
    children: React.ReactNode
    handleClick?: () => void
    className?: string
    type?: "button" | "submit" | "reset"
}) => {
    return (
        <Button
            type={type}
            onClick={handleClick}
            variant={"ghost"}
            className={`text-xs rounded-full cursor-pointer flex items-center gap-2 ${className} transition duration-500`}
        >
            {children}
        </Button>
    )
}

export default IconButton
