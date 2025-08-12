import AnimatedBackground from "@/components/partner/monetization/animated-background"
import Hero from "@/components/partner/monetization/hero"
import HowItWorks from "@/components/partner/monetization/how-it-works"
import Benefits from "@/components/partner/monetization/benefits"
import RevenueCalculator from "@/components/partner/monetization/revenue-calculator"
import PartnerForm from "@/components/partner/monetization/partner-form"
import PayoutsTrust from "@/components/partner/monetization/payouts-trust"
import FAQ from "@/components/partner/monetization/faq"
import FooterCTA from "@/components/partner/monetization/footer-cta"
import StickyBottomBar from "@/components/partner/monetization/sticky-bottom-bar"

export default function MonetizationPage() {
    return (
        <>
            {/* Animated Background Elements */}
            <AnimatedBackground />
            {/* Hero Section */}
            <Hero />
            {/* How It Works Section */}
            <HowItWorks />
            {/* Benefits Section */}
            <Benefits />
            {/* Revenue Calculator */}
            <RevenueCalculator />
            {/* Partner Application Form */}
            <PartnerForm />
            {/* Payouts & Trust */}
            <PayoutsTrust />
            {/* FAQ Section */}
            <FAQ />
            {/* Footer CTA */}
            <FooterCTA />
            {/* Sticky Bottom Bar (Mobile) */}
            <StickyBottomBar />
            {/* Add bottom padding for mobile sticky bar */}
            <div className='h-20 sm:hidden' />
        </>
    )
}
