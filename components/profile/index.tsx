"use client"

import { createContext, useContext, useEffect } from "react"
import { useRouter } from "next/navigation"
import ProfileHeader from "./profile-header"
import ProfileStats from "./profile-stats"
import { ProfileData } from "./types"
import ProfileTabs from "./profile-tabs"

interface PostProps {
    data?: ProfileData
    error?: string
    correctSlug?: string
}

const ProfileContext = createContext<ProfileData | null>(null)
export const useProfile = () => useContext(ProfileContext) as ProfileData

const Profile = ({ data, error, correctSlug }: PostProps) => {
    const router = useRouter()

    // Redirect if the slug is incorrect
    useEffect(() => {
        if (correctSlug) {
            router.replace(correctSlug)
        }
    }, [correctSlug, router])

    if (error) {
        return (
            <div className='flex flex-col items-center justify-center min-h-screen'>
                <p className='text-white text-center'>{error}</p>
            </div>
        )
    }

    if (data) {
        return (
            <ProfileContext.Provider value={data}>
                <div className='container mx-auto px-4 pt-20 pb-28'>
                    <div className='flex flex-col md:flex-row gap-2 items-center'>
                        <ProfileHeader />
                        <ProfileStats />
                    </div>
                    <ProfileTabs />
                </div>
            </ProfileContext.Provider>
        )
    }
}

export default Profile

// export type CommentsInteractions = {
//     _id: Schema.Types.ObjectId
//     type: "comment" | "reply"
//     content: string
//     post: {
//         postId: string
//         title: string
//         slug: string
//     }
//     comment?: {
//         author: {
//             name: string
//             avatar: string
//         }
//         content: string
//     }
//     createdAt: Date
// }

// export type VoteInteraction = {
//     _id: Schema.Types.ObjectId
//     type: "post" | "comment" | "reply"
//     content: string
//     author: {
//         _id: Schema.Types.ObjectId
//         name?: string
//         avatar?: string
//     }
//     comment?: ICommentPopulated
//     post: IPostPopulated
//     createdAt: Date
//     postId?: string
//     slug: string
//     title: string
// }
