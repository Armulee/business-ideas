"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, AlertCircle, Shield } from "lucide-react"
import type { StepProps } from "../types"

export default function PlacementPolicy({
    formData,
    errors,
    updateFormData,
}: StepProps) {
    return (
        <div className='space-y-6'>
            <div className='text-center mb-8'>
                <div className='mb-4 flex justify-center'>
                    <div className='rounded-full bg-purple-500/20 p-3'>
                        <MapPin className='h-8 w-8 text-purple-400' />
                    </div>
                </div>
                <h2 className='text-2xl font-bold text-white mb-2'>
                    Placement & Policy
                </h2>
                <p className='text-blue-100'>
                    How and where you plan to use our widget
                </p>
            </div>

            <div>
                <Label
                    htmlFor='intendedPlacement'
                    className='text-white mb-2 block'
                >
                    Intended Placement *
                </Label>
                <Textarea
                    id='intendedPlacement'
                    placeholder='Describe where you plan to place the widget (e.g., sidebar, footer, within articles, etc.)'
                    value={formData.intendedPlacement}
                    onChange={(e) =>
                        updateFormData("intendedPlacement", e.target.value)
                    }
                    className='bg-white/10 border-white/20 text-white placeholder:text-blue-200 min-h-[100px]'
                />
                {errors.intendedPlacement && (
                    <p className='text-red-400 text-sm mt-1 flex items-center gap-1'>
                        <AlertCircle className='h-3 w-3' />
                        {errors.intendedPlacement}
                    </p>
                )}
            </div>

            <div>
                <Label
                    htmlFor='brandFitNotes'
                    className='text-white mb-2 block'
                >
                    Brand Fit Notes
                    <span className='text-blue-300 text-sm ml-1'>
                        (optional)
                    </span>
                </Label>
                <Textarea
                    id='brandFitNotes'
                    placeholder='Any additional notes about how our widget fits with your brand or content strategy'
                    value={formData.brandFitNotes}
                    onChange={(e) =>
                        updateFormData("brandFitNotes", e.target.value)
                    }
                    className='bg-white/10 border-white/20 text-white placeholder:text-blue-200 min-h-[80px]'
                />
            </div>

            <div className='p-6 bg-amber-500/10 border border-amber-500/20 rounded-lg'>
                <div className='flex items-start space-x-3'>
                    <Checkbox
                        id='noDeceptivePlacement'
                        checked={formData.noDeceptivePlacement as boolean}
                        onCheckedChange={(checked) =>
                            updateFormData(
                                "noDeceptivePlacement",
                                checked as boolean
                            )
                        }
                    />
                    <div className='flex-1'>
                        <Label
                            htmlFor='noDeceptivePlacement'
                            className='text-white font-medium cursor-pointer'
                        >
                            Placement Policy Agreement *
                        </Label>
                        <p className='text-amber-200 text-sm mt-1'>
                            I agree to implement the widget with no deceptive
                            placement, no auto-click mechanisms, and no hidden
                            elements. The widget will be clearly visible and
                            accessible to users.
                        </p>
                    </div>
                </div>
                {errors.noDeceptivePlacement && (
                    <p className='text-red-400 text-sm mt-2 flex items-center gap-1'>
                        <AlertCircle className='h-3 w-3' />
                        {errors.noDeceptivePlacement}
                    </p>
                )}
            </div>

            <div className='p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg'>
                <div className='flex items-start gap-3'>
                    <div className='rounded-full bg-blue-500/20 p-1'>
                        <Shield className='h-4 w-4 text-blue-400' />
                    </div>
                    <div>
                        <h4 className='text-white font-medium mb-1'>
                            Best Practices
                        </h4>
                        <ul className='text-blue-200 text-sm space-y-1'>
                            <li>
                                • Place widgets in high-visibility areas for
                                better engagement
                            </li>
                            <li>
                                • Ensure widgets match your site&apos;s design
                                and user experience
                            </li>
                            <li>
                                • Consider mobile responsiveness and loading
                                performance
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
