import {
    Rocket,
    Tractor,
    Brain,
    Smartphone,
    Car,
    Hash,
    Hammer,
    ShoppingBag,
    Shield,
    BarChart2,
    GraduationCap,
    Zap,
    Calendar,
    Shirt,
    DollarSign,
    Dumbbell,
    Utensils,
    TreeDeciduous,
    Briefcase,
    Gamepad2,
    Building2,
    HeartPulse,
    Home,
    Coffee,
    UserPlus,
    Gavel,
    Factory,
    Megaphone,
    Camera,
    Heart,
    Droplet,
    HandHeart,
    Users,
    ShoppingCart,
    Share2,
    Code,
    Repeat,
    Cpu,
    Phone,
    Truck,
    Globe,
    ShieldCheck,
    Lock,
    Compass,
    PlusCircle,
    FileText,
    Bookmark,
    FlaskConical,
    Pickaxe,
    MessageSquare,
    Mail,
} from "lucide-react"
import { useSession } from "next-auth/react"

export const menus = [
    { href: "/", name: "Home", icon: Home }, // 🏠 Homepage
    { href: "/post", name: "Explore", icon: Compass }, // 🔍 Discover ideas
]

export const useCollapsibleMenus = () => {
    const { data: session } = useSession()
    return [
        {
            section: "Post",
            items: [
                {
                    href: "/new-post/new-ideas",
                    name: "Create Post",
                    icon: PlusCircle,
                }, // ✏️ Add new post
                {
                    href: `/profile/${
                        session?.user.profile
                    }/${session?.user.name?.toLowerCase()}?tab=posts`,
                    name: "My Posts",
                    icon: FileText,
                }, // 📂 User's posts
                {
                    href: `/profile/${
                        session?.user.profile
                    }/${session?.user.name?.toLowerCase()}?tab=saved`,
                    name: "Saved Posts",
                    icon: Bookmark,
                }, // 📌 Saved for later
            ],
        },
        // {
        //     section: "Community",
        //     items: [
        //         {
        //             href: "/community/new-ideas",
        //             name: "New Ideas",
        //             icon: Lightbulb,
        //         },
        //         {
        //             href: "/community/pain-points",
        //             name: "Pain Points",
        //             icon: Flame,
        //         },
        //         {
        //             href: "/community/existing",
        //             name: "Existing Businesses",
        //             icon: Maximize2,
        //         },
        //     ],
        // },
        {
            section: "Categories",
            items: [
                {
                    name: "Aerospace",
                    icon: Rocket,
                    href: "/post?category=aerospace",
                },
                {
                    name: "Agriculture",
                    icon: Tractor,
                    href: "/post?category=agriculture",
                },
                {
                    name: "AI & ML",
                    icon: Brain,
                    href: "/post?category=ai%20%26%20ml",
                },
                {
                    name: "Application",
                    icon: Smartphone,
                    href: "/post?category=application",
                },
                {
                    name: "Automotive",
                    icon: Car,
                    href: "/post?category=automotive",
                },
                {
                    name: "Blockchain",
                    icon: Hash,
                    href: "/post?category=blockchain",
                },
                {
                    name: "Chemical",
                    icon: FlaskConical,
                    href: "/post?category=chemical",
                },
                {
                    name: "Construction",
                    icon: Hammer,
                    href: "/post?category=construction",
                },
                {
                    name: "Consumer Goods",
                    icon: ShoppingBag,
                    href: "/post?category=consumer%20goods",
                },
                {
                    name: "Cybersecurity",
                    icon: Shield,
                    href: "/post?category=cybersecurity",
                },
                {
                    name: "Data Analytics",
                    icon: BarChart2,
                    href: "/post?category=data%20analytics",
                },
                {
                    name: "Education",
                    icon: GraduationCap,
                    href: "/post?category=education",
                },
                { name: "Energy", icon: Zap, href: "/post?category=energy" },
                {
                    name: "Events",
                    icon: Calendar,
                    href: "/post?category=events",
                },
                {
                    name: "Fashion",
                    icon: Shirt,
                    href: "/post?category=fashion",
                },
                {
                    name: "Finance",
                    icon: DollarSign,
                    href: "/post?category=finance",
                },
                {
                    name: "Fitness",
                    icon: Dumbbell,
                    href: "/post?category=fitness",
                },
                { name: "Food", icon: Utensils, href: "/post?category=food" },
                {
                    name: "Forestry",
                    icon: TreeDeciduous,
                    href: "/post?category=forestry",
                },
                {
                    name: "Freelancing",
                    icon: Briefcase,
                    href: "/post?category=freelancing",
                },
                {
                    name: "Gaming",
                    icon: Gamepad2,
                    href: "/post?category=gaming",
                },
                {
                    name: "Government",
                    icon: Building2,
                    href: "/post?category=government",
                },
                {
                    name: "Healthcare",
                    icon: HeartPulse,
                    href: "/post?category=healthcare",
                },
                {
                    name: "Home & Interior",
                    icon: Home,
                    href: "/post?category=home%20%26%20interior",
                },
                {
                    name: "Hospitality",
                    icon: Coffee,
                    href: "/post?category=hospitality",
                },
                {
                    name: "HR & Recruiting",
                    icon: UserPlus,
                    href: "/post?category=hr%20%26%20recruiting",
                },
                { name: "Legal", icon: Gavel, href: "/post?category=legal" },
                {
                    name: "Manufacturing",
                    icon: Factory,
                    href: "/post?category=manufacturing",
                },
                {
                    name: "Marketing",
                    icon: Megaphone,
                    href: "/post?category=marketing",
                },
                { name: "Media", icon: Camera, href: "/post?category=media" },
                {
                    name: "Mining",
                    icon: Pickaxe,
                    href: "/post?category=mining",
                },
                {
                    name: "Nonprofits",
                    icon: Heart,
                    href: "/post?category=nonprofits",
                },
                {
                    name: "Oil & Gas",
                    icon: Droplet,
                    href: "/post?category=oil%20%26%20gas",
                },
                {
                    name: "Personal Care",
                    icon: HandHeart,
                    href: "/post?category=personal%20care",
                },
                {
                    name: "Professional Services",
                    icon: Users,
                    href: "/post?category=professional%20services",
                },
                {
                    name: "Real Estate",
                    icon: Building2,
                    href: "/post?category=real%20estate",
                },
                { name: "R&D", icon: Brain, href: "/post?category=r%26d" },
                {
                    name: "Retail",
                    icon: ShoppingCart,
                    href: "/post?category=retail",
                },
                {
                    name: "Social Media",
                    icon: Share2,
                    href: "/post?category=social%20media",
                },
                {
                    name: "Software",
                    icon: Code,
                    href: "/post?category=software",
                },
                {
                    name: "Subscription",
                    icon: Repeat,
                    href: "/post?category=subscription",
                },
                {
                    name: "Technology",
                    icon: Cpu,
                    href: "/post?category=technology",
                },
                {
                    name: "Telecom",
                    icon: Phone,
                    href: "/post?category=telecom",
                },
                {
                    name: "Transportation",
                    icon: Truck,
                    href: "/post?category=transportation",
                },
                {
                    name: "Website",
                    icon: Globe,
                    href: "/post?category=website",
                },
            ],
        },
        {
            section: "Resources",
            items: [
                {
                    href: "/guidelines",
                    name: "Community Guidelines",
                    icon: ShieldCheck,
                }, // 👤 User profile
                {
                    href: "/privacy-policy",
                    name: "Privacy Policies",
                    icon: Lock,
                }, // ⚙️ Preferences
                {
                    href: "/terms",
                    name: "Terms & Conditions",
                    icon: FileText,
                }, // 🔔 Alerts
            ],
        },
        {
            section: "Contact Us",
            items: [
                {
                    href: "/contact-us",
                    name: "Contact Us",
                    icon: Mail,
                }, // ✉️ Contact
                {
                    href: "#feedback",
                    name: "Give Feedback",
                    icon: MessageSquare,
                }, // 💬 Feedback
            ],
        },
    ]
}
