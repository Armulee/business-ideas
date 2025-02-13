import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { DropdownMenu } from "../ui/dropdown-menu"
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import Dropdown from "./dropdown"
import React from "react"
import Link from "next/link"

const ActionButton = ({
    menu,
    setMenu,
}: {
    menu: boolean
    setMenu: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const { data: session } = useSession()
    return (
        <>
            {session?.user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className='flex items-center'>
                            <Avatar>
                                <AvatarImage
                                    src={session.user.image ?? undefined}
                                />
                                <AvatarFallback className='bg-blue-700 text-white'>
                                    {session.user.name?.slice(0, 1)}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </DropdownMenuTrigger>
                    <Dropdown />
                </DropdownMenu>
            ) : (
                <>
                    <div className='hidden sm:ml-6 sm:flex sm:items-center'>
                        <Link href={"/signin"}>
                            <Button>Get Started</Button>
                        </Link>
                    </div>
                    <div className='sm:hidden sm:ml-6 flex items-center gap-2'>
                        <Button
                            variant={"secondary"}
                            onClick={() => setMenu(!menu)}
                        >
                            {menu ? <X /> : <Menu />}
                        </Button>
                        <Link href={"/signin"}>
                            <Button>Get Started</Button>
                        </Link>
                    </div>
                </>
            )}
        </>
    )
}

export default ActionButton
