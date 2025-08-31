"use client"

import { useEffect, useState } from "react"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js"
import { Line, Bar, Doughnut } from "react-chartjs-2"
import {
    Activity,
    Calendar,
    FileText,
    Flag,
    MessageSquare,
    TrendingUp,
    Users,
} from "lucide-react"
import Link from "next/link"
import axios from "axios"
import { AdminSkeleton } from "@/components/skeletons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
)

interface ChartData {
    userRegistrations: number[]
    postCreations: number[]
    comments: number[]
    views: number[]
    labels: string[]
}

interface ActivityItem {
    action: string
    user: string
    time: string
}

// Overview Stats Configuration
const overviewStats = [
    {
        key: "totalUsers",
        title: "Total Users",
        icon: Users,
        iconColor: "text-blue-400",
        growthKey: "userGrowth",
        link: "/admin/users",
    },
    {
        key: "totalPosts",
        title: "Total Posts",
        icon: FileText,
        iconColor: "text-green-400",
        growthKey: "postGrowth",
        link: "/admin/posts",
    },
    {
        key: "totalComments",
        title: "Total Comments",
        icon: MessageSquare,
        iconColor: "text-purple-400",
        growthKey: "commentGrowth",
        link: "/admin/comments",
    },
    {
        key: "totalReports",
        title: "Total Reports",
        icon: Flag,
        iconColor: "text-orange-400",
        // growthKey: "reportsGrowth",
        link: "/admin/reports",
    },
]

// Today's Activity Configuration
const todayStats = [
    {
        key: "newUsersToday",
        title: "New Users Today",
        icon: Calendar,
        iconColor: "text-blue-400",
        link: "/admin/users",
    },
    {
        key: "newPostsToday",
        title: "New Posts Today",
        icon: FileText,
        iconColor: "text-green-400",
        link: "/admin/posts",
    },
    {
        key: "newCommentsToday",
        title: "New Comments Today",
        icon: MessageSquare,
        iconColor: "text-purple-400",
        link: "/admin/comments",
    },
    {
        key: "activeUsers",
        title: "Active Users",
        icon: Activity,
        iconColor: "text-orange-400",
        link: "/admin/activities",
    },
]

// Charts Configuration
const chartConfigs = [
    {
        id: "line-chart",
        title: "User & Post Activity",
        type: "line",
        colSpan: "lg:col-span-1",
    },
    {
        id: "bar-chart",
        title: "Comments This Week",
        type: "bar",
        colSpan: "lg:col-span-1",
    },
    {
        id: "doughnut-chart",
        title: "User Activity Distribution",
        type: "doughnut",
        colSpan: "lg:col-span-1",
    },
]

