import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    // DropdownMenuShortcut,
    // DropdownMenuGroup,
    // DropdownMenuPortal,
    // DropdownMenuSub,
    // DropdownMenuSubContent,
    // DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"

export default function UserConfig() {
    const { data: session } = useSession()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='cursor-pointer' asChild>
                <div className='flex items-center'>
                    <Avatar>
                        <AvatarImage src={session?.user?.image ?? undefined} />
                        <AvatarFallback className='bg-cyan-600 text-white'>
                            {session?.user?.name?.slice(0, 1)}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className='w-52 glassmorphism bg-black/20 !border-white/30 text-white grid gap-1'>
                <DropdownMenuLabel>{session?.user?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <Link
                    href={`/profile/${
                        session?.user.profile
                    }/${session?.user.name?.toLowerCase()}`}
                >
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                </Link>

                {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}

                {/* <DropdownMenuItem>Give us feedback</DropdownMenuItem> */}

                <DropdownMenuItem
                    className='bg-red-500 hover:bg-red-600 hover:text-red-100'
                    onClick={() => signOut()}
                >
                    Log out
                </DropdownMenuItem>
                {/* <DropdownMenuGroup>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            Invite users
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem>Email</DropdownMenuItem>
                                <DropdownMenuItem>Message</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>More...</DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem>
                        New Team
                        <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>GitHub</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuItem disabled>API</DropdownMenuItem>
                <DropdownMenuSeparator /> */}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
