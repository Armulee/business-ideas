"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Collapsible,
    CollapsibleContent,
} from "@/components/ui/collapsible"
import AutoHeightTextarea from "@/components/ui/auto-height-textarea"
import { FaLinkedin, FaMeta, FaXTwitter } from "react-icons/fa6"
import { Flame, Plus, Minus } from "lucide-react"

interface MainPlatformData {
    purpose: string
    systemPrompt: string
    userPrompt: string
    imagePrompt?: string
}

interface SocialPlatformData {
    purpose?: string
    systemPrompt: string
    userPrompt: string
    imagePrompt?: string
}

interface EditDialogProps {
    open: boolean
    platform: string
    data: MainPlatformData | SocialPlatformData
    loading: boolean
    onOpenChange: (open: boolean) => void
    onDataChange: (data: MainPlatformData | SocialPlatformData) => void
    onSave: () => void
}

const platformConfig = {
    main: {
        name: "Main Platform",
        icon: Flame,
        color: "text-orange-500",
    },
    linkedin: {
        name: "LinkedIn",
        icon: FaLinkedin,
        color: "text-blue-500",
    },
    x: { name: "X (Twitter)", icon: FaXTwitter, color: "text-white" },
    meta: { name: "Meta (Facebook)", icon: FaMeta, color: "text-blue-500" },
}

