"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ProfileHeader from "./profile-header"
import ProfileStats from "./profile-stats"
import {
    ProfileData,
    ProfileStats as ProfileStatsType,
    Activities,
} from "./types"
import ProfileTabs from "./profile-tabs"
import { ProfileSkeleton } from "../skeletons"
import axios from "axios"

interface PostProps {
    data?: ProfileData
    initialData?: Partial<ProfileData>
    profileId?: string
    error?: string
    correctSlug?: string
}

const ProfileContext = createContext<ProfileData | null>(null)
export const useProfile = () => {
    const context = useContext(ProfileContext)
    if (!context) {
        throw new Error("useProfile must be used within ProfileContext")
    }
    return context
}

const Profile = ({
    data,
    initialData,
    profileId,
    error,
    correctSlug,
}: PostProps) => {
    const router = useRouter()
    const [statsLoaded, setStatsLoaded] = useState(false)
    const [activitiesLoaded, setActivitiesLoaded] = useState(false)
    const [statsData, setStatsData] = useState<ProfileStatsType | undefined>(
        undefined
    )
    const [activitiesData, setActivitiesData] = useState<
        Activities | undefined
    >(undefined)

    // Use initial data if provided, otherwise fall back to full data
    const profileData = data || {
        ...initialData,
        stats: statsData,
        activities: activitiesData || {
            posts: [],
            discusses: { comments: [], replies: [] },
            reposts: [],
            upvotes: [],
            downvotes: [],
            bookmarks: [],
        },
    }

    // Load stats separately if we have initial data but no stats
    useEffect(() => {
        if (profileData?.profile && profileId && !statsLoaded && !data) {
            const loadStats = async () => {
                try {
                    const response = await axios.get(
                        `/api/profile/${profileId}/stats`
                    )
                    setStatsData(response.data)
                    setStatsLoaded(true)
                } catch (error) {
                    console.error("Failed to load profile stats:", error)
                    setStatsLoaded(true)
                }
            }
            loadStats()
        }
    }, [profileData?.profile, profileId, statsLoaded, data])

    // Load activities separately if we have initial data but no activities
    useEffect(() => {
        if (profileData?.profile && profileId && !activitiesLoaded && !data) {
            const loadActivities = async () => {
                try {
                    const response = await axios.get(
                        `/api/profile/${profileId}/activities`
                    )
                    setActivitiesData(response.data)
                    setActivitiesLoaded(true)
                } catch (error) {
                    console.error("Failed to load profile activities:", error)
                    setActivitiesLoaded(true)
                }
            }
            loadActivities()
        }
    }, [profileData?.profile, profileId, activitiesLoaded, data])

    // Redirect if the slug is incorrect
    useEffect(() => {
        if (correctSlug) {
            router.replace(correctSlug)
        }
    }, [correctSlug, router])

    // Show skeleton while loading initial data
    if (!profileData?.profile && !error && !correctSlug) {
        return <ProfileSkeleton />
    }

    if (error) {
        return (
            <div className='flex flex-col items-center justify-center min-h-screen'>
                <p className='text-white text-center'>{error}</p>
            </div>
        )
    }

    if (profileData?.profile) {
        // Ensure we have a complete ProfileData object
        const completeProfileData: ProfileData = {
            profile: profileData.profile,
            followings: profileData.followings || [],
            followers: profileData.followers || [],
            stats: profileData.stats,
            activities: profileData.activities || {
                posts: [],
                discusses: { comments: [], replies: [] },
                reposts: [],
                upvotes: [],
                downvotes: [],
                bookmarks: [],
            },
            activitiesLoaded: data ? true : activitiesLoaded,
            statsLoaded: data ? true : statsLoaded,
        }

        return (
            <ProfileContext.Provider value={completeProfileData}>
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
