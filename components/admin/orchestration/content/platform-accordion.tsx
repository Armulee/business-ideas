"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
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
import { FaLinkedin, FaMeta, FaXTwitter } from "react-icons/fa6"
import { Flame } from "lucide-react"
import { OrchestrationData, MainPlatformPrompts } from "./types"

interface PlatformAccordionProps {
    data: OrchestrationData
    loading: boolean
    onPurposeChange: (purpose: string) => void
    onPromptChange: (
        platform: string,
        field: "systemPrompt" | "userPrompt",
        value: string
    ) => void
    onSavePlatformPrompts: (platform: string) => void
    onOpenEditDialog: (platform: string) => void
}

const purposeOptions = [
    "Introduction",
    "Bring Awareness",
    "Case Study",
    "Advertisement",
]

const platformConfig = {
    main: {
        name: "Main Platform",
        icon: Flame,
        color: "text-blue-500",
    },
    linkedin: {
        name: "LinkedIn",
        icon: FaLinkedin,
        color: "text-blue-500",
    },
    x: { name: "X (Twitter)", icon: FaXTwitter, color: "text-white" },
    meta: { name: "Meta (Facebook)", icon: FaMeta, color: "text-blue-500" },
}

export default function PlatformAccordion({
    data,
    loading,
    onPurposeChange,
    onPromptChange,
    onSavePlatformPrompts,
    onOpenEditDialog,
}: PlatformAccordionProps) {
    return (
        <Accordion type='single' collapsible className='w-full'>
            {Object.entries(platformConfig).map(([platform, config]) => {
                const Icon = config.icon
                const platformData = data[platform as keyof OrchestrationData]

                return (
                    <AccordionItem
                        key={platform}
                        value={platform}
                        className='border-gray-700'
                    >
                        <AccordionTrigger className='text-white hover:text-white/80 hover:no-underline'>
                            <div className='flex items-center gap-3'>
                                <Icon className={`w-5 h-5 ${config.color}`} />
                                <span className='font-semibold'>
                                    {config.name}
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className='space-y-4 pt-4 glassmorphism bg-black/30 p-6 mb-6'>
                            {/* Purpose Section - Only for Main Platform */}
                            {platform === "main" && (
                                <div className='flex justify-between items-end'>
                                    <div className='space-y-2 flex-1 mr-4'>
                                        <Label className='text-white text-sm font-medium'>
                                            Content Purpose
                                        </Label>
                                        <Select
                                            value={
                                                (
                                                    platformData as MainPlatformPrompts
                                                ).purpose || "Introduction"
                                            }
                                            onValueChange={onPurposeChange}
                                            disabled={loading}
                                        >
                                            <SelectTrigger className='select text-white'>
                                                <SelectValue placeholder='Select purpose' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {purposeOptions.map(
                                                    (option) => (
                                                        <SelectItem
                                                            key={option}
                                                            value={option}
                                                        >
                                                            {option}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button
                                        size='sm'
                                        variant='outline'
                                        onClick={() =>
                                            onOpenEditDialog(platform)
                                        }
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
                                            value={
                                                platformData.systemPrompt || ""
                                            }
                                            onChange={(
                                                e: React.ChangeEvent<HTMLTextAreaElement>
                                            ) =>
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
                                            value={
                                                platformData.userPrompt || ""
                                            }
                                            onChange={(
                                                e: React.ChangeEvent<HTMLTextAreaElement>
                                            ) =>
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
                                            onClick={() =>
                                                onSavePlatformPrompts(platform)
                                            }
                                            disabled={loading}
                                            variant='outline'
                                            size='sm'
                                            className='button border-green-600 text-green-600 hover:bg-green-600 hover:text-white'
                                        >
                                            {loading
                                                ? "Saving..."
                                                : "Save Prompts"}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                )
            })}
        </Accordion>
    )
}
