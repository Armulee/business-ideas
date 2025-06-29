import {
    DefaultSession,
    DefaultUser,
} from "next-auth"

declare module "next-auth" {
    interface Session {
        user: DefaultSession["user"] & {
            id: string
            profile?: number
            profileData?: {
                _id: string
                name: string
                bio?: string
                avatar?: string
                profileId: number
            }
        }
    }

    interface User extends DefaultUser {
        id: string
        profile?: number
        profileData?: {
            _id: string
            name: string
            bio?: string
            avatar?: string
            profileId: number
        }
    }
}
