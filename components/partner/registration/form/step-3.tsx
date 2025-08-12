"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Globe, Building, CreditCard, AlertCircle, Users } from "lucide-react"
import type { StepProps } from "../types"

export default function ContactPayouts({
    formData,
    errors,
    updateFormData,
}: StepProps) {
    return (
        <div className='space-y-6'>
            <div className='text-center mb-8'>
                <div className='mb-4 flex justify-center'>
                    <div className='rounded-full bg-green-500/20 p-3'>
                        <Users className='h-8 w-8 text-green-400' />
                    </div>
                </div>
                <h2 className='text-2xl font-bold text-white mb-2'>
                    Contact & Payouts
                </h2>
                <p className='text-blue-100'>
                    Your contact information and payment preferences
                </p>
            </div>

            <div className='grid gap-6 md:grid-cols-2'>
                <div>
                    <Label
                        htmlFor='contactName'
                        className='text-white mb-2 block'
                    >
                        Contact Name *
                    </Label>
                    <Input
                        id='contactName'
                        placeholder='John Doe'
                        value={formData.contactName}
                        onChange={(e) =>
                            updateFormData("contactName", e.target.value)
                        }
                        className='bg-white/10 border-white/20 text-white placeholder:text-blue-200'
                    />
                    {errors.contactName && (
                        <p className='text-red-400 text-sm mt-1 flex items-center gap-1'>
                            <AlertCircle className='h-3 w-3' />
                            {errors.contactName}
                        </p>
                    )}
                </div>

                <div>
                    <Label
                        htmlFor='contactEmail'
                        className='text-white mb-2 block'
                    >
                        Contact Email *
                    </Label>
                    <Input
                        id='contactEmail'
                        type='email'
                        placeholder='john@example.com'
                        value={formData.contactEmail}
                        onChange={(e) =>
                            updateFormData("contactEmail", e.target.value)
                        }
                        className='bg-white/10 border-white/20 text-white placeholder:text-blue-200'
                    />
                    {errors.contactEmail && (
                        <p className='text-red-400 text-sm mt-1 flex items-center gap-1'>
                            <AlertCircle className='h-3 w-3' />
                            {errors.contactEmail}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <Label className='text-white mb-4 block'>Business Type *</Label>
                <RadioGroup
                    value={formData.businessType}
                    onValueChange={(value) =>
                        updateFormData("businessType", value)
                    }
                    className='grid gap-4 md:grid-cols-2'
                >
                    <div className='flex items-center space-x-3 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors'>
                        <RadioGroupItem value='individual' id='individual' />
                        <div className='flex-1'>
                            <Label
                                htmlFor='individual'
                                className='text-white font-medium cursor-pointer flex items-center gap-2'
                            >
                                <Users className='h-4 w-4' />
                                Individual
                            </Label>
                            <p className='text-blue-200 text-sm'>
                                Personal website or blog
                            </p>
                        </div>
                    </div>
                    <div className='flex items-center space-x-3 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors'>
                        <RadioGroupItem value='company' id='company' />
                        <div className='flex-1'>
                            <Label
                                htmlFor='company'
                                className='text-white font-medium cursor-pointer flex items-center gap-2'
                            >
                                <Building className='h-4 w-4' />
                                Company
                            </Label>
                            <p className='text-blue-200 text-sm'>
                                Business or organization
                            </p>
                        </div>
                    </div>
                </RadioGroup>
                {errors.businessType && (
                    <p className='text-red-400 text-sm mt-2 flex items-center gap-1'>
                        <AlertCircle className='h-3 w-3' />
                        {errors.businessType}
                    </p>
                )}
            </div>

            <div>
                <Label htmlFor='payoutMethod' className='text-white mb-2 block'>
                    Payout Method *
                </Label>
                <Select
                    value={formData.payoutMethod}
                    onValueChange={(value) =>
                        updateFormData("payoutMethod", value)
                    }
                >
                    <SelectTrigger className='bg-white/10 border-white/20 text-white'>
                        <SelectValue placeholder='Select your preferred payout method' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='bank'>
                            <div className='flex items-center gap-2'>
                                <CreditCard className='h-4 w-4' />
                                Bank Transfer (Thailand)
                            </div>
                        </SelectItem>
                        <SelectItem value='paypal'>
                            <div className='flex items-center gap-2'>
                                <Globe className='h-4 w-4' />
                                PayPal (International)
                            </div>
                        </SelectItem>
                        <SelectItem value='wise'>
                            <div className='flex items-center gap-2'>
                                <Building className='h-4 w-4' />
                                Wise (Multi-currency)
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
                {errors.payoutMethod && (
                    <p className='text-red-400 text-sm mt-1 flex items-center gap-1'>
                        <AlertCircle className='h-3 w-3' />
                        {errors.payoutMethod}
                    </p>
                )}
            </div>

            <div className='p-4 bg-green-500/10 border border-green-500/20 rounded-lg'>
                <div className='flex items-start gap-3'>
                    <div className='rounded-full bg-green-500/20 p-1'>
                        <CreditCard className='h-4 w-4 text-green-400' />
                    </div>
                    <div>
                        <h4 className='text-white font-medium mb-1'>
                            Payout Information
                        </h4>
                        <ul className='text-green-200 text-sm space-y-1'>
                            <li>• Monthly payouts processed on the 15th</li>
                            <li>• No minimum payout threshold</li>
                            <li>• Zero transaction fees</li>
                            <li>• Detailed payment statements provided</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
