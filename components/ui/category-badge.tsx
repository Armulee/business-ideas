import { IPostPopulated } from "@/database/Post"
import { Badge } from "./badge"

const CategoryBadge = ({ post }: { post: IPostPopulated | undefined }) => {
    return (
        <>
            {post && (
                <div className='flex items-center gap-2'>
                    <Badge
                        className={`text-xs ${
                            post.community === "new-ideas"
                                ? "text-white bg-blue-600"
                                : post.community === "exisitng-businesses"
                                ? "text-white bg-yellow-600"
                                : post.community === "pain-points"
                                ? "text-white bg-red-600"
                                : ""
                        } w-fit cursor-pointer hover:bg-blue-600`}
                    >
                        {post.community === "new-ideas"
                            ? "New Ideas"
                            : post.community === "exisitng-businesses"
                            ? "Existing Businesses"
                            : post.community === "pain-points"
                            ? "Pain Points"
                            : ""}
                    </Badge>{" "}
                    /
                    <Badge className='text-xs text-blue-600 bg-white w-fit cursor-pointer hover:bg-white'>
                        {post.category}
                    </Badge>
                </div>
            )}
        </>
    )
}

export default CategoryBadge
