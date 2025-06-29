"use server"

import { signIn as authSignIn } from "@/auth"

export async function signIn(
    provider: string,
    authOptions?:
        | FormData
        | ({
              redirectTo?: string
              redirect?: true | undefined
          } & Record<string, string>)
        | undefined
) {
    try {
        await authSignIn(provider, authOptions)
    } catch (error) {
        console.error(error)
    }
}
