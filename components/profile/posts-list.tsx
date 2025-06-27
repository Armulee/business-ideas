"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import PostCard from "../post-card"
import { useProfile } from "."

export default function PostsList({
    type,
}: {
    type: "reposts" | "bookmarks" | "posts"
}) {
    const { activities } = useProfile()
    const { bookmarks, reposts, posts } = activities

    const router = useRouter()
    if (
        (type === "posts" && !posts?.length) ||
        (type === "reposts" && !reposts?.length) ||
        (type === "bookmarks" && !bookmarks?.length)
    ) {
        return (
            <div className='text-center py-12 text-gray-300'>
                <p className='text-xl'>No {type} to display</p>
                {type === "posts" && (
                    <Button
                        className='button mt-4'
                        onClick={() => router.push("/new-post/new-ideas")}
                    >
                        Create your first post
                    </Button>
                )}
                {(type === "reposts" || type === "bookmarks") && (
                    <Button
                        className='button mt-4'
                        onClick={() => router.push("/posts")}
                    >
                        Explore ideas
                    </Button>
                )}
            </div>
        )
    }

    return (
        <div className='space-y-6 mb-6'>
            {posts?.map((post) => (
                <PostCard key={post._id.toString()} post={post} />
            ))}
        </div>
    )
}

//  ;<Card
//      key={post._id.toString()}
//      className='bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg hover:shadow-lg transition-shadow duration-300 cursor-pointer'
//      onClick={() => router.push(`/post/${post.id}`)}
//  >
//      <CardHeader>
//          <div className='flex justify-between items-start'>
//              <div>
//                  <CardTitle className='text-white'>{post.title}</CardTitle>
//                  <div className='flex items-center mt-2'>
//                      <Badge variant='secondary' className='mr-2'>
//                          {post.category}
//                      </Badge>
//                      <span className='text-sm text-gray-300'>
//                          {formatDate(post.createdAt)}
//                      </span>
//                  </div>
//              </div>
//              <Button
//                  variant='ghost'
//                  size='sm'
//                  className='text-white'
//                  onClick={(e) => e.stopPropagation()}
//              >
//                  <ArrowUp className='mr-2 h-4 w-4' />
//                  {post.upvotes.length}
//              </Button>
//          </div>
//      </CardHeader>
//      <CardContent>
//          <CardDescription className='text-gray-200'>
//              {post.description}
//          </CardDescription>
//      </CardContent>
//      <CardFooter className='flex justify-between'>
//          {/* <Button
//                                 variant='ghost'
//                                 size='sm'
//                                 className='text-gray-300'
//                                 onClick={(e) => e.stopPropagation()}
//                             >
//                                 <MessageSquare className='mr-2 h-4 w-4' />
//                                 {post.comments} Comments
//                             </Button> */}
//          <div className='flex space-x-2'>
//              <Button
//                  variant='ghost'
//                  size='sm'
//                  className='text-gray-300'
//                  onClick={(e) => e.stopPropagation()}
//              >
//                  <Share2 className='mr-2 h-4 w-4' />
//                  Share
//              </Button>
//          </div>
//      </CardFooter>
//  </Card>
