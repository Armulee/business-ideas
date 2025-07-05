import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: DefaultSession["user"] & {
            id: string
            profile?: number
        }
    }

    interface User extends DefaultUser {
        id: string
        profile?: number
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        sub: string
    }
}