const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
            labels: {
                color: "white",
            },
        },
    },
    scales: {
        x: {
            ticks: {
                color: "white",
            },
            grid: {
                color: "rgba(255, 255, 255, 0.1)",
            },
        },
        y: {
            ticks: {
                color: "white",
            },
            grid: {
                color: "rgba(255, 255, 255, 0.1)",
            },
        },
    },
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<{ [stat: string]: number } | null>(null)
    const [chartData, setChartData] = useState<ChartData | null>(null)
    const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get("/api/admin/stats")

                setStats({
                    totalUsers: response.data.totalUsers,
                    totalPosts: response.data.totalPosts,
                    totalComments: response.data.totalComments,
                    totalReports: response.data.totalReports,
                    activeUsers: response.data.activeUsers,
                    newUsersToday: response.data.newUsersToday,
                    newPostsToday: response.data.newPostsToday,
                    newCommentsToday: response.data.newCommentsToday,
                    userGrowth: response.data.userGrowth,
                    postGrowth: response.data.postGrowth,
                    commentGrowth: response.data.commentGrowth,
                })

                setChartData(response.data.chartData)
                setRecentActivity(response.data.recentActivity || [])
            } catch (error) {
                console.error("Error fetching dashboard data:", error)
                // Set fallback data on error
                setStats({
                    totalUsers: 0,
                    totalPosts: 0,
                    totalComments: 0,
                    totalViews: 0,
                    activeUsers: 0,
                    newUsersToday: 0,
                    newPostsToday: 0,
                    newCommentsToday: 0,
                    userGrowth: 0,
                    postGrowth: 0,
                    commentGrowth: 0,
                    viewGrowth: 0,
                })
                setChartData({
                    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                    userRegistrations: [0, 0, 0, 0, 0, 0, 0],
                    postCreations: [0, 0, 0, 0, 0, 0, 0],
                    comments: [0, 0, 0, 0, 0, 0, 0],
                    views: [0, 0, 0, 0, 0, 0, 0],
                })
                setRecentActivity([])
            }
        }

        fetchDashboardData()
    }, [])

    if (!stats || !chartData) {
        return <AdminSkeleton />
    }

    // Chart data generators
    const getLineChartData = () => {
        if (!chartData) return null
        return {
            labels: chartData.labels,
            datasets: [
                {
                    label: "User Registrations",
                    data: chartData.userRegistrations,
                    borderColor: "rgb(59, 130, 246)",
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    tension: 0.4,
                },
                {
                    label: "Post Creations",
                    data: chartData.postCreations,
                    borderColor: "rgb(16, 185, 129)",
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                    tension: 0.4,
                },
            ],
        }
    }

    const getBarChartData = () => {
        if (!chartData) return null
        return {
            labels: chartData.labels,
            datasets: [
                {
                    label: "Comments",
                    data: chartData.comments,
                    backgroundColor: "rgba(139, 92, 246, 0.8)",
                    borderColor: "rgb(139, 92, 246)",
                    borderWidth: 1,
                },
            ],
        }
    }

    const getDoughnutData = () => {
        if (!stats) return null
        return {
            labels: ["Active Users", "Inactive Users"],
            datasets: [
                {
                    data: [
                        stats.activeUsers,
                        stats.totalUsers - stats.activeUsers,
                    ],
                    backgroundColor: [
                        "rgba(59, 130, 246, 0.8)",
                        "rgba(107, 114, 128, 0.8)",
                    ],
                    borderColor: ["rgb(59, 130, 246)", "rgb(107, 114, 128)"],
                    borderWidth: 2,
                },
            ],
        }
    }

    const renderChart = (type: string) => {
        switch (type) {
            case "line":
                const lineData = getLineChartData()
                return lineData ? (
                    <Line data={lineData} options={chartOptions} />
                ) : null
            case "bar":
                const barData = getBarChartData()
                return barData ? (
                    <Bar data={barData} options={chartOptions} />
                ) : null
            case "doughnut":
                const doughnutData = getDoughnutData()
                return doughnutData ? <Doughnut data={doughnutData} /> : null
            default:
                return null
        }
    }

    return (
        <div className='pt-6'>
            {/* Overview Stats */}
            <p className='font-bold text-lg mb-2'>Overview</p>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
                {overviewStats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Link key={stat.key} href={stat.link}>
                            <Card className='bg-white/10 backdrop-blur-md border-white/20 h-full shadow-xl'>
                                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                    <CardTitle className='text-sm font-medium text-white'>
                                        {stat.title}
                                    </CardTitle>
                                    <Icon
                                        className={`h-4 w-4 ${stat.iconColor}`}
                                    />
                                </CardHeader>
                                <CardContent>
                                    <div className='text-2xl font-bold text-white'>
                                        {stats?.[stat.key]?.toLocaleString() ||
                                            0}
                                    </div>
                                    {stat.growthKey &&
                                    stats?.[stat.growthKey] > 0 ? (
                                        <div className='flex items-center text-[10px] text-green-400'>
                                            <TrendingUp className='h-3 w-3 mr-1' />
                                            +{stats?.[stat.growthKey] || 0}%
                                            from last month
                                        </div>
                                    ) : stat.growthKey &&
                                      stats?.[stat.growthKey] < 0 ? (
                                        <div className='flex items-center text-[10px] text-red-400'>
                                            <TrendingUp className='h-3 w-3 mr-1' />
                                            -{stats?.[stat.growthKey] || 0}%
                                            from last month
                                        </div>
                                    ) : null}
                                </CardContent>
                            </Card>
                        </Link>
                    )
                })}
            </div>

            {/* Today's Activity */}
            <p className='font-bold text-lg mb-2'>Today Activity</p>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
                {todayStats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Card
                            key={stat.key}
                            className='bg-white/10 backdrop-blur-md border-white/20 h-full shadow-xl'
                        >
                            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                                <CardTitle className='text-sm font-medium text-white'>
                                    {stat.title}
                                </CardTitle>
                                <Icon className={`h-4 w-4 ${stat.iconColor}`} />
                            </CardHeader>
                            <CardContent>
                                <div className='text-2xl font-bold text-white'>
                                    {stats?.[stat.key]?.toLocaleString() || 0}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Charts */}
            <p className='font-bold text-lg mb-2'>Charts</p>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
                {chartConfigs.slice(0, 2).map((chart) => (
                    <Card
                        key={chart.id}
                        className='bg-white/10 backdrop-blur-md border-white/20 shadow-xl'
                    >
                        <CardHeader>
                            <CardTitle className='text-white'>
                                {chart.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>{renderChart(chart.type)}</CardContent>
                    </Card>
                ))}
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                <Card className='bg-white/10 backdrop-blur-md border-white/20 shadow-xl'>
                    <CardHeader>
                        <CardTitle className='text-white'>
                            {chartConfigs[2].title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {renderChart(chartConfigs[2].type)}
                    </CardContent>
                </Card>

                <Card className='bg-white/10 backdrop-blur-md border-white/20 shadow-xl lg:col-span-2'>
                    <CardHeader>
                        <CardTitle className='text-white'>
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-4'>
                            {recentActivity.length > 0 ? (
                                recentActivity.map((activity, index) => (
                                    <div
                                        key={index}
                                        className='flex items-center justify-between py-2 border-b border-white/10 last:border-b-0'
                                    >
                                        <div>
                                            <p className='text-white text-sm'>
                                                {activity.action}
                                            </p>
                                            <p className='text-gray-400 text-xs'>
                                                by {activity.user}
                                            </p>
                                        </div>
                                        <span className='text-gray-400 text-xs'>
                                            {activity.time}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className='text-center text-gray-400 py-4'>
                                    No recent activity available
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
