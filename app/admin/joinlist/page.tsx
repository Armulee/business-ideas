"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Download, Filter, Search, Users, Building2, UserCheck } from "lucide-react"
import { format } from "date-fns"
import axios from "axios"

interface JoinlistEntry {
    id: string
    profile: string
    type: string
    marketing: boolean
    createdAt: string
}

interface JoinlistData {
    data: JoinlistEntry[]
    pagination: {
        page: number
        limit: number
        total: number
        pages: number
    }
}

export default function AdminJoinlistPage() {
    const [joinlistData, setJoinlistData] = useState<JoinlistData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [typeFilter, setTypeFilter] = useState<string>("all")
    const [currentPage, setCurrentPage] = useState(1)

    const fetchJoinlistData = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: "20"
            })
            
            if (typeFilter !== "all") {
                params.append("type", typeFilter)
            }

            const response = await axios.get(`/api/joinlist?${params}`)
            setJoinlistData(response.data)
        } catch (error) {
            console.error("Error fetching joinlist data:", error)
            setError("Failed to fetch joinlist data")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchJoinlistData()
    }, [currentPage, typeFilter])

    const handleExport = () => {
        if (!joinlistData?.data) return

        const csvContent = [
            ["ID", "Profile ID", "Type", "Marketing", "Created At"],
            ...joinlistData.data.map(entry => [
                entry.id,
                entry.profile,
                entry.type,
                entry.marketing ? "Yes" : "No",
                format(new Date(entry.createdAt), "yyyy-MM-dd HH:mm:ss")
            ])
        ].map(row => row.join(",")).join("\n")

        const blob = new Blob([csvContent], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `joinlist-${format(new Date(), "yyyy-MM-dd")}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
    }

    const getTypeIcon = (type: string) => {
        return type === "business" ? <Building2 className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />
    }

    const getTypeColor = (type: string) => {
        return type === "business" ? "bg-blue-500" : "bg-green-500"
    }

    const filteredData = joinlistData?.data.filter(entry => 
        entry.profile.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.type.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

    const stats = {
        total: joinlistData?.pagination.total || 0,
        business: joinlistData?.data.filter(entry => entry.type === "business").length || 0,
        partner: joinlistData?.data.filter(entry => entry.type === "partner").length || 0,
        marketing: joinlistData?.data.filter(entry => entry.marketing).length || 0
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-white">Joinlist Management</h1>
                </div>
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-400 mt-2">Loading joinlist data...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-white">Joinlist Management</h1>
                </div>
                <div className="text-center py-8">
                    <p className="text-red-400">{error}</p>
                    <Button onClick={fetchJoinlistData} className="mt-4">
                        Retry
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Joinlist Management</h1>
                <Button onClick={handleExport} className="button">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-300">Total Enrollments</CardTitle>
                        <Users className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.total}</div>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-300">Business</CardTitle>
                        <Building2 className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.business}</div>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-300">Partners</CardTitle>
                        <UserCheck className="h-4 w-4 text-green-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.partner}</div>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-300">Marketing Opt-in</CardTitle>
                        <Calendar className="h-4 w-4 text-purple-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.marketing}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle className="text-white">Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search by profile ID or type..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-gray-700 border-gray-600 text-white"
                                />
                            </div>
                        </div>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-full sm:w-48 bg-gray-700 border-gray-600 text-white">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filter by type" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600">
                                <SelectItem value="all" className="text-white">All Types</SelectItem>
                                <SelectItem value="business" className="text-white">Business</SelectItem>
                                <SelectItem value="partner" className="text-white">Partner</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Data Table */}
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle className="text-white">Joinlist Entries</CardTitle>
                    <CardDescription className="text-gray-400">
                        Showing {filteredData.length} of {joinlistData?.pagination.total || 0} entries
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-gray-700">
                                    <TableHead className="text-gray-300">Profile ID</TableHead>
                                    <TableHead className="text-gray-300">Type</TableHead>
                                    <TableHead className="text-gray-300">Marketing</TableHead>
                                    <TableHead className="text-gray-300">Created At</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.map((entry) => (
                                    <TableRow key={entry.id} className="border-gray-700">
                                        <TableCell className="text-white font-mono text-sm">
                                            {entry.profile}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`${getTypeColor(entry.type)} text-white`}>
                                                <span className="flex items-center gap-1">
                                                    {getTypeIcon(entry.type)}
                                                    {entry.type}
                                                </span>
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={entry.marketing ? "default" : "secondary"}>
                                                {entry.marketing ? "Yes" : "No"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-gray-300">
                                            {format(new Date(entry.createdAt), "MMM dd, yyyy HH:mm")}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {joinlistData && joinlistData.pagination.pages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <p className="text-sm text-gray-400">
                                Page {joinlistData.pagination.page} of {joinlistData.pagination.pages}
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="border-gray-600 text-gray-300"
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.min(joinlistData.pagination.pages, prev + 1))}
                                    disabled={currentPage === joinlistData.pagination.pages}
                                    className="border-gray-600 text-gray-300"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}