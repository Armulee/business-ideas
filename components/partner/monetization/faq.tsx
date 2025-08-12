import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"

export default function FAQ() {
    return (
        <section className='relative px-4 py-20 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm'>
            <div className='mx-auto max-w-3xl'>
                <div className='text-center mb-16'>
                    <h2 className='mb-4 text-4xl font-bold text-white'>
                        Frequently Asked Questions
                    </h2>
                    <p className='text-xl text-blue-100'>
                        Everything you need to know about our partner
                        program
                    </p>
                </div>

                <Accordion
                    type='single'
                    collapsible
                    className='w-full space-y-4'
                >
                    <AccordionItem
                        value='revenue-share'
                        className='bg-white/10 backdrop-blur-lg border-white/20 rounded-lg px-6'
                    >
                        <AccordionTrigger className='text-left text-white hover:text-blue-200'>
                            <div className='flex items-center gap-2'>
                                What&apos;s the revenue share for partners?
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <HelpCircle className='h-4 w-4' />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                Partners earn 60% of revenue
                                                generated from their widget
                                                interactions
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className='text-blue-100'>
                            Partners receive 60% of all revenue generated
                            through their embedded widgets. This includes
                            feedback submissions, premium feature usage, and
                            ad interactions from your website visitors. The
                            remaining 40% covers our platform costs and
                            continued development.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                        value='payouts'
                        className='bg-white/10 backdrop-blur-lg border-white/20 rounded-lg px-6'
                    >
                        <AccordionTrigger className='text-left text-white hover:text-blue-200'>
                            How and when do I get paid?
                        </AccordionTrigger>
                        <AccordionContent className='text-blue-100'>
                            We process payouts monthly on the 15th via your
                            preferred payment method (bank transfer,
                            PromptPay, or international wire). There&apos;s
                            no minimum payout threshold, and we don&apos;t
                            charge any transaction fees. All earnings are
                            tracked in real-time in your partner dashboard.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                        value='widget-setup'
                        className='bg-white/10 backdrop-blur-lg border-white/20 rounded-lg px-6'
                    >
                        <AccordionTrigger className='text-left text-white hover:text-blue-200'>
                            How easy is widget setup?
                        </AccordionTrigger>
                        <AccordionContent className='text-blue-100'>
                            Super easy! Just copy and paste one line of
                            JavaScript code into your website. We provide
                            detailed integration guides for WordPress,
                            Shopify, Wix, and custom websites. Most partners
                            are up and running in under 5 minutes. Our
                            support team is also available to help with any
                            technical questions.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                        value='requirements'
                        className='bg-white/10 backdrop-blur-lg border-white/20 rounded-lg px-6'
                    >
                        <AccordionTrigger className='text-left text-white hover:text-blue-200'>
                            What are the requirements to become a partner?
                        </AccordionTrigger>
                        <AccordionContent className='text-blue-100'>
                            We welcome websites of all sizes! There&apos;s
                            no minimum traffic requirement, but we do review
                            applications to ensure content quality and
                            relevance. We accept websites in business,
                            technology, entrepreneurship, and related
                            niches. Adult content, gambling, and illegal
                            activities are not permitted.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                        value='performance'
                        className='bg-white/10 backdrop-blur-lg border-white/20 rounded-lg px-6'
                    >
                        <AccordionTrigger className='text-left text-white hover:text-blue-200'>
                            How does the widget affect my website
                            performance?
                        </AccordionTrigger>
                        <AccordionContent className='text-blue-100'>
                            Our widget is designed to be lightweight and
                            fast. It loads asynchronously, so it won&apos;t
                            slow down your website. The entire widget is
                            less than 50KB and uses modern optimization
                            techniques. We also provide customization
                            options to match your website&apos;s design and
                            user experience.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                        value='support'
                        className='bg-white/10 backdrop-blur-lg border-white/20 rounded-lg px-6'
                    >
                        <AccordionTrigger className='text-left text-white hover:text-blue-200'>
                            What kind of support do partners receive?
                        </AccordionTrigger>
                        <AccordionContent className='text-blue-100'>
                            All partners get access to our dedicated partner
                            success team, comprehensive documentation, and
                            priority email support. We also provide regular
                            performance reports, optimization tips, and
                            early access to new stats. Our average response
                            time is under 4 hours during business days.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem
                        value='customization'
                        className='bg-white/10 backdrop-blur-lg border-white/20 rounded-lg px-6'
                    >
                        <AccordionTrigger className='text-left text-white hover:text-blue-200'>
                            Can I customize the widget appearance?
                        </AccordionTrigger>
                        <AccordionContent className='text-blue-100'>
                            Yes! Our widget is fully customizable to match
                            your website&apos;s branding. You can adjust
                            colors, fonts, positioning, and even the
                            widget&apos;s behavior. We also offer
                            white-label options for high-traffic partners
                            who want to maintain their brand identity
                            completely.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </section>
    )
}