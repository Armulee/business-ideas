import {
    DefaultSession,
    DefaultUser,
    // DefaultJWT
} from "next-auth"

declare module "next-auth" {
    interface Session {
        user: DefaultSession["user"] & {
            id: string // ✅ Add `id` field
            profile: number
        }
    }

    interface User extends DefaultUser {
        id: string // ✅ Extend User with ID
        profile: number
    }
}
