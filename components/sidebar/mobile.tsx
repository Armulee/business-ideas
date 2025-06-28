import {
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "../ui/sheet"
import { ChevronDown } from "lucide-react"
import { useSession } from "next-auth/react"
import { usePathname, useSearchParams } from "next/navigation"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "../ui/collapsible"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Separator } from "../ui/separator"
import React from "react"
import { menus, useCollapsibleMenus } from "./menus"
import { ScrollArea } from "../ui/scroll-area"
import { Logo } from "../logo"
import { LoadingLink } from "../loading-link"

const MobileSidebar = ({
    setOpen,
}: {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const pathname = usePathname()
    const { data: session } = useSession()
    const collapsibleMenus = useCollapsibleMenus()

    const filteredCollapsibleMenus = collapsibleMenus.filter(
        (menu) => menu.section !== "Post" || session?.user
    )

    const searchParams = useSearchParams()
    const params = searchParams.toString()
    const url = `${pathname}${params ? `?${params}` : ""}`
    return (
        <SheetContent
            side='left'
            className='w-[300px] sm:w-[400px] p-0 glassmorphism bg-blue-900/50 !rounded-none h-full border-0'
        >
            <Logo className='text-2xl absolute top-8 w-fit ml-10' />
            {/* <h1 className='font-extrabold text-2xl absolute top-8 w-fit ml-10'>
                <span className='text-blue-400'>Blue</span>
                BizHub
            </h1> */}
            <div className='w-full h-3/4 mt-20 relative'>
                {/* <Separator className='absolute bg-white/20' /> */}
                <ScrollArea className='w-full h-full flex flex-col justify-center items-center'>
                    <SheetHeader className='hidden'>
                        <SheetTitle>BlueBizHub</SheetTitle>
                        <SheetDescription>
                            This is sidebar navigation for Business Ideas
                            website application
                        </SheetDescription>
                    </SheetHeader>

                    <ul className='w-3/4 mx-auto mt-4 flex flex-col flex-shrink-0 justify-center items-center gap-1'>
                        {menus.map((item) => (
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

                    {filteredCollapsibleMenus.map(
                        ({ items, section }, index) => (
                            <React.Fragment
                                key={`mobile-sidebar-menu-${section}`}
                            >
                                <Collapsible
                                    defaultOpen={section !== "Categories"}
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

                                {index + 1 ===
                                filteredCollapsibleMenus.length ? null : (
                                    <Separator className='w-3/4 mx-auto mt-2 mb-4 bg-white/20' />
                                )}
                            </React.Fragment>
                        )
                    )}
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

//  <p className='mt-2 text-sm text-white absolute bottom-5 w-full text-center'>
//      © {new Date().getFullYear()} BusinessIdeas. All rights reserved.
//  </p>

export default MobileSidebar
