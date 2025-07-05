import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Twitter from "next-auth/providers/twitter"
import Passkey from "next-auth/providers/passkey"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import Credentials from "./providers/credentials"
import Resend from "./providers/resend"
import { default as signInCallback } from "./callbacks/signIn"
import session from "./callbacks/session"

export const { auth, handlers, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    experimental: {
        enableWebAuthn: true,
    },
    pages: {
        signIn: "/auth/signin",
    },
    providers: [Google, Twitter, Resend, Passkey, Credentials],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        signIn: signInCallback,
        session,
    },
})
