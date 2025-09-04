"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { Users, Mail, Calendar, CheckCircle, XCircle } from "lucide-react"

interface JoinlistEntry {
    _id: string
    profile: {
        _id: string
        name: string
        email: string
        avatar?: string
        role: string
        createdAt: string
    }
    type: 'business' | 'partner' | 'other'
    marketing: boolean
    createdAt: string
    updatedAt: string
}

export default function AdminJoinlistPage() {
    const [joinlistData, setJoinlistData] = useState<JoinlistEntry[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchJoinlistData()
    }, [])

    const fetchJoinlistData = async () => {
        try {
            setIsLoading(true)
            const response = await fetch('/api/joinlist')
            
            if (!response.ok) {
                throw new Error('Failed to fetch joinlist data')
            }
            
            const data = await response.json()
            setJoinlistData(data)
        } catch (error) {
            console.error('Error fetching joinlist data:', error)
            setError('Failed to load joinlist data')
            toast.error('Failed to load joinlist data')
        } finally {
            setIsLoading(false)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'business':
                return 'bg-blue-500'
            case 'partner':
                return 'bg-green-500'
            case 'other':
                return 'bg-gray-500'
            default:
                return 'bg-gray-500'
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Joinlist Management</h1>
                        <p className="text-gray-400 mt-2">Manage business joinlist entries</p>
                    </div>
                </div>
                
                <div className="grid gap-6">
                    {[...Array(5)].map((_, i) => (
                        <Card key={i} className="bg-gray-800 border-gray-700">
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-[200px]" />
                                        <Skeleton className="h-3 w-[150px]" />
                                    </div>
                                    <Skeleton className="h-6 w-[80px]" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Joinlist Management</h1>
                        <p className="text-gray-400 mt-2">Manage business joinlist entries</p>
                    </div>
                </div>
                
                <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6 text-center">
                        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <p className="text-red-400">{error}</p>
                        <button 
                            onClick={fetchJoinlistData}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Retry
                        </button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Joinlist Management</h1>
                    <p className="text-gray-400 mt-2">
                        {joinlistData.length} total entries in the joinlist
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">
                            Total Entries
                        </CardTitle>
                        <Users className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">
                            {joinlistData.length}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">
                            Marketing Opt-ins
                        </CardTitle>
                        <Mail className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">
                            {joinlistData.filter(entry => entry.marketing).length}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">
                            Business Entries
                        </CardTitle>
                        <CheckCircle className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">
                            {joinlistData.filter(entry => entry.type === 'business').length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Joinlist Entries */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Joinlist Entries</h2>
                
                {joinlistData.length === 0 ? (
                    <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-6 text-center">
                            <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-400">No joinlist entries found</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {joinlistData.map((entry) => (
                            <Card key={entry._id} className="bg-gray-800 border-gray-700">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage 
                                                    src={entry.profile.avatar} 
                                                    alt={entry.profile.name}
                                                />
                                                <AvatarFallback className="bg-blue-600 text-white">
                                                    {entry.profile.name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">
                                                    {entry.profile.name}
                                                </h3>
                                                <p className="text-gray-400 text-sm">
                                                    {entry.profile.email}
                                                </p>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <Badge 
                                                        variant="secondary" 
                                                        className={`${getTypeColor(entry.type)} text-white`}
                                                    >
                                                        {entry.type}
                                                    </Badge>
                                                    {entry.marketing && (
                                                        <Badge variant="outline" className="text-green-400 border-green-400">
                                                            <Mail className="h-3 w-3 mr-1" />
                                                            Marketing
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="text-right">
                                            <div className="flex items-center text-gray-400 text-sm mb-1">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                {formatDate(entry.createdAt)}
                                            </div>
                                            <Badge variant="outline" className="text-gray-400">
                                                {entry.profile.role}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}