"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import React, { useState } from "react"
import { Collapsible, CollapsibleContent } from "../../ui/collapsible"
import { CollapsibleTrigger } from "@radix-ui/react-collapsible"
import { useSession } from "next-auth/react"
import { ChevronDown } from "lucide-react"
import { menus, useCollapsibleMenus } from "./menus"
import { ScrollArea } from "../../ui/scroll-area"
import { FeedbackDialog } from "../feedback-dialog"
import { useDynamicViewportHeight } from "@/hooks/use-ios-height"

export default function UserSidebar() {
    const pathname = usePathname()
    const { data: session } = useSession()
    const [feedbackOpen, setFeedbackOpen] = useState(false)
    const sidebarHeight = useDynamicViewportHeight()
    const collapsibleMenus = useCollapsibleMenus()

    const filteredCollapsibleMenus = collapsibleMenus
        .map((menu) => ({
            ...menu,
            items:
                menu.section === "Partner Program" && !session?.user
                    ? menu.items.filter((item) => item.name !== "Registration")
                    : menu.items,
        })) // Remove 'Registration' in the Partner Program section out when user is not login
        .filter(
            (menu) => menu.section !== "Post" || session?.user // Remove 'Post' section when the user is not login
        )

    const hide = pathname.startsWith("/auth")

    const searchParams = useSearchParams()
    const params = searchParams.toString()
    const url = `${pathname}${params ? `?${params}` : ""}`

    const handleFeedbackClick = () => {
        setFeedbackOpen(true)
    }
    return (
        <>
            {hide ? null : (
                <aside 
                    className='sidebar-fixed w-52 glassmorphism sidebar-full-height'
                    style={{ height: sidebarHeight }}
                >
                    <Sidebar
                        className='w-52 border-white/20 h-full'
                        collapsible='icon'
                    >
                        <SidebarContent className='h-full'>
                            <ScrollArea className='pt-2 pb-20 h-full'>
                                {/* Main menu */}
                                <SidebarGroup>
                                    <SidebarGroupContent>
                                        <SidebarMenu>
                                            {menus.map((item) => (
                                                <SidebarMenuItem
                                                    key={`sidebar-group-${item.name}`}
                                                >
                                                    <SidebarMenuButton
                                                        className={`text-white hover:bg-white/20 hover:text-white mb-1 ${
                                                            url === item.href
                                                                ? "bg-white text-blue-600 hover:bg-white hover:text-blue-600"
                                                                : ""
                                                        }`}
                                                        asChild
                                                    >
                                                        <Link href={item.href}>
                                                            <item.icon />
                                                            <span>
                                                                {item.name}
                                                            </span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            ))}
                                        </SidebarMenu>
                                    </SidebarGroupContent>
                                </SidebarGroup>

                                <SidebarSeparator className='mb-1 bg-white/20' />

                                {filteredCollapsibleMenus.map(
                                    ({ items, section }, index) => (
                                        <React.Fragment
                                            key={`sidebar-menu-${section}`}
                                        >
                                            <Collapsible
                                                defaultOpen={
                                                    section !== "Categories"
                                                }
                                                className='group/collapsible'
                                            >
                                                <SidebarGroup>
                                                    <SidebarGroupLabel asChild>
                                                        <CollapsibleTrigger className='text-white/50 !text-md mb-1'>
                                                            {section}
                                                            <ChevronDown className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180' />
                                                        </CollapsibleTrigger>
                                                    </SidebarGroupLabel>
                                                    <CollapsibleContent>
                                                        <SidebarGroupContent>
                                                            <SidebarMenu>
                                                                {items.map(
                                                                    (item) => (
                                                                        <SidebarMenuItem
                                                                            key={`sidebar-menu-${item.name}`}
                                                                        >
                                                                            {item.href ===
                                                                            "#feedback" ? (
                                                                                <SidebarMenuButton
                                                                                    className='text-white hover:bg-white/20 hover:text-white mb-1'
                                                                                    onClick={
                                                                                        handleFeedbackClick
                                                                                    }
                                                                                >
                                                                                    <item.icon />
                                                                                    <span>
                                                                                        {
                                                                                            item.name
                                                                                        }
                                                                                    </span>
                                                                                </SidebarMenuButton>
                                                                            ) : (
                                                                                <SidebarMenuButton
                                                                                    className={`text-white hover:bg-white/20 hover:text-white mb-1 ${
                                                                                        url ===
                                                                                        item.href
                                                                                            ? "bg-white text-blue-600 hover:bg-white hover:text-blue-600"
                                                                                            : ""
                                                                                    }`}
                                                                                    asChild
                                                                                >
                                                                                    <Link
                                                                                        href={
                                                                                            item.href
                                                                                        }
                                                                                    >
                                                                                        <item.icon />
                                                                                        <span>
                                                                                            {
                                                                                                item.name
                                                                                            }
                                                                                        </span>
                                                                                    </Link>
                                                                                </SidebarMenuButton>
                                                                            )}
                                                                        </SidebarMenuItem>
                                                                    )
                                                                )}
                                                            </SidebarMenu>
                                                        </SidebarGroupContent>
                                                    </CollapsibleContent>
                                                </SidebarGroup>
                                            </Collapsible>
                                            {index + 1 !==
                                            filteredCollapsibleMenus.length ? (
                                                <SidebarSeparator className='bg-white/20' />
                                            ) : null}
                                        </React.Fragment>
                                    )
                                )}
                            </ScrollArea>
                        </SidebarContent>
                    </Sidebar>
                </aside>
            )}

            <FeedbackDialog
                open={feedbackOpen}
                onOpenChange={setFeedbackOpen}
            />
        </>
    )
}
