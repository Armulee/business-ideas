import { signIn } from "next-auth/webauthn"

export const passkeySignIn: (callbackUrl?: string) => Promise<
    undefined | { error: "Abort" | "Error" }
> = async (callbackUrl = "/") => {
    try {
        // Auto sign in with passkey
        await signIn("passkey", { callbackUrl })
    } catch (err: unknown) {
        const error = err as Error
        // Detect cancellation — WebAuthn errors are often DOMException
        const isAbort =
            error.name === "AbortError" ||
            error.name === "NotAllowedError" || // most common
            error.message?.includes("cancelled") ||
            error.message?.includes("not allowed")

        if (isAbort) {
            return { error: "Abort" }
        } else {
            return { error: "Error" }
        }
    }
}
