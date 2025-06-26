import { IPostPopulated } from "@/database/Post"
import { IProfile } from "@/database/Profile"
import { Types } from "mongoose"

export type Interaction = {
    _id: string
    targetType: "Post" | "Comment" | "Reply"
    createdAt: Date
    postLink: string
    title?: string
    content?: string // only present on Comment & Reply
    author: {
        _id: Types.ObjectId
        name: string
        avatar: string
    }
    post: {
        _id: string
        title: string
    }
}

interface Discussions {
    _id: string
    type: "comment" | "reply"
    content: string
    createdAt: Date
    postLink: string
    postTitle: string
    post: {
        title: string
    }
    author: {
        name: string
        avatar: string
    }
}

export type Activities = {
    posts: IPostPopulated[]
    discusses: { comments: Discussions[]; replies: Discussions[] }
    reposts: IPostPopulated[]
    upvotes: Interaction[]
    downvotes: Interaction[]
    bookmarks: IPostPopulated[]
}

export type ProfileData = {
    profile: IProfile
    followings: Pick<IProfile, "name" | "profileId" | "avatar" | "_id">[]
    followers: Pick<IProfile, "name" | "profileId" | "avatar" | "_id">[]
    activities: Activities
}
