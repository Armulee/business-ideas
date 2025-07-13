import { default as GoogleProvider } from "next-auth/providers/google"

export default function Google() {
    return GoogleProvider({
        authorization: {
            params: {
                prompt: "select_account",
                access_type: "offline",
                response_type: "code",
            },
        },
    })
}
