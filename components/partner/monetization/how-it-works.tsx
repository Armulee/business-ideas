import { Card, CardContent } from "@/components/ui/card"
import { Code, MessageSquare, DollarSign } from "lucide-react"

const steps = [
    {
        icon: Code,
        title: "Add Our Widget",
        description:
            "Integrate our lightweight feedback widget with just one line of code. Works with any website or CMS.",
    },
    {
        icon: MessageSquare,
        title: " Engage Your Visitors",
        description:
            "Your visitors provide valuable feedback to entrepreneurs, creating meaningful engagement on your site.",
    },
    {
        icon: DollarSign,
        title: "Earn Automatically",
        description:
            "Receive 60% of all revenue generated through your widget. Payments processed monthly, no minimum.",
    },
]

export default function HowItWorks() {
    return (
        <section className='relative mt-16 px-4 sm:px-6 lg:px-8'>
            <div className='mx-auto max-w-6xl'>
                <div className='text-center'>
                    <h2 className='mb-4 text-3xl font-bold text-white'>
                        How Our Partner Program Works
                    </h2>
                    <p className='text-blue-100'>
                        Three simple steps to start earning
                    </p>
                </div>

                <div className='grid gap-8 md:grid-cols-3 mt-6'>
                    {steps.map((step, index) => (
                        <div key={`step-${index + 1}`} className='relative'>
                            <Card className='glassmorphism bg-transparent text-white h-full hover:bg-white/15 transition-all duration-500'>
                                <CardContent className='p-8 text-center'>
                                    <div className='mb-6 flex justify-center'>
                                        <div className='relative'>
                                            <div className='absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-lg opacity-75 animate-pulse' />
                                            <div className='relative rounded-full glassmorphism !rounded-full p-4'>
                                                <step.icon className='h-10 w-10 text-white' />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold'>
                                        {index + 1}
                                    </div>
                                    <h4 className='mb-4 text-2xl font-semibold'>
                                        {step.title}
                                    </h4>
                                    <p className='text-blue-100 leading-relaxed'>
                                        {step.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}