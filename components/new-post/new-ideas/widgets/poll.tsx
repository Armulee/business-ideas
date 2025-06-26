"use client"

import type React from "react"

import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import WidgetBase from "./base"
import { Input } from "@/components/ui/input"
import { useWidgetForm } from "../provider"
import WidgetTab from "./tab"

// Update the QuickPollWidgetProps interface
interface QuickPollWidgetProps {
    id: string
    onRemove: () => void
    dragAttributes?: React.HTMLAttributes<HTMLDivElement>
    isDragging?: boolean
}

export default function QuickPollWidget({
    id,
    onRemove,
    dragAttributes,
    isDragging,
}: QuickPollWidgetProps) {
    const { pollData, setPollData } = useWidgetForm()
    const generateId = (key: string) =>
        `${key}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const handleAddNewOption = () => {
        setPollData((prev) => ({
            ...prev,
            options: [
                ...prev.options,
                { id: generateId("poll-value"), value: "", vote: [] },
            ],
        }))
    }

    // Delete a individual option
    const handleDeleteOption = (id: string) => {
        setPollData((prev) => ({
            ...prev,
            options: prev.options.filter((option) => option.id !== id),
        }))
    }

    return (
        <WidgetBase
            id={id}
            title='Quick Poll'
            onRemove={onRemove}
            dragAttributes={dragAttributes}
            isDragging={isDragging}
        >
            <WidgetTab>Quick Poll</WidgetTab>
            <Input
                required
                placeholder='Enter your poll question'
                className='input my-4'
                onChange={(e) =>
                    setPollData((prev) => ({
                        ...prev,
                        question: e.target.value,
                    }))
                }
                value={pollData.question}
            />

            {pollData.options.map((option) => (
                <div key={option.id} className='flex'>
                    <Input
                        required
                        value={option.value}
                        placeholder='Enter your option'
                        className={`w-full input mb-4`}
                        onChange={(e) => {
                            setPollData((prev) => ({
                                ...prev,
                                options: prev.options.map((opt) =>
                                    option.id === opt.id
                                        ? {
                                              ...opt,
                                              value: e.target.value,
                                          }
                                        : opt
                                ),
                            }))
                        }}
                    />
                    <Button
                        type='button'
                        variant={"ghost"}
                        className='px-2 ml-1 bg-transparent hover:bg-transparent'
                        onClick={() => handleDeleteOption(option.id)}
                    >
                        <Trash2 className='text-red-400' />
                    </Button>
                </div>
            ))}

            <Button
                type='button'
                onClick={handleAddNewOption}
                className='w-full glassmorphism bg-transparent hover:bg-white/10 mb-2'
            >
                <Plus />
                Add New Option
            </Button>

            <div className='pt-3'>
                <Button
                    disabled
                    className='w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white'
                >
                    Vote
                </Button>
            </div>
        </WidgetBase>
    )
}
