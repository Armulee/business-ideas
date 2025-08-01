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
import { usePathname } from "next/navigation"
import React from "react"
import { Collapsible, CollapsibleContent } from "../../ui/collapsible"
import { CollapsibleTrigger } from "@radix-ui/react-collapsible"
import { ChevronDown } from "lucide-react"
import { ScrollArea } from "../../ui/scroll-area"
import { mainMenuItems, collapsibleMenus } from "./menu"

export default function AdminSidebar() {
    const pathname = usePathname()
    const url = pathname

    return (
        <aside className='sticky top-0 self-start max-w-52 glassmorphism bg-gray-900 !border-0'>
            <Sidebar
                className='mt-[70px] w-52 border-white/20'
                collapsible='icon'
            >
                <SidebarContent>
                    <ScrollArea className='pt-2 pb-20'>
                        {/* Main menu */}
                        <SidebarGroup>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {mainMenuItems.map((item) => (
                                        <SidebarMenuItem
                                            key={`sidebar-group-${item.name}`}
                                        >
                                            <SidebarMenuButton
                                                className={`text-white hover:bg-white/20 hover:text-white mb-1 ${
                                                    url === item.href
                                                        ? "bg-blue-600/20 text-blue-400 hover:bg-white hover:text-blue-600"
                                                        : ""
                                                }`}
                                                asChild
                                            >
                                                <Link href={item.href}>
                                                    <item.icon />
                                                    <span>{item.name}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>

                        <SidebarSeparator className='mb-1 bg-white/20' />

                        {collapsibleMenus.map(({ items, section }, index) => (
                            <React.Fragment key={`sidebar-menu-${section}`}>
                                <Collapsible
                                    defaultOpen={true}
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
                                                    {items.map((item) => (
                                                        <SidebarMenuItem
                                                            key={`sidebar-menu-${item.name}`}
                                                        >
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
                                                        </SidebarMenuItem>
                                                    ))}
                                                </SidebarMenu>
                                            </SidebarGroupContent>
                                        </CollapsibleContent>
                                    </SidebarGroup>
                                </Collapsible>
                                {index + 1 !== collapsibleMenus.length ? (
                                    <SidebarSeparator className='bg-white/20' />
                                ) : null}
                            </React.Fragment>
                        ))}
                    </ScrollArea>
                </SidebarContent>
            </Sidebar>
        </aside>
    )
}