export default function EditDialog({
    open,
    platform,
    data,
    loading,
    onOpenChange,
    onDataChange,
    onSave,
}: EditDialogProps) {
    const [isPromptsExpanded, setIsPromptsExpanded] = useState(false)
    const [additionalConfigs, setAdditionalConfigs] = useState<
        Array<{
            id: string
            purpose: string
            systemPrompt: string
            userPrompt: string
            imagePrompt: string
        }>
    >([])
    const platformInfo = platformConfig[platform as keyof typeof platformConfig]
    const isMainPlatform = platform === "main"

    const handlePurposeChange = (purpose: string) => {
        if (isMainPlatform) {
            onDataChange({ ...data, purpose } as MainPlatformData)
        }
    }

    const handlePromptChange = (field: string, value: string) => {
        onDataChange({ ...data, [field]: value })
    }

    const addAdditionalConfig = () => {
        const newConfig = {
            id: Date.now().toString(),
            purpose: "",
            systemPrompt: "",
            userPrompt: "",
            imagePrompt: "",
        }
        setAdditionalConfigs([...additionalConfigs, newConfig])
    }

    const removeAdditionalConfig = (id: string) => {
        setAdditionalConfigs(
            additionalConfigs.filter((config) => config.id !== id)
        )
    }

    const handleAdditionalConfigChange = (
        id: string,
        field: string,
        value: string
    ) => {
        setAdditionalConfigs(
            additionalConfigs.map((config) =>
                config.id === id ? { ...config, [field]: value } : config
            )
        )
    }

    const Icon = platformInfo?.icon || Flame

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='bg-gray-900 border-gray-700 text-white max-w-3xl max-h-[90vh] overflow-hidden flex flex-col'>
                <DialogHeader>
                    <DialogTitle>
                        <div className='flex items-center gap-3'>
                            <Icon
                                className={`w-5 h-5 ${platformInfo?.color}`}
                            />
                            <div>Edit {platformInfo?.name || platform}</div>
                        </div>
                        <p className='text-left text-sm font-normal text-gray-400 mt-1'>
                            Configure platform settings and prompts
                        </p>
                    </DialogTitle>
                </DialogHeader>

                <div className='overflow-y-auto flex-1 px-1'>
                    {/* Purpose Field - For Main Platform */}
                    {isMainPlatform && (
                        <div className='space-y-2'>
                            <label className='text-white text-sm font-medium'>
                                Content Purpose
                            </label>
                            <Input
                                value={(data as MainPlatformData).purpose}
                                onChange={(e) =>
                                    handlePurposeChange(e.target.value)
                                }
                                placeholder='Enter content purpose...'
                                className='input'
                            />
                        </div>
                    )}

                    {/* Purpose Field - For Social Platforms */}
                    {!isMainPlatform && (
                        <div className='space-y-2'>
                            <label className='text-white text-sm font-medium'>
                                Content Purpose
                            </label>
                            <Input
                                value={
                                    (data as SocialPlatformData).purpose || ""
                                }
                                onChange={(e) =>
                                    handlePromptChange(
                                        "purpose",
                                        e.target.value
                                    )
                                }
                                placeholder='Enter content purpose...'
                                className='input'
                            />
                        </div>
                    )}

                    {/* Collapsible Prompts Section */}
                    <div className='flex justify-start mt-2 pb-4'>
                        <Button
                            type='button'
                            onClick={() =>
                                setIsPromptsExpanded(!isPromptsExpanded)
                            }
                            variant='outline'
                            size='sm'
                            className='border-gray-600 button text-white !text-xs hover:bg-gray-800'
                        >
                            {isPromptsExpanded
                                ? "Hide Configure"
                                : "Show Configure"}
                        </Button>
                    </div>

                    <Collapsible
                        open={isPromptsExpanded}
                        onOpenChange={setIsPromptsExpanded}
                    >
                        <CollapsibleContent className='space-y-4 py-4'>
                            {/* System Prompt */}
                            <div className='space-y-2'>
                                <label className='text-white text-sm font-medium'>
                                    System Prompt
                                </label>
                                <AutoHeightTextarea
                                    value={data.systemPrompt}
                                    onChange={(e) =>
                                        handlePromptChange(
                                            "systemPrompt",
                                            e.target.value
                                        )
                                    }
                                    placeholder='Enter system prompt...'
                                    className='min-h-[100px] bg-gray-800 border-gray-600 text-white'
                                />
                            </div>

                            {/* User Prompt */}
                            <div className='space-y-2'>
                                <label className='text-white text-sm font-medium'>
                                    User Prompt
                                </label>
                                <AutoHeightTextarea
                                    value={data.userPrompt}
                                    onChange={(e) =>
                                        handlePromptChange(
                                            "userPrompt",
                                            e.target.value
                                        )
                                    }
                                    placeholder='Enter user prompt...'
                                    className='min-h-[100px] bg-gray-800 border-gray-600 text-white'
                                />
                            </div>

                            {/* Image Prompt - Only for social platforms */}
                            {!isMainPlatform && (
                                <div className='space-y-2'>
                                    <label className='text-white text-sm font-medium'>
                                        Image Prompt
                                    </label>
                                    <AutoHeightTextarea
                                        value={data.imagePrompt || ""}
                                        onChange={(e) =>
                                            handlePromptChange(
                                                "imagePrompt",
                                                e.target.value
                                            )
                                        }
                                        placeholder='Enter image generation prompt...'
                                        className='min-h-[80px] bg-gray-800 border-gray-600 text-white'
                                    />
                                </div>
                            )}
                        </CollapsibleContent>
                    </Collapsible>

                    {/* Additional Configurations */}
                    {additionalConfigs.map((config) => (
                        <div key={config.id} className='space-y-4'>
                            {/* Purpose Field */}
                            <div className='space-y-2'>
                                <label className='text-white text-sm font-medium'>
                                    Purpose
                                </label>
                                <Input
                                    value={config.purpose}
                                    onChange={(e) =>
                                        handleAdditionalConfigChange(
                                            config.id,
                                            "purpose",
                                            e.target.value
                                        )
                                    }
                                    placeholder='Enter purpose...'
                                    className='input'
                                />
                            </div>

                            {/* System Prompt */}
                            <div className='space-y-2'>
                                <label className='text-white text-sm font-medium'>
                                    System Prompt
                                </label>
                                <AutoHeightTextarea
                                    value={config.systemPrompt}
                                    onChange={(e) =>
                                        handleAdditionalConfigChange(
                                            config.id,
                                            "systemPrompt",
                                            e.target.value
                                        )
                                    }
                                    placeholder='Enter system prompt...'
                                    className='min-h-[100px] bg-gray-800 border-gray-600 text-white'
                                />
                            </div>

                            {/* User Prompt */}
                            <div className='space-y-2'>
                                <label className='text-white text-sm font-medium'>
                                    User Prompt
                                </label>
                                <AutoHeightTextarea
                                    value={config.userPrompt}
                                    onChange={(e) =>
                                        handleAdditionalConfigChange(
                                            config.id,
                                            "userPrompt",
                                            e.target.value
                                        )
                                    }
                                    placeholder='Enter user prompt...'
                                    className='min-h-[100px] bg-gray-800 border-gray-600 text-white'
                                />
                            </div>

                            {/* Image Prompt - exclude main */}
                            {!isMainPlatform && (
                                <div className='space-y-2'>
                                    <label className='text-white text-sm font-medium'>
                                        Image Prompt
                                    </label>
                                    <AutoHeightTextarea
                                        value={config.imagePrompt}
                                        onChange={(e) =>
                                            handleAdditionalConfigChange(
                                                config.id,
                                                "imagePrompt",
                                                e.target.value
                                            )
                                        }
                                        placeholder='Enter image generation prompt...'
                                        className='min-h-[80px] bg-gray-800 border-gray-600 text-white'
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <DialogFooter>
                    <Button
                        onClick={onSave}
                        disabled={loading}
                        className='bg-blue-600 hover:bg-blue-700'
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                        type='button'
                        onClick={
                            additionalConfigs.length > 0
                                ? () =>
                                      removeAdditionalConfig(
                                          additionalConfigs[
                                              additionalConfigs.length - 1
                                          ].id
                                      )
                                : addAdditionalConfig
                        }
                        variant='outline'
                        className={`border-gray-600 button hover:bg-gray-800 md:mt-0 mb-2 ${
                            additionalConfigs.length > 0
                                ? "text-red-400 hover:text-red-300 border-red-600"
                                : "text-white"
                        }`}
                    >
                        {additionalConfigs.length > 0 ? (
                            <>
                                <Minus className='w-4 h-4 mr-2' />
                                Remove Configuration
                            </>
                        ) : (
                            <>
                                <Plus className='w-4 h-4 mr-2' />
                                Add Configuration
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
