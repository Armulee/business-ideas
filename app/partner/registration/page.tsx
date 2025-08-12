import AnimatedBackgroundElement from "@/components/partner/animated-background"
import RegistrationHeader from "@/components/partner/registration/header"
import ProtectedWrapper from "@/components/partner/registration/protected-wrapper"
import RegistrationForm from "@/components/partner/registration/registration-form"

export default function PartnerRegistrationPage() {
    return (
        <ProtectedWrapper>
            <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900'>
                <AnimatedBackgroundElement />

                <div className='relative px-4 py-12 sm:px-6 lg:px-8'>
                    <div className='mx-auto max-w-4xl'>
                        <RegistrationHeader />
                        <RegistrationForm />
                    </div>
                </div>
            </div>
        </ProtectedWrapper>
    )
}
