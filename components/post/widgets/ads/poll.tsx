import { Card, CardHeader } from "@/components/ui/card"
import { IPostPopulated } from "@/database/Post"

export default function Poll({ post }: { post: IPostPopulated }) {
    return (
        <Card>
            <CardHeader>{post.title}</CardHeader>
            <div>{post.content}</div>
        </Card>
    )
}
