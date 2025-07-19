"use client"

import { Plus, Trash2 } from "lucide-react"
import WidgetBase from "./base"
import { Button } from "@/components/ui/button"
import React, { useRef } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useWidgetForm } from "../provider"
import WidgetTab from "./tab"

interface SummaryWidgetProps {
    id: string
    onRemove: () => void
    dragAttributes?: React.HTMLAttributes<HTMLDivElement>
    isDragOverlay?: boolean
}

export default function SummaryWidget({
    id,
    onRemove,
    dragAttributes,
    isDragOverlay,
}: SummaryWidgetProps) {
    const { summaries, setSummaries } = useWidgetForm()
    const generateId = (key: string) =>
        `${key}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const inputRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({})

    const handleAdd = () => {
        setSummaries((prev) => prev.length < 1 ? [
            ...prev,
            {
                id: generateId("summary"),
                topic: "",
                values: [],
            },
        ] : prev)
    }

    const handleAddItem = (summaryId: string) => {
        setSummaries((prev) => {
            const newId = generateId("value")
            const newSummaries = prev.map((summary) =>
                summary.id === summaryId
                    ? {
                          ...summary,
                          values: summary.values.length < 5 ? [
                              ...summary.values,
                              { id: newId, value: "" }, // New value added
                          ] : summary.values,
                      }
                    : summary
            )

            // Wait for state to update, then focus the new input
            setTimeout(() => {
                inputRefs.current[newId]?.focus()
            }, 0)

            return newSummaries
        })
    }

    // Delete a summary topic
    const handleDeleteTopic = (summaryId: string) => {
        setSummaries((prevSummaries) =>
            prevSummaries.filter((summary) => summary.id !== summaryId)
        )
    }

    // Delete a individual value
    const handleDeleteValue = (summaryId: string, valueId: string) => {
        setSummaries((prevSummaries) =>
            prevSummaries.map((summary) =>
                summary.id === summaryId
                    ? {
                          ...summary,
                          values: summary.values.filter(
                              (value) => value.id !== valueId
                          ),
                      }
                    : summary
            )
        )
    }

    return (
        <WidgetBase
            id={id}
            title='Business Summary'
            onRemove={onRemove}
            dragAttributes={dragAttributes}
            isDragging={isDragOverlay}
        >
            <WidgetTab>Quick Summarized</WidgetTab>
            {summaries.map((summary) => (
                <div key={summary.id}>
                    <div className='w-full flex justify-center items-center gap-1 mb-2'>
                        <Input
                            name='summary.topic'
                            className='glassmorphism placeholder:text-white/50'
                            placeholder='Enter the summary topic'
                            // prevent the form submitting when press 'enter'
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault()
                                }
                            }}
                            onChange={(e) =>
                                setSummaries((prev) =>
                                    prev.map((s) =>
                                        s.id === summary.id
                                            ? { ...s, topic: e.target.value }
                                            : s
                                    )
                                )
                            }
                        />

                        <Button
                            type='button'
                            variant={"ghost"}
                            className='px-2 ml-1 bg-transparent hover:bg-transparent'
                            onClick={() => handleDeleteTopic(summary.id)}
                        >
                            <Trash2 className='text-red-400' />
                        </Button>
                    </div>
                    <div className='mb-5'>
                        {summary.values.map((value) => (
                            <div
                                key={value.id}
                                className='flex items-start mb-2'
                            >
                                <div className='flex-shrink-0 text-blue-400 mt-2 mr-2'>
                                    •
                                </div>
                                <Textarea
                                    ref={(el) => {
                                        inputRefs.current[value.id] = el
                                    }}
                                    placeholder='Enter your detail'
                                    name='summary.detail'
                                    className='max-w-full min-h-[36px] h-[36px] glassmorphism placeholder:text-white/50 text-white overflow-hidden resize-none'
                                    onInput={(e) => {
                                        const target =
                                            e.target as HTMLTextAreaElement
                                        target.style.height = "36px"
                                        target.style.height = `${target.scrollHeight}px`
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault()
                                            handleAddItem(summary.id) // Add new detail when Enter is pressed
                                        } else if (
                                            e.key === "Backspace" &&
                                            value.value === ""
                                        ) {
                                            e.preventDefault()
                                            handleDeleteValue(
                                                summary.id,
                                                value.id
                                            ) // Delete the detail when empty and Backspace is pressed
                                        }
                                    }}
                                    onChange={(e) =>
                                        setSummaries((prev) =>
                                            prev.map((s) =>
                                                s.id === summary.id
                                                    ? {
                                                          ...s,
                                                          values: s.values.map(
                                                              (v) =>
                                                                  v.id ===
                                                                  value.id
                                                                      ? {
                                                                            ...v,
                                                                            value: e
                                                                                .target
                                                                                .value,
                                                                        }
                                                                      : v
                                                          ),
                                                      }
                                                    : s
                                            )
                                        )
                                    }
                                />

                                <Button
                                    type='button'
                                    variant={"ghost"}
                                    className='px-2 ml-1 bg-transparent hover:bg-transparent'
                                    onClick={() =>
                                        handleDeleteValue(summary.id, value.id)
                                    }
                                >
                                    <Trash2 className='text-red-400' />
                                </Button>
                            </div>
                        ))}
                        {summary.values.length < 5 && (
                            <div className='w-full flex justify-center'>
                                <Button
                                    type='button'
                                    className='px-4 text-center glassmorphism text-white bg-transparent hover:bg-white/10 transition duration-300'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleAddItem(summary.id)
                                    }}
                                >
                                    <Plus />
                                    Add Detail
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {/* Add button */}
            {summaries.length < 1 && (
                <div className='flex items-center gap-2'>
                    <Button
                        type='button'
                        onClick={(e) => {
                            e.stopPropagation()
                            handleAdd()
                        }}
                        className='w-full pt-2 text-center glassmorphism text-white bg-transparent hover:bg-white/10 transition duration-300'
                    >
                        <Plus />
                        Add New Topic
                    </Button>
                </div>
            )}
        </WidgetBase>
    )
}
