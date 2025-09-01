"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import AutoHeightTextarea from "@/components/ui/auto-height-textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

interface MainPlatformPrompts {
    purpose: string
    systemPrompt: string
    userPrompt: string
    imagePrompt?: string
}

interface SocialPlatformPrompts {
    purpose?: string
    systemPrompt: string
    userPrompt: string
    imagePrompt?: string
}

interface PlatformAccordionProps {
    platform: string
    config: {
        name: string
        icon: React.ComponentType<{ className?: string }>
        color: string
    }
    platformData: MainPlatformPrompts | SocialPlatformPrompts
    loading: boolean
    purposeOptions: string[]
    onPurposeChange: (purpose: string) => void
    onPromptChange: (platform: string, field: "systemPrompt" | "userPrompt", value: string) => void
    onSavePlatformPrompts: (platform: string) => void
    openEditDialog: (platform: string) => void
}

export default function PlatformAccordion({
    platform,
    config,
    platformData,
    loading,
    purposeOptions,
    onPurposeChange,
    onPromptChange,
    onSavePlatformPrompts,
    openEditDialog,
}: PlatformAccordionProps) {
    const Icon = config.icon

    return (
        <AccordionItem
            key={platform}
            value={platform}
            className='border-gray-700'
        >
            <AccordionTrigger className='text-white hover:text-white/80 hover:no-underline py-4'>
                <div className='flex items-center gap-3'>
                    <Icon className={`w-5 h-5 ${config.color}`} />
                    <span className='font-medium'>{config.name}</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className='pt-2 pb-6'>
                {/* For Main Platform - Show Purpose Selector and Edit Button */}
                {platform === "main" && (
                    <div className='flex items-center gap-4 mb-4'>
                        <div className='flex-1 space-y-2'>
                            <Label className='text-white text-sm font-medium'>
                                Content Purpose
                            </Label>
                            <Select
                                value={
                                    (platformData as MainPlatformPrompts)
                                        .purpose || "Introduction"
                                }
                                onValueChange={onPurposeChange}
                                disabled={loading}
                            >
                                <SelectTrigger className='select text-white'>
                                    <SelectValue placeholder='Select purpose' />
                                </SelectTrigger>
                                <SelectContent>
                                    {purposeOptions.map((option) => (
                                        <SelectItem
                                            key={option}
                                            value={option}
                                        >
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            size='sm'
                            variant='outline'
                            onClick={() => openEditDialog(platform)}
                            className='button border-white/20 text-white hover:bg-white/10'
                            disabled={loading}
                        >
                            Edit
                        </Button>
                    </div>
                )}

                {/* For Social Platforms - Show Editable System and User Prompts */}
                {platform !== "main" && (
                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <Label className='text-white text-sm font-medium'>
                                System Prompt
                            </Label>
                            <AutoHeightTextarea
                                value={platformData.systemPrompt || ""}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                    onPromptChange(
                                        platform,
                                        "systemPrompt",
                                        e.target.value
                                    )
                                }
                                placeholder='Enter system prompt for this platform...'
                                className='input'
                                disabled={loading}
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label className='text-white text-sm font-medium'>
                                User Prompt
                            </Label>
                            <AutoHeightTextarea
                                value={platformData.userPrompt || ""}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                    onPromptChange(
                                        platform,
                                        "userPrompt",
                                        e.target.value
                                    )
                                }
                                placeholder='Enter user prompt for this platform...'
                                className='input'
                                disabled={loading}
                            />
                        </div>
                        <div className='flex justify-end pt-2'>
                            <Button
                                onClick={() => onSavePlatformPrompts(platform)}
                                disabled={loading}
                                variant='outline'
                                size='sm'
                                className='button border-green-600 text-green-600 hover:bg-green-600 hover:text-white'
                            >
                                {loading ? "Saving..." : "Save Prompts"}
                            </Button>
                        </div>
                    </div>
                )}
            </AccordionContent>
        </AccordionItem>
    )
}