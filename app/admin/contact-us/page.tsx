"use client"

import { useCallback, useEffect, useState } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Mail,
    Calendar,
    MessageSquare,
    Search,
    ChevronDown,
    ChevronUp,
    Trash2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import axios from "axios"
import { format } from "date-fns"
import ReplyButton, { Contact } from "@/components/admin/contact-us/reply"

interface TruncatedMessageProps {
    message: string
    maxLength?: number
}

function TruncatedMessage({ message, maxLength = 100 }: TruncatedMessageProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const shouldTruncate = message.length > maxLength

    const displayMessage =
        shouldTruncate && !isExpanded
            ? message.slice(0, maxLength) + "..."
            : message

    if (!shouldTruncate) {
        return (
            <p className='text-white/80 text-sm leading-relaxed'>{message}</p>
        )
    }

    return (
        <div>
            <p className='text-white/80 text-sm leading-relaxed'>
                {displayMessage}
            </p>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className='text-blue-400 hover:text-blue-300 text-sm mt-1 flex items-center gap-1 transition-colors'
            >
                {isExpanded ? (
                    <>
                        View less
                        <ChevronUp className='h-3 w-3' />
                    </>
                ) : (
                    <>
                        View more
                        <ChevronDown className='h-3 w-3' />
                    </>
                )}
            </button>
        </div>
    )
}

const topicColors: { [key: string]: string } = {
    "General Inquiry": "bg-blue-500",
    "Technical Support": "bg-red-500",
    "Partnership Opportunities": "bg-green-500",
    "Business Ideas Feedback": "bg-purple-500",
    "Account Issues": "bg-orange-500",
    "Feature Requests": "bg-cyan-500",
    "Bug Reports": "bg-pink-500",
    Other: "bg-gray-500",
}

export default function AdminContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedTopic, setSelectedTopic] = useState<string>("all")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const fetchContacts = useCallback(async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "10",
            })

            if (selectedTopic && selectedTopic !== "all") {
                params.append("topic", selectedTopic)
            }

            const { data } = await axios.get(`/api/contact?${params}`)
            setContacts(data.contacts)
            setTotalPages(data.pagination.pages)
        } catch (error) {
            console.error("Failed to fetch contacts:", error)
        } finally {
            setLoading(false)
        }
    }, [page, selectedTopic])

    const deleteContact = async (contactId: string) => {
        try {
            await axios.delete(`/api/contact/${contactId}`)
            setContacts(contacts.filter((contact) => contact._id !== contactId))
        } catch (error) {
            console.error("Failed to delete contact:", error)
        }
    }

    useEffect(() => {
        fetchContacts()
    }, [fetchContacts])

    const filteredContacts = contacts.filter(
        (contact) =>
            searchTerm === "" ||
            contact.firstName
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.message.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const topics = [
        "General Inquiry",
        "Technical Support",
        "Partnership Opportunities",
        "Business Ideas Feedback",
        "Account Issues",
        "Feature Requests",
        "Bug Reports",
        "Other",
    ]

    if (loading && contacts.length === 0) {
        return (
            <div className='space-y-6'>
                <div className='flex justify-between items-center'>
                    <h1 className='text-3xl font-bold text-white'>
                        Contact Submissions
                    </h1>
                </div>

                <div className='grid gap-4'>
                    {[...Array(5)].map((_, i) => (
                        <Card key={i} className='glassmorphism border-white/10'>
                            <CardHeader>
                                <Skeleton className='h-6 w-1/3 bg-white/20' />
                                <Skeleton className='h-4 w-1/2 bg-white/10' />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className='h-20 w-full bg-white/10' />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <section className='py-8 space-y-6'>
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl font-bold text-white'>
                    Contact Submissions
                </h1>
                <div className='text-white/70'>
                    Total: {contacts.length} submissions
                </div>
            </div>

            {/* Filters */}
            <Card className='glassmorphism bg-transparent border-white/10'>
                <CardContent className='pt-6'>
                    <div className='flex gap-4 flex-wrap'>
                        <div className='flex-1 min-w-64'>
                            <div className='relative'>
                                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4' />
                                <Input
                                    placeholder='Search contacts...'
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className='pl-10 input'
                                />
                            </div>
                        </div>
                        <Select
                            value={selectedTopic}
                            onValueChange={setSelectedTopic}
                        >
                            <SelectTrigger className='w-48 select'>
                                <SelectValue placeholder='Filter by topic' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='all'>All Topics</SelectItem>
                                {topics.map((topic) => (
                                    <SelectItem key={topic} value={topic}>
                                        {topic}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Contacts List */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {filteredContacts.map((contact) => (
                    <Card
                        key={contact._id}
                        className='glassmorphism bg-transparent border-white/10 hover:border-white/20 transition-colors'
                    >
                        <CardHeader>
                            <CardTitle className='flex flex-col text-white text-lg'>
                                <Badge
                                    className={`w-fit mb-2 ${topicColors[contact.topic] || topicColors["Other"]} text-white`}
                                >
                                    {contact.topic}
                                </Badge>
                                {contact.firstName} {contact.lastName}
                            </CardTitle>
                            <CardDescription className='text-white/70 flex items-center gap-2 mt-1'>
                                <Mail className='h-4 w-4' />
                                {contact.email}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='glassmorphism px-4 py-2 flex items-start gap-2'>
                                <MessageSquare className='h-4 w-4 text-white/60 mt-1 flex-shrink-0' />
                                <TruncatedMessage message={contact.message} />
                            </div>
                        </CardContent>
                        <CardFooter className='w-full flex justify-between items-center text-white/60 text-sm'>
                            <div className='flex items-center gap-2'>
                                <ReplyButton contact={contact} />
                                <button
                                    onClick={() => deleteContact(contact._id)}
                                    className='flex items-center gap-1 hover:text-red-400 transition-colors'
                                >
                                    <Trash2 className='h-3 w-3' />
                                    Delete
                                </button>
                            </div>

                            <div className='flex items-center gap-1'>
                                <Calendar className='h-3 w-3' />
                                {format(
                                    new Date(contact.createdAt),
                                    "MMM dd, yyyy"
                                )}
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {filteredContacts.length === 0 && !loading && (
                <Card className='glassmorphism bg-transparent border-white/10'>
                    <CardContent className='pt-6 text-center'>
                        <MessageSquare className='h-12 w-12 text-white/40 mx-auto mb-4' />
                        <h3 className='text-lg font-medium text-white mb-2'>
                            No contacts found
                        </h3>
                        <p className='text-white/60'>
                            {searchTerm || selectedTopic
                                ? "Try adjusting your search or filter criteria."
                                : "No contact submissions yet."}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className='flex justify-center gap-2'>
                    <Button
                        variant='outline'
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className='button'
                    >
                        Previous
                    </Button>
                    <span className='flex items-center px-4 text-white/70'>
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        variant='outline'
                        onClick={() =>
                            setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages}
                        className='button'
                    >
                        Next
                    </Button>
                </div>
            )}
        </section>
    )
}
