import {
    LayoutDashboard,
    Users,
    FileText,
    MessageSquare,
    BarChart3,
    Settings,
    Shield,
    Flag,
    Activity,
    Database,
    Star,
    Mail,
    Megaphone,
} from "lucide-react"

// Main menu items (non-collapsible)
export const mainMenuItems = [
    { href: "/admin", name: "Dashboard", icon: LayoutDashboard },
]

// Collapsible menu sections
export const collapsibleMenus = [
    {
        section: "Overview",
        items: [
            { href: "/admin/analytics", name: "Analytics", icon: BarChart3 },
            { href: "/admin/activities", name: "Activities", icon: Activity },
        ],
    },
    {
        section: "Content Management",
        items: [
            { href: "/admin/posts", name: "Posts", icon: FileText },
            { href: "/admin/comments", name: "Comments", icon: MessageSquare },
            { href: "/admin/reports", name: "Reports", icon: Flag },
        ],
    },
    {
        section: "User Management",
        items: [
            { href: "/admin/users", name: "Users", icon: Users },
            { href: "/admin/moderators", name: "Moderators", icon: Shield },
        ],
    },
    {
        section: "Orchestration Management",
        items: [
            {
                href: "/admin/orchestration/content",
                name: "Content",
                icon: Megaphone,
            },
        ],
    },
    {
        section: "System",
        items: [
            { href: "/admin/contact-us", name: "Contact", icon: Mail },
            { href: "/admin/feedback", name: "Feedback", icon: Star },
            { href: "/admin/databases", name: "Databases", icon: Database },
            { href: "/admin/settings", name: "Settings", icon: Settings },
        ],
    },
]
