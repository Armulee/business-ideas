"use server"

import { signIn } from "@/auth"

export async function serverSignIn(provider: string, { ...authOptions }) {
    return await signIn(provider, { ...authOptions })
}
