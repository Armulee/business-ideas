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
import { Globe, AlertCircle, Code, Monitor } from "lucide-react"
import type { StepProps } from "../types"

export default function WebsiteDetails({
    formData,
    errors,
    updateFormData,
}: StepProps) {
    return (
        <div className='space-y-6'>
            <div className='text-center mb-8'>
                <div className='mb-4 flex justify-center'>
                    <div className='rounded-full bg-blue-500/20 p-3'>
                        <Globe className='h-8 w-8 text-blue-400' />
                    </div>
                </div>
                <h2 className='text-2xl font-bold text-white mb-2'>
                    Website Details
                </h2>
                <p className='text-blue-100'>
                    Tell us about your website and technical setup
                </p>
            </div>

            <div className='grid gap-6 md:grid-cols-2'>
                <div>
                    <Label
                        htmlFor='websiteUrl'
                        className='text-white mb-2 block'
                    >
                        Website URL *
                    </Label>
                    <Input
                        id='websiteUrl'
                        placeholder='https://yourwebsite.com'
                        value={formData.websiteUrl}
                        onChange={(e) =>
                            updateFormData("websiteUrl", e.target.value)
                        }
                        className='bg-white/10 border-white/20 text-white placeholder:text-blue-200'
                    />
                    {errors.websiteUrl && (
                        <p className='text-red-400 text-sm mt-1 flex items-center gap-1'>
                            <AlertCircle className='h-3 w-3' />
                            {errors.websiteUrl}
                        </p>
                    )}
                </div>

                <div>
                    <Label htmlFor='siteName' className='text-white mb-2 block'>
                        Site Name *
                    </Label>
                    <Input
                        id='siteName'
                        placeholder='My Awesome Blog'
                        value={formData.siteName}
                        onChange={(e) =>
                            updateFormData("siteName", e.target.value)
                        }
                        className='bg-white/10 border-white/20 text-white placeholder:text-blue-200'
                    />
                    {errors.siteName && (
                        <p className='text-red-400 text-sm mt-1 flex items-center gap-1'>
                            <AlertCircle className='h-3 w-3' />
                            {errors.siteName}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <Label
                    htmlFor='primaryCategory'
                    className='text-white mb-2 block'
                >
                    Primary Category *
                </Label>
                <Select
                    value={formData.primaryCategory}
                    onValueChange={(value) =>
                        updateFormData("primaryCategory", value)
                    }
                >
                    <SelectTrigger className='bg-white/10 border-white/20 text-white'>
                        <SelectValue placeholder='Select your website category' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='technology'>Technology</SelectItem>
                        <SelectItem value='business'>Business</SelectItem>
                        <SelectItem value='entrepreneurship'>
                            Entrepreneurship
                        </SelectItem>
                        <SelectItem value='startup'>Startup</SelectItem>
                        <SelectItem value='finance'>Finance</SelectItem>
                        <SelectItem value='marketing'>Marketing</SelectItem>
                        <SelectItem value='productivity'>
                            Productivity
                        </SelectItem>
                        <SelectItem value='education'>Education</SelectItem>
                        <SelectItem value='news'>News & Media</SelectItem>
                        <SelectItem value='other'>Other</SelectItem>
                    </SelectContent>
                </Select>
                {errors.primaryCategory && (
                    <p className='text-red-400 text-sm mt-1 flex items-center gap-1'>
                        <AlertCircle className='h-3 w-3' />
                        {errors.primaryCategory}
                    </p>
                )}
            </div>

            <div className='grid gap-6 md:grid-cols-2'>
                <div>
                    <Label
                        htmlFor='audienceRegions'
                        className='text-white mb-2 block'
                    >
                        Audience Regions *
                    </Label>
                    <Input
                        id='audienceRegions'
                        placeholder='e.g., Thailand, Southeast Asia, Global'
                        value={formData.audienceRegions}
                        onChange={(e) =>
                            updateFormData("audienceRegions", e.target.value)
                        }
                        className='bg-white/10 border-white/20 text-white placeholder:text-blue-200'
                    />
                </div>

                <div>
                    <Label
                        htmlFor='monthlyPageviews'
                        className='text-white mb-2 block'
                    >
                        Monthly Pageviews *
                    </Label>
                    <Select
                        value={formData.monthlyPageviews}
                        onValueChange={(value) =>
                            updateFormData("monthlyPageviews", value)
                        }
                    >
                        <SelectTrigger className='bg-white/10 border-white/20 text-white'>
                            <SelectValue placeholder='Select range' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='under-1k'>
                                Under 1,000
                            </SelectItem>
                            <SelectItem value='1k-10k'>
                                1,000 - 10,000
                            </SelectItem>
                            <SelectItem value='10k-50k'>
                                10,000 - 50,000
                            </SelectItem>
                            <SelectItem value='50k-100k'>
                                50,000 - 100,000
                            </SelectItem>
                            <SelectItem value='100k-500k'>
                                100,000 - 500,000
                            </SelectItem>
                            <SelectItem value='500k-1m'>
                                500,000 - 1,000,000
                            </SelectItem>
                            <SelectItem value='over-1m'>
                                Over 1,000,000
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div>
                <Label htmlFor='platformCms' className='text-white mb-2 block'>
                    Platform/CMS
                    <span className='text-blue-300 text-sm ml-1'>
                        (optional)
                    </span>
                </Label>
                <Select
                    value={formData.platformCms}
                    onValueChange={(value) =>
                        updateFormData("platformCms", value)
                    }
                >
                    <SelectTrigger className='bg-white/10 border-white/20 text-white'>
                        <SelectValue placeholder='Select your platform' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='wordpress'>WordPress</SelectItem>
                        <SelectItem value='shopify'>Shopify</SelectItem>
                        <SelectItem value='wix'>Wix</SelectItem>
                        <SelectItem value='squarespace'>Squarespace</SelectItem>
                        <SelectItem value='webflow'>Webflow</SelectItem>
                        <SelectItem value='nextjs'>Next.js</SelectItem>
                        <SelectItem value='react'>React</SelectItem>
                        <SelectItem value='vue'>Vue.js</SelectItem>
                        <SelectItem value='custom'>Custom HTML/CSS</SelectItem>
                        <SelectItem value='other'>Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label className='text-white mb-4 block'>
                    Preferred Embed Type *
                </Label>
                <RadioGroup
                    value={formData.embedType}
                    onValueChange={(value) =>
                        updateFormData("embedType", value)
                    }
                    className='grid gap-4 md:grid-cols-2'
                >
                    <div className='flex items-center space-x-3 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors'>
                        <RadioGroupItem value='iframe' id='iframe' />
                        <div className='flex-1'>
                            <Label
                                htmlFor='iframe'
                                className='text-white font-medium cursor-pointer flex items-center gap-2'
                            >
                                <Monitor className='h-4 w-4' />
                                Iframe Embed
                            </Label>
                            <p className='text-blue-200 text-sm'>
                                Easy to implement, works everywhere
                            </p>
                        </div>
                    </div>
                    <div className='flex items-center space-x-3 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors'>
                        <RadioGroupItem value='js-sdk' id='js-sdk' />
                        <div className='flex-1'>
                            <Label
                                htmlFor='js-sdk'
                                className='text-white font-medium cursor-pointer flex items-center gap-2'
                            >
                                <Code className='h-4 w-4' />
                                JavaScript SDK
                            </Label>
                            <p className='text-blue-200 text-sm'>
                                More customization options
                            </p>
                        </div>
                    </div>
                </RadioGroup>
                {errors.embedType && (
                    <p className='text-red-400 text-sm mt-2 flex items-center gap-1'>
                        <AlertCircle className='h-3 w-3' />
                        {errors.embedType}
                    </p>
                )}
            </div>
        </div>
    )
}
