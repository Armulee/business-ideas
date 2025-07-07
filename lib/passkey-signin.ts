import { signIn as passkeySignIn } from "next-auth/webauthn"

export const signIn: (
    provider: string,
    options?: { action?: string; redirect?: false; callbackUrl?: string }
) => Promise<undefined | { error: "Abort" | "Error" }> = async (
    provider,
    options = {}
) => {
    try {
        // Auto sign in with passkey
        await passkeySignIn(provider, {
            ...options,
        })
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
