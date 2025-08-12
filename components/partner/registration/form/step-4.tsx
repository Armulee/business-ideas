"use client"

import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle, Shield, AlertCircle, FileText } from "lucide-react"
import Link from "next/link"
import type { StepProps } from "../types"

export default function Declarations({
    formData,
    errors,
    updateFormData,
}: StepProps) {
    return (
        <div className='space-y-6'>
            <div className='text-center mb-8'>
                <div className='mb-4 flex justify-center'>
                    <div className='rounded-full bg-amber-500/20 p-3'>
                        <FileText className='h-8 w-8 text-amber-400' />
                    </div>
                </div>
                <h2 className='text-2xl font-bold text-white mb-2'>
                    Declarations
                </h2>
                <p className='text-blue-100'>
                    Final agreements and legal declarations
                </p>
            </div>

            <div className='space-y-6'>
                <div className='p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg'>
                    <div className='flex items-start space-x-3'>
                        <Checkbox
                            id='legalCompliance'
                            checked={formData.legalCompliance as boolean}
                            onCheckedChange={(checked) =>
                                updateFormData(
                                    "legalCompliance",
                                    checked as boolean
                                )
                            }
                        />
                        <div className='flex-1'>
                            <Label
                                htmlFor='legalCompliance'
                                className='text-white font-medium cursor-pointer'
                            >
                                Legal Compliance Declaration *
                            </Label>
                            <p className='text-blue-200 text-sm mt-1'>
                                I confirm that I comply with all applicable laws
                                and regulations in my jurisdiction, and I have
                                the legal rights to monetize the specified
                                website placement. I understand that I am
                                responsible for any legal compliance issues
                                related to my website content and monetization
                                activities.
                            </p>
                        </div>
                    </div>
                    {errors.legalCompliance && (
                        <p className='text-red-400 text-sm mt-2 flex items-center gap-1'>
                            <AlertCircle className='h-3 w-3' />
                            {errors.legalCompliance}
                        </p>
                    )}
                </div>

                <div className='p-6 bg-purple-500/10 border border-purple-500/20 rounded-lg'>
                    <div className='flex items-start space-x-3'>
                        <Checkbox
                            id='analyticsConsent'
                            checked={formData.analyticsConsent as boolean}
                            onCheckedChange={(checked) =>
                                updateFormData(
                                    "analyticsConsent",
                                    checked as boolean
                                )
                            }
                        />
                        <div className='flex-1'>
                            <Label
                                htmlFor='analyticsConsent'
                                className='text-white font-medium cursor-pointer'
                            >
                                Analytics & Anti-Fraud Consent *
                            </Label>
                            <p className='text-purple-200 text-sm mt-1'>
                                I consent to traffic-country detection and basic
                                anti-fraud analytics on my website. This
                                includes monitoring for unusual traffic
                                patterns, click fraud prevention, and geographic
                                analysis to ensure quality partnerships and
                                protect both parties from fraudulent activities.
                            </p>
                        </div>
                    </div>
                    {errors.analyticsConsent && (
                        <p className='text-red-400 text-sm mt-2 flex items-center gap-1'>
                            <AlertCircle className='h-3 w-3' />
                            {errors.analyticsConsent}
                        </p>
                    )}
                </div>

                <div className='p-6 bg-green-500/10 border border-green-500/20 rounded-lg'>
                    <div className='flex items-start space-x-3'>
                        <Checkbox
                            id='termsAgreement'
                            checked={formData.termsAgreement as boolean}
                            onCheckedChange={(checked) =>
                                updateFormData(
                                    "termsAgreement",
                                    checked as boolean
                                )
                            }
                        />
                        <div className='flex-1'>
                            <Label
                                htmlFor='termsAgreement'
                                className='text-white font-medium cursor-pointer'
                            >
                                Terms & Monetization Policy Agreement *
                            </Label>
                            <p className='text-green-200 text-sm mt-1'>
                                I agree to the{" "}
                                <Link
                                    href='/terms/partner'
                                    className='text-green-300 hover:text-green-100 underline'
                                >
                                    Partner Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link
                                    href='/policies/monetization'
                                    className='text-green-300 hover:text-green-100 underline'
                                >
                                    Monetization Policy
                                </Link>
                                . I understand the revenue sharing structure,
                                payment terms, and my obligations as a partner.
                            </p>
                        </div>
                    </div>
                    {errors.termsAgreement && (
                        <p className='text-red-400 text-sm mt-2 flex items-center gap-1'>
                            <AlertCircle className='h-3 w-3' />
                            {errors.termsAgreement}
                        </p>
                    )}
                </div>
            </div>

            <div className='p-6 bg-white/5 border border-white/10 rounded-lg'>
                <div className='flex items-start gap-3'>
                    <div className='rounded-full bg-amber-500/20 p-1'>
                        <Shield className='h-4 w-4 text-amber-400' />
                    </div>
                    <div>
                        <h4 className='text-white font-medium mb-2'>
                            What Happens Next?
                        </h4>
                        <ul className='text-blue-200 text-sm space-y-2'>
                            <li className='flex items-center gap-2'>
                                <CheckCircle className='h-3 w-3 text-green-400' />
                                We&apos;ll review your application within 2-3
                                business days
                            </li>
                            <li className='flex items-center gap-2'>
                                <CheckCircle className='h-3 w-3 text-green-400' />
                                You&apos;ll receive an email with approval
                                status and next steps
                            </li>
                            <li className='flex items-center gap-2'>
                                <CheckCircle className='h-3 w-3 text-green-400' />
                                Upon approval, you&apos;ll get access to your
                                partner dashboard
                            </li>
                            <li className='flex items-center gap-2'>
                                <CheckCircle className='h-3 w-3 text-green-400' />
                                Integration support and widget code will be
                                provided
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
