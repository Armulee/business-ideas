import { default as GoogleProvider } from "next-auth/providers/google"

export default function Google() {
    return GoogleProvider({
        authorization: {
            params: {
                prompt: "consent",
                scope: "openid email profile",
            },
        },
    })
}
