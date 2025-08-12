"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { FormData, initialFormData } from "./types"
import WebsiteDetails from "./form/step-1"
import PlacementPolicy from "./form/step-2"
import ContactPayouts from "./form/step-3"
import Declarations from "./form/step-4"

export default function RegistrationForm() {
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState<FormData>(initialFormData)
    const [errors, setErrors] = useState<Partial<FormData>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const totalSteps = 4
    const progress = (currentStep / totalSteps) * 100

    const updateFormData = (field: keyof FormData, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }))
        }
    }

    const validateStep = (step: number): boolean => {
        const newErrors: Partial<FormData> = {}

        switch (step) {
            case 1: // Website Details
                if (!formData.websiteUrl)
                    newErrors.websiteUrl = "Website URL is required"
                if (!formData.siteName)
                    newErrors.siteName = "Site name is required"
                if (!formData.primaryCategory)
                    newErrors.primaryCategory = "Primary category is required"
                if (!formData.embedType)
                    newErrors.embedType = "Embed type is required"
                break

            case 2: // Placement & Policy
                if (!formData.intendedPlacement)
                    newErrors.intendedPlacement =
                        "Intended placement is required"
                if (!formData.noDeceptivePlacement)
                    newErrors.noDeceptivePlacement =
                        "This agreement is required"
                break

            case 3: // Contact & Payouts
                if (!formData.contactName)
                    newErrors.contactName = "Contact name is required"
                if (!formData.contactEmail)
                    newErrors.contactEmail = "Contact email is required"
                if (!formData.businessType)
                    newErrors.businessType = "Business type is required"
                if (!formData.payoutMethod)
                    newErrors.payoutMethod = "Payout method is required"
                break

            case 4: // Declarations
                if (!formData.legalCompliance)
                    newErrors.legalCompliance = "Legal compliance is required"
                if (!formData.analyticsConsent)
                    newErrors.analyticsConsent = "Analytics consent is required"
                if (!formData.termsAgreement)
                    newErrors.termsAgreement = "Terms agreement is required"
                break
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
        }
    }

    const handlePrevious = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1))
    }

    const handleSubmit = async () => {
        if (!validateStep(currentStep)) return

        setIsSubmitting(true)

        // Simulate API call
        await new Promise((resolve) =>
            setTimeout(() => {
                console.log(formData)
                return resolve
            }, 2000)
        )

        toast.success("Application Submitted Successfully! 🎉", {
            description:
                "We'll review your application within 2-3 business days and send you an email with next steps.",
        })

        setIsSubmitting(false)
        // Reset form or redirect
        setFormData(initialFormData)
        setCurrentStep(1)
    }

    const renderStepContent = () => {
        const stepProps = { formData, errors, updateFormData }

        switch (currentStep) {
            case 1:
                return <WebsiteDetails {...stepProps} />
            case 2:
                return <PlacementPolicy {...stepProps} />
            case 3:
                return <ContactPayouts {...stepProps} />
            case 4:
                return <Declarations {...stepProps} />
            default:
                return null
        }
    }

    return (
        <div className='space-y-8'>
            {/* Progress Bar */}
            <div>
                <div className='flex justify-between items-center mb-4'>
                    <div className='flex items-center gap-2'>
                        <Badge
                            variant='secondary'
                            className='bg-blue-500/20 text-blue-300'
                        >
                            Step {currentStep} of {totalSteps}
                        </Badge>
                    </div>
                    <div className='text-sm text-blue-200'>
                        {Math.round(progress)}% Complete
                    </div>
                </div>
                <Progress value={progress} className='h-2 bg-white/10' />
            </div>

            {/* Form Card */}
            <Card className='bg-white/10 backdrop-blur-lg border-white/20'>
                <CardContent className='p-8'>
                    {renderStepContent()}

                    {/* Navigation Buttons */}
                    <div className='flex justify-between items-center mt-8 pt-6 border-t border-white/10'>
                        <Button
                            variant='outline'
                            onClick={handlePrevious}
                            disabled={currentStep === 1}
                            className='border-white/20 text-white hover:bg-white/10 bg-transparent'
                        >
                            <ArrowLeft className='mr-2 h-4 w-4' />
                            Previous
                        </Button>

                        {currentStep < totalSteps ? (
                            <Button
                                onClick={handleNext}
                                className='bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'
                            >
                                Next Step
                                <ArrowRight className='ml-2 h-4 w-4' />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className='bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className='mr-2 h-4 w-4' />
                                        Submit Application
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Help Section */}
            <div className='text-center'>
                <p className='text-blue-200 text-sm'>
                    Need help with your application?{" "}
                    <Link
                        href='/support'
                        className='text-blue-300 hover:text-blue-100 underline'
                    >
                        Contact our support team
                    </Link>{" "}
                    or{" "}
                    <Link
                        href='/partner/faq'
                        className='text-blue-300 hover:text-blue-100 underline'
                    >
                        view our FAQ
                    </Link>
                </p>
            </div>
        </div>
    )
}
