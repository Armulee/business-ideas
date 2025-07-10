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
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import {
    Activity,
    Calendar,
    Eye,
    FileText,
    MessageSquare,
    TrendingUp,
    Users,
} from "lucide-react"
import { Progress } from "../ui/progress"

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

interface DashboardStats {
    totalUsers: number
    totalPosts: number
    totalComments: number
    totalViews: number
    activeUsers: number
    newUsersToday: number
    newPostsToday: number
    newCommentsToday: number
    userGrowth: number
    postGrowth: number
    commentGrowth: number
    viewGrowth: number
}

interface ChartData {
    userRegistrations: number[]
    postCreations: number[]
    comments: number[]
    views: number[]
    labels: string[]
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [chartData, setChartData] = useState<ChartData | null>(null)

    useEffect(() => {
        // Simulate API call to fetch dashboard data
        const fetchDashboardData = async () => {
            try {
                // In a real app, this would be actual API calls
                await new Promise((resolve) => setTimeout(resolve, 1000))

                const mockStats: DashboardStats = {
                    totalUsers: 12847,
                    totalPosts: 3421,
                    totalComments: 8934,
                    totalViews: 156789,
                    activeUsers: 2341,
                    newUsersToday: 47,
                    newPostsToday: 23,
                    newCommentsToday: 89,
                    userGrowth: 12.5,
                    postGrowth: 8.3,
                    commentGrowth: 15.7,
                    viewGrowth: 22.1,
                }

                const mockChartData: ChartData = {
                    userRegistrations: [120, 150, 180, 200, 170, 190, 220],
                    postCreations: [45, 52, 38, 67, 49, 58, 71],
                    comments: [234, 189, 267, 298, 245, 312, 289],
                    views: [1200, 1450, 1380, 1620, 1590, 1750, 1890],
                    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                }

                setStats(mockStats)
                setChartData(mockChartData)
            } catch (error) {
                console.error("Error fetching dashboard data:", error)
            }
        }

        fetchDashboardData()
    }, [])

    if (!stats || !chartData) {
        return <div className='text-white'>Error loading dashboard data</div>
    }

    // Chart configurations
    const lineChartData = {
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

    const barChartData = {
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

    const doughnutData = {
        labels: ["Active Users", "Inactive Users"],
        datasets: [
            {
                data: [stats.activeUsers, stats.totalUsers - stats.activeUsers],
                backgroundColor: [
                    "rgba(59, 130, 246, 0.8)",
                    "rgba(107, 114, 128, 0.8)",
                ],
                borderColor: ["rgb(59, 130, 246)", "rgb(107, 114, 128)"],
                borderWidth: 2,
            },
        ],
    }

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

    return (
        <div className='space-y-6'>
            {/* Overview Stats */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                <Card className='bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/30'>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium text-white'>
                            Total Users
                        </CardTitle>
                        <Users className='h-4 w-4 text-blue-400' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold text-white'>
                            {stats.totalUsers.toLocaleString()}
                        </div>
                        <div className='flex items-center text-xs text-green-400'>
                            <TrendingUp className='h-3 w-3 mr-1' />+
                            {stats.userGrowth}% from last month
                        </div>
                        <Progress value={75} className='mt-2 h-1' />
                    </CardContent>
                </Card>

                <Card className='bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/30'>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium text-white'>
                            Total Posts
                        </CardTitle>
                        <FileText className='h-4 w-4 text-green-400' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold text-white'>
                            {stats.totalPosts.toLocaleString()}
                        </div>
                        <div className='flex items-center text-xs text-green-400'>
                            <TrendingUp className='h-3 w-3 mr-1' />+
                            {stats.postGrowth}% from last month
                        </div>
                        <Progress value={60} className='mt-2 h-1' />
                    </CardContent>
                </Card>

                <Card className='bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/30'>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium text-white'>
                            Total Comments
                        </CardTitle>
                        <MessageSquare className='h-4 w-4 text-purple-400' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold text-white'>
                            {stats.totalComments.toLocaleString()}
                        </div>
                        <div className='flex items-center text-xs text-green-400'>
                            <TrendingUp className='h-3 w-3 mr-1' />+
                            {stats.commentGrowth}% from last month
                        </div>
                        <Progress value={85} className='mt-2 h-1' />
                    </CardContent>
                </Card>

                <Card className='bg-gradient-to-br from-orange-600/20 to-orange-800/20 border-orange-500/30'>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium text-white'>
                            Total Views
                        </CardTitle>
                        <Eye className='h-4 w-4 text-orange-400' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold text-white'>
                            {stats.totalViews.toLocaleString()}
                        </div>
                        <div className='flex items-center text-xs text-green-400'>
                            <TrendingUp className='h-3 w-3 mr-1' />+
                            {stats.viewGrowth}% from last month
                        </div>
                        <Progress value={92} className='mt-2 h-1' />
                    </CardContent>
                </Card>
            </div>

            {/* Today's Activity */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                <Card className='bg-white/5 border-white/10'>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium text-white'>
                            New Users Today
                        </CardTitle>
                        <Calendar className='h-4 w-4 text-blue-400' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold text-white'>
                            {stats.newUsersToday}
                        </div>
                    </CardContent>
                </Card>

                <Card className='bg-white/5 border-white/10'>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium text-white'>
                            New Posts Today
                        </CardTitle>
                        <FileText className='h-4 w-4 text-green-400' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold text-white'>
                            {stats.newPostsToday}
                        </div>
                    </CardContent>
                </Card>

                <Card className='bg-white/5 border-white/10'>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium text-white'>
                            New Comments Today
                        </CardTitle>
                        <MessageSquare className='h-4 w-4 text-purple-400' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold text-white'>
                            {stats.newCommentsToday}
                        </div>
                    </CardContent>
                </Card>

                <Card className='bg-white/5 border-white/10'>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium text-white'>
                            Active Users
                        </CardTitle>
                        <Activity className='h-4 w-4 text-orange-400' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold text-white'>
                            {stats.activeUsers.toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <Card className='bg-white/5 border-white/10'>
                    <CardHeader>
                        <CardTitle className='text-white'>
                            User & Post Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Line data={lineChartData} options={chartOptions} />
                    </CardContent>
                </Card>

                <Card className='bg-white/5 border-white/10'>
                    <CardHeader>
                        <CardTitle className='text-white'>
                            Comments This Week
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Bar data={barChartData} options={chartOptions} />
                    </CardContent>
                </Card>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                <Card className='bg-white/5 border-white/10'>
                    <CardHeader>
                        <CardTitle className='text-white'>
                            User Activity Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Doughnut data={doughnutData} />
                    </CardContent>
                </Card>

                <Card className='bg-white/5 border-white/10 lg:col-span-2'>
                    <CardHeader>
                        <CardTitle className='text-white'>
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-4'>
                            {[
                                {
                                    action: "New user registered",
                                    user: "john.doe@example.com",
                                    time: "2 minutes ago",
                                },
                                {
                                    action: "Post created",
                                    user: "jane.smith",
                                    time: "5 minutes ago",
                                },
                                {
                                    action: "Comment posted",
                                    user: "mike.wilson",
                                    time: "8 minutes ago",
                                },
                                {
                                    action: "User reported content",
                                    user: "admin",
                                    time: "12 minutes ago",
                                },
                                {
                                    action: "New user registered",
                                    user: "sarah.jones@example.com",
                                    time: "15 minutes ago",
                                },
                            ].map((activity, index) => (
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
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
