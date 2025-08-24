import { Suspense } from "react"
import Loading from "@/components/loading"
import { MagicLinkProvider } from "@/components/auth/signin/magic-link/context"
import SignIn from "@/components/auth/signin"

export default function SignInPage() {
    return (
        <div className='max-w-sm mx-auto'>
            <Suspense fallback={<Loading />}>
                <MagicLinkProvider>
                    <SignIn />
                </MagicLinkProvider>
            </Suspense>
        </div>
    )
}
