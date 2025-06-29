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
    return await authSignIn(provider, authOptions)
}
