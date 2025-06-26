import { createContext, ReactNode, useContext } from "react"
import { ProfileData } from "./types"

// Context definition
// interface ProfileContextType {
//     profile: IProfile
//     followings: Pick<IProfile, "name" | "profileId" | "_id">[]
//     followers: Pick<IProfile, "name" | "profileId" | "_id">[]
//     activities: Activities
// }

const ProfileContext = createContext<ProfileData | undefined>(undefined)

export const useProfile = (): ProfileData => {
    const context = useContext(ProfileContext)
    if (!context) {
        throw new Error("useProfileContext must be used within ProfileProvider")
    }
    return context
}

// Provider component
interface ProfileProviderProps {
    children: ReactNode
    data: ProfileData
}

export default function ProfileProvider({
    children,
    data,
}: ProfileProviderProps) {
    const { profile, followings, followers, activities } = data
    return (
        <ProfileContext.Provider
            value={{ profile, followings, followers, activities }}
        >
            {children}
        </ProfileContext.Provider>
    )
}
