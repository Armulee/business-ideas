import { ICommentPopulated } from "@/database/Comment"
import { IPostPopulated } from "@/database/Post"
import { IProfile } from "@/database/Profile"
import { IReplyPopulated } from "@/database/Reply"
import { WidgetType } from "@/database/Widget"

export interface PostData {
    post: IPostPopulated | undefined
    comments: ICommentPopulated[] | undefined
    replies: Record<string, IReplyPopulated[]> | undefined
    widgets: WidgetType[] | undefined
    profile?: IProfile | undefined
}

export interface PostDataContextType extends PostData {
    engagements: Engagements
    isEditing: boolean
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
    showButton: boolean
    setShowButton: React.Dispatch<React.SetStateAction<boolean>>
}

export interface EngagementMap {
    upvote: boolean
    downvote: boolean
    bookmark?: boolean
    repost?: boolean
}

export type Engagements = {
    post: EngagementMap
    comments: Record<string, EngagementMap>
    replies: Record<string, EngagementMap>
} | null
