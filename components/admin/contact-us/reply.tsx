import { Reply } from "lucide-react"

export interface Contact {
    _id: string
    firstName: string
    lastName: string
    email: string
    topic: string
    message: string
    createdAt: string
}

const ReplyButton = ({ contact }: { contact: Contact }) => {
    const handleReply = (contact: Contact) => {
        console.log(contact)
    }

    return (
        <button
            onClick={() => handleReply(contact)}
            className='flex items-center gap-1 hover:text-blue-400 transition-colors'
        >
            <Reply className='h-3 w-3' />
            Reply
        </button>
    )
}
export default ReplyButton
