import {
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "../../ui/sheet"
import { ChevronDown } from "lucide-react"
import { usePathname } from "next/navigation"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "../../ui/collapsible"
import { Button } from "../../ui/button"
import { Label } from "../../ui/label"
import { Separator } from "../../ui/separator"
import React from "react"
import { ScrollArea } from "../../ui/scroll-area"
import { Logo } from "../../logo"
import { LoadingLink } from "../../loading-link"
import { mainMenuItems, collapsibleMenus } from "./menu"

const AdminMobileSidebar = ({
    setOpen,
}: {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const pathname = usePathname()
    const url = pathname

    return (
        <SheetContent
            side='left'
            className='w-[300px] sm:w-[400px] p-0 glassmorphism bg-gray-900/50 !rounded-none h-full border-0'
        >
            <Logo className='text-2xl absolute top-8 w-fit ml-10' />
            <div className='w-full h-3/4 mt-20 relative'>
                <ScrollArea className='w-full h-full flex flex-col justify-center items-center'>
                    <SheetHeader className='hidden'>
                        <SheetTitle>BlueBizHub Admin</SheetTitle>
                        <SheetDescription>
                            This is admin sidebar navigation for BlueBizHub
                            website application
                        </SheetDescription>
                    </SheetHeader>

                    <ul className='w-3/4 mx-auto mt-4 flex flex-col flex-shrink-0 justify-center items-center gap-1'>
                        {mainMenuItems.map((item) => (
                            <li className='w-full' key={item.name}>
                                <Button
                                    asChild
                                    variant={"ghost"}
                                    className={`w-full justify-start hover:text-white hover:bg-white/20 ${
                                        url === item.href
                                            ? "bg-white text-blue-600"
                                            : "text-white"
                                    }`}
                                    onClick={() => setOpen(false)}
                                >
                                    <LoadingLink href={item.href}>
                                        <item.icon className='mr-2 h-4 w-4' />
                                        {item.name}
                                    </LoadingLink>
                                </Button>
                            </li>
                        ))}
                    </ul>

                    <Separator className='w-3/4 mx-auto mt-2 mb-4 bg-white/20' />

                    {collapsibleMenus.map(({ items, section }, index) => (
                        <React.Fragment
                            key={`mobile-admin-sidebar-menu-${section}`}
                        >
                            <Collapsible
                                defaultOpen={true}
                                className='w-3/4 mx-auto mb-4'
                            >
                                <CollapsibleTrigger className='flex items-start justify-start w-full text-white/70 mb-2 hover:text-white'>
                                    <Label className='flex gap-2'>
                                        {section}
                                        <ChevronDown className='h-4 w-4' />
                                    </Label>
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                    <ul>
                                        {items.map((item) => (
                                            <li
                                                className='mb-1'
                                                key={item.name}
                                            >
                                                <Button
                                                    asChild
                                                    variant={"ghost"}
                                                    className={`w-full justify-start hover:text-white hover:bg-white/20 ${
                                                        url === item.href
                                                            ? "bg-white text-blue-600"
                                                            : "text-white"
                                                    }`}
                                                    onClick={() =>
                                                        setOpen(false)
                                                    }
                                                >
                                                    <LoadingLink
                                                        href={item.href}
                                                    >
                                                        <item.icon className='mr-2 h-4 w-4' />
                                                        {item.name}
                                                    </LoadingLink>
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                </CollapsibleContent>
                            </Collapsible>

                            {index + 1 === collapsibleMenus.length ? null : (
                                <Separator className='w-3/4 mx-auto mt-2 mb-4 bg-white/20' />
                            )}
                        </React.Fragment>
                    ))}
                </ScrollArea>
                <Separator className='absolute bottom-0 bg-white/20' />
            </div>

            <p className='mt-2 text-sm text-white absolute bottom-6 w-full text-center'>
                © {new Date().getFullYear()} BusinessIdeas. <br />
                All rights reserved.
            </p>
        </SheetContent>
    )
}

export default AdminMobileSidebar
