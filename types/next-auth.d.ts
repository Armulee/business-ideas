import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: DefaultSession["user"] & {
            id: string
            profile?: number
            role?: 'user' | 'moderator' | 'admin'
        }
    }

    interface User extends DefaultUser {
        id: string
        profile?: number
        role?: 'user' | 'moderator' | 'admin'
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        sub: string
    }
}
