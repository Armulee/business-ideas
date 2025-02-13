import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"
import { Idea } from "./Ideas"

export default function IdeaCard({
    idea,
    className = "",
}: {
    idea: Idea
    className?: string
}) {
    console.log(className)
    return (
        <Card
            className={`${className} glassmorphism text-white hover:shadow-lg transition-shadow duration-300`}
        >
            <CardHeader>
                <CardTitle className='mb-1'>{idea.title}</CardTitle>
                <Badge
                    variant='secondary'
                    className='text-blue-700 w-fit cursor-pointer'
                >
                    {idea.category}
                </Badge>
            </CardHeader>
            <CardContent>
                <p className='text-white content'>{idea.description}</p>
            </CardContent>
            <CardFooter className='flex justify-between items-center'>
                <Button
                    variant='outline'
                    size='sm'
                    className='flex items-center gap-1 text-blue-700'
                >
                    <ArrowUp className='h-4 w-4' />
                    <span>{idea.upvotes}</span>
                </Button>
                <Button variant='link' size='sm' className='text-white'>
                    View Details
                </Button>
            </CardFooter>
        </Card>
    )
}
